import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { collection, query, getDocs, where } from 'firebase/firestore';
import { db } from '../firebase';
import { ProductCard } from '../components/ProductCard';
import { handleFirestoreError, OperationType } from '../utils/firestoreErrorHandler';
import { Search, Filter } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { INITIAL_PRODUCTS } from '../data/initialProducts';

export const Catalog: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language.split('-')[0];

  const categoryFilter = searchParams.get('category');
  const typeFilter = searchParams.get('type');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let q = collection(db, 'products_i18n');
        // Simple client-side filtering for MVP to avoid complex composite indexes
        const querySnapshot = await getDocs(q);
        let fetchedProducts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as any }));

        // Fallback to initial products if database is empty
        if (fetchedProducts.length === 0) {
          fetchedProducts = [...INITIAL_PRODUCTS];
        }

        if (categoryFilter) {
          fetchedProducts = fetchedProducts.filter(p => p.category === categoryFilter);
        }
        if (typeFilter) {
          fetchedProducts = fetchedProducts.filter(p => p.type === typeFilter);
        }
        if (searchTerm) {
          fetchedProducts = fetchedProducts.filter(p => {
            const nameStr = (p.name && typeof p.name === 'object') ? (p.name[currentLang] || p.name['en'] || '') : (p.name || '');
            const descStr = (p.description && typeof p.description === 'object') ? (p.description[currentLang] || p.description['en'] || '') : (p.description || '');
            return nameStr.toLowerCase().includes(searchTerm.toLowerCase()) || 
                   descStr.toLowerCase().includes(searchTerm.toLowerCase());
          });
        }

        setProducts(fetchedProducts);
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, 'products_i18n');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryFilter, typeFilter, searchTerm, currentLang]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-stone-900">{t('nav.catalog')}</h1>
        
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder={t('catalog.search')} 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-stone-200 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 sticky top-24">
            <div className="flex items-center gap-2 mb-6 text-stone-900 font-semibold">
              <Filter className="w-5 h-5" />
              {t('catalog.filters')}
            </div>
            
            <div className="mb-6">
              <h3 className="text-sm font-medium text-stone-500 uppercase tracking-wider mb-3">{t('catalog.animal')}</h3>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    searchParams.delete('category');
                    setSearchParams(searchParams);
                  }}
                  className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    !categoryFilter 
                      ? 'bg-emerald-50 text-emerald-700 font-medium' 
                      : 'text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  {t('categories.all')}
                </button>
                {['dogs', 'cats', 'rodents', 'birds', 'fish'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => {
                      searchParams.set('category', cat);
                      setSearchParams(searchParams);
                    }}
                    className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      categoryFilter === cat 
                        ? 'bg-emerald-50 text-emerald-700 font-medium' 
                        : 'text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    {t(`categories.${cat}`)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-stone-500 uppercase tracking-wider mb-3">{t('catalog.productType')}</h3>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    searchParams.delete('type');
                    setSearchParams(searchParams);
                  }}
                  className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    !typeFilter 
                      ? 'bg-emerald-50 text-emerald-700 font-medium' 
                      : 'text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  {t('types.all')}
                </button>
                {['food', 'toys', 'accessories', 'pharmacy'].map(type => (
                  <button
                    key={type}
                    onClick={() => {
                      searchParams.set('type', type);
                      setSearchParams(searchParams);
                    }}
                    className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      typeFilter === type 
                        ? 'bg-emerald-50 text-emerald-700 font-medium' 
                        : 'text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    {t(`types.${type}`)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-grow">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="animate-pulse bg-white rounded-2xl h-80 border border-stone-100"></div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border border-stone-100">
              <p className="text-stone-500 text-lg">{t('catalog.notFound')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
