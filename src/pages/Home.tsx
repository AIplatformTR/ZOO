import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const Home: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-emerald-900 text-white overflow-hidden py-24 sm:py-32">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-6">
              {t('home.title')} <span className="text-emerald-400">{t('home.titleHighlight')}</span>
            </h1>
            <p className="text-lg sm:text-xl text-emerald-100 mb-10 leading-relaxed">
              {t('home.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/catalog" className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-emerald-900 bg-white rounded-full hover:bg-emerald-50 transition-colors">
                {t('home.toCatalog')}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-stone-900 mb-12 text-center">{t('home.whoDoYouLove')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {[
              { id: 'dogs', img: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=100&q=80' },
              { id: 'cats', img: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=100&q=80' },
              { id: 'rodents', img: 'https://images.unsplash.com/photo-1425082661705-1834bfd0999c?auto=format&fit=crop&w=100&q=80' },
              { id: 'birds', img: 'https://images.unsplash.com/photo-1552728089-57168bb3e003?auto=format&fit=crop&w=100&q=80' },
              { id: 'fish', img: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=100&q=80' }
            ].map((category) => (
              <Link 
                key={category.id} 
                to={`/catalog?category=${category.id}`}
                className="group flex flex-col items-center p-6 bg-white rounded-3xl shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
              >
                <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-4 group-hover:bg-emerald-200 transition-colors">
                  <img src={category.img} alt={t(`categories.${category.id}`)} className="w-12 h-12 rounded-full object-cover mix-blend-multiply" referrerPolicy="no-referrer" />
                </div>
                <span className="font-semibold text-stone-800">{t(`categories.${category.id}`)}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
