import React from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, Heart, Truck, Clock } from 'lucide-react';
import { motion } from 'motion/react';

export const About: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-3xl mx-auto mb-16"
      >
        <h1 className="text-4xl font-bold text-stone-900 mb-6">{t('nav.about')}</h1>
        <p className="text-lg text-stone-600 leading-relaxed">
          {t('about.subtitle', 'Мы — команда энтузиастов, которые любят животных так же сильно, как и вы. Наша цель — сделать уход за питомцами простым, удобным и технологичным.')}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
        {[
          { icon: Heart, title: t('about.features.care.title', 'С заботой о каждом'), desc: t('about.features.care.desc', 'Тщательно отбираем товары, проверяя составы и качество.') },
          { icon: Shield, title: t('about.features.quality.title', 'Гарантия качества'), desc: t('about.features.quality.desc', 'Работаем только с проверенными поставщиками и брендами.') },
          { icon: Truck, title: t('about.features.delivery.title', 'Быстрая доставка'), desc: t('about.features.delivery.desc', 'Доставляем заказы прямо до двери в кратчайшие сроки.') },
          { icon: Clock, title: t('about.features.support.title', 'Поддержка 24/7'), desc: t('about.features.support.desc', 'Наш AI-ветеринар и служба поддержки всегда на связи.') }
        ].map((feature, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 text-center"
          >
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <feature.icon className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-stone-900 mb-2">{feature.title}</h3>
            <p className="text-stone-600 text-sm leading-relaxed">{feature.desc}</p>
          </motion.div>
        ))}
      </div>

      <div className="bg-emerald-900 rounded-3xl overflow-hidden shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="p-8 md:p-12 flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              {t('about.mission.title', 'Наша миссия')}
            </h2>
            <p className="text-emerald-100 text-lg leading-relaxed mb-8">
              {t('about.mission.desc', 'Мы верим, что каждый питомец заслуживает лучшего. Поэтому мы создали PetStore AI — место, где передовые технологии помогают владельцам животных делать правильный выбор. Наш умный AI-ассистент анализирует потребности вашего любимца и предлагает только то, что ему действительно подходит.')}
            </p>
          </div>
          <div className="h-64 md:h-auto bg-[url('https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=800&q=80')] bg-cover bg-center"></div>
        </div>
      </div>
    </div>
  );
};
