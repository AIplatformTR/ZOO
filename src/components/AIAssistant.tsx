import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, ArrowRight, MessageSquare, X, Loader2 } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { GoogleGenAI } from '@google/genai';
import { Link } from 'react-router-dom';

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface Message {
  role: 'user' | 'model';
  text: string;
}

export const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Здравствуйте! Я ваш персональный AI-ветеринар. Расскажите о вашем питомце (вид, порода, возраст, аллергии), и я подберу идеальный корм или игрушку из нашего каталога!' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [catalogContext, setCatalogContext] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => console.warn('Geolocation error:', error)
      );
    }
  }, []);

  // Fetch catalog for AI context
  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'products_i18n'));
        const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as any }));
        const contextString = products.map(p => {
          const name = typeof p.name === 'object' ? (p.name['ru'] || p.name['en']) : p.name;
          const desc = typeof p.description === 'object' ? (p.description['ru'] || p.description['en']) : p.description;
          return `- ID: ${p.id}, Название: ${name}, Категория: ${p.category}, Тип: ${p.type}, Цена: ${p.price} руб, Описание: ${desc}, В наличии: ${p.stock} шт.`;
        }).join('\n');
        setCatalogContext(contextString);
      } catch (error) {
        console.error('Error fetching catalog for AI:', error);
      }
    };
    fetchCatalog();
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const systemInstruction = `Ты ветеринар-консультант и продавец в интернет-магазине зоотоваров PetStore AI. 
Твоя задача: помогать пользователям подбирать корм и товары, задавая вопросы о виде питомца, породе, возрасте и наличии аллергий. 
Предлагай товары ТОЛЬКО из нашего каталога. Не придумывай товары, которых нет в списке.
Если пользователь просит товар, которого нет, вежливо скажи об этом и предложи альтернативу из каталога.
Отвечай кратко, дружелюбно и профессионально.
Используй форматирование Markdown для выделения названий товаров.

НАШ КАТАЛОГ ТОВАРОВ:
${catalogContext}`;

      const chat = ai.chats.create({
        model: 'gemini-3.1-flash-preview',
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      // Send chat history (excluding the first welcome message as it's hardcoded in UI, but we should send it to model context)
      // Actually, for simplicity in MVP, we can just send the whole history as a single prompt, or use the chat session properly.
      // Let's use the chat session properly by sending previous messages if needed, or just send the latest.
      // Since ai.chats.create creates a new session, we need to pass the history.
      // The SDK might not support passing history directly in create(), so we'll just send the current message.
      // Wait, to keep context, we should instantiate `chat` outside or keep it in a ref.
      
      // For MVP, let's just send the whole conversation history as a single prompt to generateContent, or keep the chat instance in a ref.
      // Let's use generateContent with history.
      
      const prompt = messages.map(m => `${m.role === 'user' ? 'Покупатель' : 'Ветеринар'}: ${m.text}`).join('\n') + `\nПокупатель: ${userMessage}\nВетеринар:`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.7,
          tools: [{ googleMaps: {} }],
          ...(location ? {
            toolConfig: {
              retrievalConfig: {
                latLng: {
                  latitude: location.lat,
                  longitude: location.lng
                }
              }
            }
          } : {})
        }
      });

      // Extract URLs from grounding if available
      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      let textResponse = response.text || 'Извините, я не смог обработать ваш запрос.';
      
      if (groundingChunks) {
        const mapLinks = groundingChunks
          .filter(chunk => chunk.web?.uri || chunk.maps?.uri)
          .map(chunk => `\n- [${chunk.web?.title || chunk.maps?.title || 'Ссылка'}](${chunk.web?.uri || chunk.maps?.uri})`)
          .join('');
        
        if (mapLinks) {
          textResponse += `\n\n**Полезные ссылки:**${mapLinks}`;
        }
      }

      setMessages(prev => [...prev, { role: 'model', text: textResponse }]);
    } catch (error) {
      console.error('AI Error:', error);
      setMessages(prev => [...prev, { role: 'model', text: 'Произошла ошибка при обращении к AI. Пожалуйста, попробуйте позже.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="w-16 h-16 bg-emerald-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-emerald-700 hover:scale-105 transition-all"
        >
          {isOpen ? <X className="w-8 h-8" /> : <MessageSquare className="w-8 h-8" />}
        </button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-28 right-6 w-[90vw] sm:w-96 h-[500px] max-h-[80vh] bg-white rounded-2xl shadow-2xl border border-stone-200 flex flex-col z-50 overflow-hidden">
          {/* Header */}
          <div className="bg-emerald-600 p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6" />
              <div>
                <h3 className="font-bold leading-tight">AI Ветеринар</h3>
                <p className="text-xs text-emerald-100">Онлайн консультант</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-emerald-100 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-grow p-4 bg-stone-50 overflow-y-auto flex flex-col gap-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                  msg.role === 'user' 
                    ? 'bg-emerald-600 text-white rounded-tr-none' 
                    : 'bg-white text-stone-800 shadow-sm border border-stone-100 rounded-tl-none'
                }`}>
                  {/* Simple markdown rendering for bold text */}
                  {msg.text.split('**').map((part, i) => i % 2 === 1 ? <strong key={i}>{part}</strong> : part)}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-stone-100 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                  <span className="text-sm text-stone-500">Печатает...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-stone-100">
            <form onSubmit={handleSendMessage} className="relative">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Напишите сообщение..." 
                className="w-full bg-stone-100 rounded-full py-3 pl-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                disabled={isLoading}
              />
              <button 
                type="submit"
                disabled={!input.trim() || isLoading}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors disabled:opacity-50 disabled:hover:bg-transparent"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
