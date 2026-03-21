import React, { useEffect, useState, useRef } from 'react';
import { collection, query, doc, updateDoc, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { handleFirestoreError, OperationType } from '../utils/firestoreErrorHandler';
import { Package, Clock, CheckCircle, XCircle, Truck, Bell, Box } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { formatPrice } from '../utils/currency';

export const Admin: React.FC = () => {
  const { profile } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [activeTab, setActiveTab] = useState<'orders' | 'inventory'>('orders');
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language.split('-')[0];
  
  const initialLoadRef = useRef(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio element for notifications
    audioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
    
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    if (profile?.role !== 'admin') return;
    
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newOrders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Check for new orders if not initial load
      if (!initialLoadRef.current) {
        const addedDocs = snapshot.docChanges().filter(change => change.type === 'added');
        if (addedDocs.length > 0) {
          // Play sound
          if (audioRef.current) {
            audioRef.current.play().catch(e => console.warn('Audio play failed:', e));
          }
          
          // Show push notification
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Новый заказ!', {
              body: `Получен новый заказ на сумму ${addedDocs[0].doc.data().totalAmount} ₽`,
              icon: '/favicon.ico'
            });
          }
        }
      } else {
        initialLoadRef.current = false;
      }
      
      setOrders(newOrders);
      setLoadingOrders(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'orders');
      setLoadingOrders(false);
    });

    return () => unsubscribe();
  }, [profile]);

  useEffect(() => {
    if (profile?.role !== 'admin') return;
    
    const q = query(collection(db, 'products_i18n'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newProducts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(newProducts);
      setLoadingProducts(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'products_i18n');
      setLoadingProducts(false);
    });

    return () => unsubscribe();
  }, [profile]);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { status: newStatus });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `orders/${orderId}`);
      alert(t('admin.updateError'));
    }
  };

  const updateProductStock = async (productId: string, newStock: number) => {
    if (newStock < 0) return;
    try {
      await updateDoc(doc(db, 'products_i18n', productId), { stock: newStock });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `products_i18n/${productId}`);
      alert('Ошибка при обновлении остатков');
    }
  };

  if (profile?.role !== 'admin') {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">{t('admin.accessDenied')}</h1>
        <p className="text-stone-600">{t('admin.noAdminRights')}</p>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Новый': return <Clock className="w-5 h-5 text-blue-500" />;
      case 'В обработке': return <Package className="w-5 h-5 text-amber-500" />;
      case 'Отправлен': return <Truck className="w-5 h-5 text-purple-500" />;
      case 'Доставлен': return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case 'Отменен': return <XCircle className="w-5 h-5 text-red-500" />;
      default: return <Clock className="w-5 h-5 text-stone-500" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-stone-900">{t('admin.title')}</h1>
        <div className="flex bg-stone-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === 'orders' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
          >
            <Package className="w-4 h-4" />
            Заказы
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === 'inventory' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
          >
            <Box className="w-4 h-4" />
            Остатки
          </button>
        </div>
      </div>

      {activeTab === 'orders' && (
        <>
          {loadingOrders ? (
            <div className="text-center py-20 text-stone-500">{t('admin.loading')}</div>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-stone-100 shadow-sm">
              <Package className="w-12 h-12 text-stone-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-stone-900">{t('admin.noOrders')}</h3>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-stone-50 border-b border-stone-100">
                      <th className="py-4 px-6 font-semibold text-stone-600 text-sm uppercase tracking-wider">{t('admin.idDate')}</th>
                      <th className="py-4 px-6 font-semibold text-stone-600 text-sm uppercase tracking-wider">{t('admin.customer')}</th>
                      <th className="py-4 px-6 font-semibold text-stone-600 text-sm uppercase tracking-wider">{t('admin.items')}</th>
                      <th className="py-4 px-6 font-semibold text-stone-600 text-sm uppercase tracking-wider">{t('admin.total')}</th>
                      <th className="py-4 px-6 font-semibold text-stone-600 text-sm uppercase tracking-wider">{t('admin.status')}</th>
                      <th className="py-4 px-6 font-semibold text-stone-600 text-sm uppercase tracking-wider">{t('admin.actions')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {orders.map(order => (
                      <tr key={order.id} className="hover:bg-stone-50/50 transition-colors">
                        <td className="py-4 px-6">
                          <div className="font-mono text-xs text-stone-500 mb-1">{order.id.slice(0, 8)}...</div>
                          <div className="text-sm text-stone-900">
                            {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString('ru-RU') : 'Неизвестно'}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="font-medium text-stone-900">{order.customerInfo.name}</div>
                          <div className="text-xs text-stone-500">{order.customerInfo.phone}</div>
                          <div className="text-xs text-stone-500 truncate max-w-[150px]" title={order.customerInfo.deliveryAddress}>
                            {order.customerInfo.deliveryAddress}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-sm text-stone-900">
                            {order.items.length} {t('admin.itemsCount')}
                          </div>
                          <div className="text-xs text-stone-500 truncate max-w-[200px]" title={order.items.map((i: any) => (i.name && typeof i.name === 'object') ? (i.name[currentLang] || i.name['en']) : i.name).join(', ')}>
                            {(order.items[0].name && typeof order.items[0].name === 'object') ? (order.items[0].name[currentLang] || order.items[0].name['en']) : order.items[0].name} {order.items.length > 1 && `и еще ${order.items.length - 1}`}
                          </div>
                        </td>
                        <td className="py-4 px-6 font-bold text-stone-900">
                          {formatPrice(order.totalAmount)}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(order.status)}
                            <span className="text-sm font-medium text-stone-700">
                              {order.status === 'Новый' ? t('admin.statusNew') :
                               order.status === 'В обработке' ? t('admin.statusProcessing') :
                               order.status === 'Отправлен' ? t('admin.statusShipped') :
                               order.status === 'Доставлен' ? t('admin.statusDelivered') :
                               order.status === 'Отменен' ? t('admin.statusCancelled') : order.status}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <select 
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                            className="bg-white border border-stone-200 text-stone-700 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5 outline-none"
                          >
                            <option value="Новый">{t('admin.statusNew')}</option>
                            <option value="В обработке">{t('admin.statusProcessing')}</option>
                            <option value="Отправлен">{t('admin.statusShipped')}</option>
                            <option value="Доставлен">{t('admin.statusDelivered')}</option>
                            <option value="Отменен">{t('admin.statusCancelled')}</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {activeTab === 'inventory' && (
        <>
          {loadingProducts ? (
            <div className="text-center py-20 text-stone-500">{t('admin.loading')}</div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-stone-100 shadow-sm">
              <Box className="w-12 h-12 text-stone-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-stone-900">Нет товаров</h3>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-stone-50 border-b border-stone-100">
                      <th className="py-4 px-6 font-semibold text-stone-600 text-sm uppercase tracking-wider">Товар</th>
                      <th className="py-4 px-6 font-semibold text-stone-600 text-sm uppercase tracking-wider">Категория</th>
                      <th className="py-4 px-6 font-semibold text-stone-600 text-sm uppercase tracking-wider">Цена</th>
                      <th className="py-4 px-6 font-semibold text-stone-600 text-sm uppercase tracking-wider">Остаток</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {products.map(product => {
                      const productName = (product.name && typeof product.name === 'object') ? (product.name[currentLang] || product.name['en']) : product.name;
                      return (
                        <tr key={product.id} className="hover:bg-stone-50/50 transition-colors">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <img src={product.imageUrl} alt={productName} className="w-10 h-10 rounded-lg object-cover bg-stone-100" referrerPolicy="no-referrer" />
                              <div className="font-medium text-stone-900 max-w-[300px] truncate" title={productName}>{productName}</div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                              {t(`categories.${product.category}`)}
                            </span>
                          </td>
                          <td className="py-4 px-6 font-medium text-stone-900">
                            {formatPrice(product.price)}
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              <input 
                                type="number" 
                                min="0"
                                value={product.stock}
                                onChange={(e) => updateProductStock(product.id, parseInt(e.target.value) || 0)}
                                className="w-20 bg-white border border-stone-200 text-stone-900 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block p-2 outline-none"
                              />
                              <span className="text-sm text-stone-500">шт.</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
