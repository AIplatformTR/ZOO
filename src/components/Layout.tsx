import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { ShoppingCart, PawPrint, LogIn, LogOut, Shield, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { AIAssistant } from './AIAssistant';
import { useTranslation } from 'react-i18next';

export const Layout: React.FC = () => {
  const { user, profile, login, logout } = useAuth();
  const { totalItems } = useCart();
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 font-sans">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 transition-colors">
              <PawPrint className="w-8 h-8" />
              <span className="font-bold text-xl tracking-tight">PetStore AI</span>
            </Link>

            <nav className="hidden md:flex space-x-8">
              <Link to="/catalog" className="text-stone-600 hover:text-emerald-600 font-medium transition-colors">{t('nav.catalog')}</Link>
              <Link to="/about" className="text-stone-600 hover:text-emerald-600 font-medium transition-colors">{t('nav.about')}</Link>
            </nav>

            <div className="flex items-center gap-4">
              <div className="relative group flex items-center gap-1 text-stone-600 cursor-pointer">
                <Globe className="w-5 h-5" />
                <span className="text-sm font-medium uppercase">{i18n.language.split('-')[0]}</span>
                <div className="absolute top-full right-0 mt-2 w-32 bg-white rounded-xl shadow-lg border border-stone-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <button onClick={() => changeLanguage('tr')} className="block w-full text-left px-4 py-2 text-sm text-stone-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-t-xl">Türkçe</button>
                  <button onClick={() => changeLanguage('ru')} className="block w-full text-left px-4 py-2 text-sm text-stone-700 hover:bg-emerald-50 hover:text-emerald-700">Русский</button>
                  <button onClick={() => changeLanguage('en')} className="block w-full text-left px-4 py-2 text-sm text-stone-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-b-xl">English</button>
                </div>
              </div>

              <Link to="/cart" className="relative p-2 text-stone-600 hover:text-emerald-600 transition-colors">
                <ShoppingCart className="w-6 h-6" />
                {totalItems > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-emerald-500 rounded-full">
                    {totalItems}
                  </span>
                )}
              </Link>

              {user ? (
                <div className="flex items-center gap-3">
                  {profile?.role === 'admin' && (
                    <Link to="/admin" className="p-2 text-stone-600 hover:text-emerald-600 transition-colors" title={t('nav.admin')}>
                      <Shield className="w-5 h-5" />
                    </Link>
                  )}
                  <button onClick={logout} className="flex items-center gap-2 text-sm font-medium text-stone-600 hover:text-red-600 transition-colors">
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">{t('nav.logout')}</span>
                  </button>
                </div>
              ) : (
                <button onClick={login} className="flex items-center gap-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-full transition-colors">
                  <LogIn className="w-4 h-4" />
                  <span className="hidden sm:inline">{t('nav.login')}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <Outlet />
      </main>

      <AIAssistant />

      <footer className="bg-stone-900 text-stone-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 text-white mb-4">
              <PawPrint className="w-6 h-6" />
              <span className="font-bold text-lg">PetStore AI</span>
            </div>
            <p className="text-sm">{t('footer.desc')}</p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">{t('footer.nav')}</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/catalog" className="hover:text-white transition-colors">{t('nav.catalog')}</Link></li>
              <li><Link to="/cart" className="hover:text-white transition-colors">{t('nav.cart')}</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">{t('footer.legal')}</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/legal/privacy" className="hover:text-white transition-colors">{t('footer.privacy')}</Link></li>
              <li><Link to="/legal/terms" className="hover:text-white transition-colors">{t('footer.terms')}</Link></li>
              <li><Link to="/legal/kvkk" className="hover:text-white transition-colors">{t('footer.kvkk')}</Link></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};
