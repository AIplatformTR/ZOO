import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, Search, MessageSquare } from 'lucide-react';

export const Home: React.FC = () => {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-emerald-900 text-white overflow-hidden py-24 sm:py-32">
        <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/pets/1920/1080')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-6">
              Умный магазин для ваших <span className="text-emerald-400">любимцев</span>
            </h1>
            <p className="text-lg sm:text-xl text-emerald-100 mb-10 leading-relaxed">
              От корма до игрушек — мы подберем идеальные товары с помощью нашего AI-ветеринара. Быстро, удобно и с заботой.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/catalog" className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-emerald-900 bg-white rounded-full hover:bg-emerald-50 transition-colors">
                Перейти в каталог
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <button 
                onClick={() => setChatOpen(true)}
                className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white border-2 border-emerald-400 rounded-full hover:bg-emerald-800 transition-colors"
              >
                <Sparkles className="mr-2 w-5 h-5 text-emerald-400" />
                Подобрать с AI
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-stone-900 mb-12 text-center">Кого вы любите?</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {['Собаки', 'Кошки', 'Грызуны', 'Птицы', 'Рыбки'].map((category, i) => (
              <Link 
                key={category} 
                to={`/catalog?category=${category}`}
                className="group flex flex-col items-center p-6 bg-white rounded-3xl shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
              >
                <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-4 group-hover:bg-emerald-200 transition-colors">
                  <img src={`https://picsum.photos/seed/${category}/100/100`} alt={category} className="w-12 h-12 rounded-full object-cover mix-blend-multiply" referrerPolicy="no-referrer" />
                </div>
                <span className="font-semibold text-stone-800">{category}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
