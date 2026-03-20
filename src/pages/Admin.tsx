import React, { useEffect, useState } from 'react';
import { collection, query, getDocs, doc, updateDoc, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { handleFirestoreError, OperationType } from '../utils/firestoreErrorHandler';
import { Package, Clock, CheckCircle, XCircle, Truck } from 'lucide-react';

export const Admin: React.FC = () => {
  const { profile } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (profile?.role !== 'admin') return;
      
      try {
        const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, 'orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [profile]);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { status: newStatus });
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `orders/${orderId}`);
      alert('Ошибка при обновлении статуса');
    }
  };

  if (profile?.role !== 'admin') {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Доступ запрещен</h1>
        <p className="text-stone-600">У вас нет прав администратора для просмотра этой страницы.</p>
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
      <h1 className="text-3xl font-bold text-stone-900 mb-8">Управление заказами (CRM)</h1>

      {loading ? (
        <div className="text-center py-20 text-stone-500">Загрузка заказов...</div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-stone-100 shadow-sm">
          <Package className="w-12 h-12 text-stone-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-stone-900">Заказов пока нет</h3>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-100">
                  <th className="py-4 px-6 font-semibold text-stone-600 text-sm uppercase tracking-wider">ID / Дата</th>
                  <th className="py-4 px-6 font-semibold text-stone-600 text-sm uppercase tracking-wider">Покупатель</th>
                  <th className="py-4 px-6 font-semibold text-stone-600 text-sm uppercase tracking-wider">Товары</th>
                  <th className="py-4 px-6 font-semibold text-stone-600 text-sm uppercase tracking-wider">Сумма</th>
                  <th className="py-4 px-6 font-semibold text-stone-600 text-sm uppercase tracking-wider">Статус</th>
                  <th className="py-4 px-6 font-semibold text-stone-600 text-sm uppercase tracking-wider">Действия</th>
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
                        {order.items.length} позиций
                      </div>
                      <div className="text-xs text-stone-500 truncate max-w-[200px]" title={order.items.map((i: any) => i.name).join(', ')}>
                        {order.items[0].name} {order.items.length > 1 && `и еще ${order.items.length - 1}`}
                      </div>
                    </td>
                    <td className="py-4 px-6 font-bold text-stone-900">
                      {order.totalAmount.toLocaleString('ru-RU')} ₽
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(order.status)}
                        <span className="text-sm font-medium text-stone-700">{order.status}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <select 
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className="bg-white border border-stone-200 text-stone-700 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5 outline-none"
                      >
                        <option value="Новый">Новый</option>
                        <option value="В обработке">В обработке</option>
                        <option value="Отправлен">Отправлен</option>
                        <option value="Доставлен">Доставлен</option>
                        <option value="Отменен">Отменен</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
