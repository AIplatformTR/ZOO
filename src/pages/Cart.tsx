import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { handleFirestoreError, OperationType } from '../utils/firestoreErrorHandler';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';

export const Cart: React.FC = () => {
  const { items, updateQuantity, removeFromCart, totalPrice, clearCart } = useCart();
  const { user, profile, login } = useAuth();
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    phone: profile?.phone || '',
    address: profile?.deliveryAddress || ''
  });

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      login();
      return;
    }

    setIsSubmitting(true);
    try {
      const orderData = {
        userId: user.uid,
        customerInfo: {
          name: formData.name,
          email: user.email,
          phone: formData.phone,
          deliveryAddress: formData.address
        },
        items: items.map(item => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        totalAmount: totalPrice,
        status: 'Новый',
        paymentStatus: 'Ожидает оплаты',
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, 'orders'), orderData);
      clearCart();
      alert('Заказ успешно оформлен!');
      navigate('/');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'orders');
      alert('Ошибка при оформлении заказа. Попробуйте снова.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <div className="w-24 h-24 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="w-10 h-10 text-stone-400" />
        </div>
        <h2 className="text-2xl font-bold text-stone-900 mb-4">Ваша корзина пуста</h2>
        <p className="text-stone-500 mb-8">Похоже, вы еще ничего не добавили. Перейдите в каталог, чтобы найти товары для вашего питомца.</p>
        <Link to="/catalog" className="inline-flex items-center justify-center px-8 py-3 bg-emerald-600 text-white font-medium rounded-full hover:bg-emerald-700 transition-colors">
          Перейти в каталог
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-stone-900 mb-8">Оформление заказа</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl shadow-sm border border-stone-100 p-6 sm:p-8">
            <h2 className="text-xl font-bold text-stone-900 mb-6 border-b border-stone-100 pb-4">Товары в корзине</h2>
            <div className="space-y-6">
              {items.map(item => (
                <div key={item.productId} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 py-4 border-b border-stone-50 last:border-0">
                  <img src={item.imageUrl} alt={item.name} className="w-24 h-24 object-cover rounded-xl bg-stone-50" referrerPolicy="no-referrer" />
                  <div className="flex-grow">
                    <Link to={`/product/${item.productId}`} className="font-semibold text-stone-900 hover:text-emerald-600 transition-colors line-clamp-2 mb-2">
                      {item.name}
                    </Link>
                    <div className="text-lg font-bold text-stone-900">{item.price.toLocaleString('ru-RU')} ₽</div>
                  </div>
                  <div className="flex items-center gap-4 mt-4 sm:mt-0">
                    <div className="flex items-center bg-stone-100 rounded-full p-1">
                      <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="p-2 hover:bg-white rounded-full transition-colors">
                        <Minus className="w-4 h-4 text-stone-600" />
                      </button>
                      <span className="w-8 text-center font-medium text-stone-900">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="p-2 hover:bg-white rounded-full transition-colors">
                        <Plus className="w-4 h-4 text-stone-600" />
                      </button>
                    </div>
                    <button onClick={() => removeFromCart(item.productId)} className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors" title="Удалить">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Checkout Form */}
        <div className="lg:col-span-1">
          <div className="bg-stone-50 rounded-3xl p-6 sm:p-8 sticky top-24">
            <h2 className="text-xl font-bold text-stone-900 mb-6">Итого</h2>
            
            <div className="flex justify-between items-center mb-4 text-stone-600">
              <span>Товары ({items.reduce((a, b) => a + b.quantity, 0)})</span>
              <span>{totalPrice.toLocaleString('ru-RU')} ₽</span>
            </div>
            <div className="flex justify-between items-center mb-6 text-stone-600">
              <span>Доставка</span>
              <span className="text-emerald-600 font-medium">Бесплатно</span>
            </div>
            
            <div className="flex justify-between items-center mb-8 pt-6 border-t border-stone-200">
              <span className="text-lg font-bold text-stone-900">К оплате</span>
              <span className="text-2xl font-bold text-stone-900">{totalPrice.toLocaleString('ru-RU')} ₽</span>
            </div>

            <form onSubmit={handleCheckout} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Имя получателя</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                  placeholder="Иван Иванов"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Телефон</label>
                <input 
                  type="tel" 
                  required
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                  placeholder="+7 (999) 000-00-00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Адрес доставки</label>
                <textarea 
                  required
                  value={formData.address}
                  onChange={e => setFormData({...formData, address: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all resize-none h-24"
                  placeholder="г. Москва, ул. Примерная, д. 1, кв. 1"
                />
              </div>

              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-stone-400 text-white px-6 py-4 rounded-xl font-bold text-lg transition-colors"
                >
                  {isSubmitting ? 'Оформление...' : (
                    <>
                      {user ? 'Оформить заказ' : 'Войти и оформить'}
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
                <p className="text-xs text-stone-500 text-center mt-4">
                  Нажимая кнопку, вы соглашаетесь с условиями обработки персональных данных. Оплата при получении (MVP).
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
