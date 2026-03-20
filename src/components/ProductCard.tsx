import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface Product {
  id: string;
  name: string;
  category: string;
  type: string;
  price: number;
  description: string;
  imageUrl: string;
  stock: number;
}

export const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full">
      <Link to={`/product/${product.id}`} className="block relative aspect-square overflow-hidden bg-stone-100">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          referrerPolicy="no-referrer"
        />
        {product.stock <= 5 && product.stock > 0 && (
          <span className="absolute top-2 left-2 bg-amber-100 text-amber-800 text-xs font-bold px-2 py-1 rounded-full">
            Осталось мало
          </span>
        )}
        {product.stock === 0 && (
          <span className="absolute top-2 left-2 bg-red-100 text-red-800 text-xs font-bold px-2 py-1 rounded-full">
            Нет в наличии
          </span>
        )}
      </Link>
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">{product.category}</span>
          <span className="text-xs text-stone-500">{product.type}</span>
        </div>
        <Link to={`/product/${product.id}`} className="block mb-2">
          <h3 className="font-semibold text-stone-900 line-clamp-2 hover:text-emerald-600 transition-colors">{product.name}</h3>
        </Link>
        <div className="mt-auto flex items-center justify-between pt-4">
          <span className="font-bold text-lg text-stone-900">{product.price.toLocaleString('ru-RU')} ₽</span>
          <button 
            onClick={() => addToCart({
              productId: product.id,
              name: product.name,
              price: product.price,
              imageUrl: product.imageUrl
            })}
            disabled={product.stock === 0}
            className="p-2 rounded-full bg-stone-100 text-stone-600 hover:bg-emerald-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="В корзину"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
