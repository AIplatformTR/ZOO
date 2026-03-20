import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useCart } from '../context/CartContext';
import { handleFirestoreError, OperationType } from '../utils/firestoreErrorHandler';
import { ArrowLeft, ShoppingCart, CheckCircle, AlertCircle } from 'lucide-react';

export const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `products/${id}`);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-20 text-center">Загрузка...</div>;
  }

  if (!product) {
    return <div className="max-w-7xl mx-auto px-4 py-20 text-center">Товар не найден</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/catalog" className="inline-flex items-center text-stone-500 hover:text-emerald-600 mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Назад в каталог
      </Link>

      <div className="bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image */}
          <div className="bg-stone-50 p-8 flex items-center justify-center">
            <img 
              src={product.imageUrl} 
              alt={product.name} 
              className="max-w-full max-h-[500px] object-contain rounded-2xl shadow-sm"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Details */}
          <div className="p-8 md:p-12 flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-full">
                {product.category}
              </span>
              <span className="text-stone-500 text-sm">{product.type}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-stone-900 mb-6 leading-tight">
              {product.name}
            </h1>

            <div className="text-4xl font-bold text-stone-900 mb-8">
              {product.price.toLocaleString('ru-RU')} ₽
            </div>

            <div className="prose prose-stone mb-10">
              <h3 className="text-lg font-semibold mb-2">Описание</h3>
              <p className="text-stone-600 leading-relaxed">{product.description}</p>
            </div>

            <div className="mt-auto">
              {product.stock > 0 ? (
                <div className="flex items-center gap-2 text-emerald-600 mb-6 font-medium">
                  <CheckCircle className="w-5 h-5" />
                  В наличии ({product.stock} шт.)
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-600 mb-6 font-medium">
                  <AlertCircle className="w-5 h-5" />
                  Нет в наличии
                </div>
              )}

              <button
                onClick={() => addToCart({
                  productId: product.id,
                  name: product.name,
                  price: product.price,
                  imageUrl: product.imageUrl
                })}
                disabled={product.stock === 0}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-stone-300 disabled:cursor-not-allowed text-white px-8 py-4 rounded-full font-semibold text-lg transition-colors"
              >
                <ShoppingCart className="w-6 h-6" />
                Добавить в корзину
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
