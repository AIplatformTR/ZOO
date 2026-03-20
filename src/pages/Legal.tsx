import React from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const Legal: React.FC = () => {
  const { type } = useParams<{ type: string }>();
  const { t, i18n } = useTranslation();

  const getTitle = () => {
    switch (type) {
      case 'privacy': return t('footer.privacy');
      case 'terms': return t('footer.terms');
      case 'kvkk': return t('footer.kvkk');
      default: return 'Legal Information';
    }
  };

  const getContent = () => {
    const lang = i18n.language.split('-')[0];
    
    if (type === 'privacy') {
      if (lang === 'tr') return (
        <div className="space-y-4">
          <p><strong>Gizlilik Politikası</strong></p>
          <p>Son güncellenme: 20 Mart 2026</p>
          <p>PetStore AI olarak gizliliğinize saygı duyuyoruz. Bu Gizlilik Politikası, web sitemizi kullandığınızda kişisel bilgilerinizi nasıl topladığımızı, kullandığımızı ve koruduğumuzu açıklar.</p>
          <h3 className="text-lg font-bold mt-6">1. Topladığımız Bilgiler</h3>
          <p>Adınız, e-posta adresiniz, telefon numaranız ve teslimat adresiniz gibi bilgileri, siparişlerinizi işlemek için topluyoruz.</p>
          <h3 className="text-lg font-bold mt-6">2. Bilgilerin Kullanımı</h3>
          <p>Bilgilerinizi siparişlerinizi teslim etmek, müşteri hizmetleri sağlamak ve yasal yükümlülüklerimizi yerine getirmek için kullanırız.</p>
          <h3 className="text-lg font-bold mt-6">3. Veri Güvenliği</h3>
          <p>Kişisel verilerinizi yetkisiz erişime karşı korumak için endüstri standardı güvenlik önlemleri alıyoruz.</p>
        </div>
      );
      if (lang === 'ru') return (
        <div className="space-y-4">
          <p><strong>Политика конфиденциальности</strong></p>
          <p>Последнее обновление: 20 марта 2026</p>
          <p>Мы уважаем вашу конфиденциальность. Эта политика объясняет, как мы собираем, используем и защищаем вашу личную информацию.</p>
          <h3 className="text-lg font-bold mt-6">1. Какую информацию мы собираем</h3>
          <p>Мы собираем ваше имя, email, телефон и адрес доставки для обработки заказов.</p>
          <h3 className="text-lg font-bold mt-6">2. Как мы используем информацию</h3>
          <p>Мы используем данные для доставки заказов, поддержки клиентов и выполнения юридических обязательств.</p>
        </div>
      );
      return (
        <div className="space-y-4">
          <p><strong>Privacy Policy</strong></p>
          <p>Last updated: March 20, 2026</p>
          <p>We respect your privacy. This policy explains how we collect, use, and protect your personal information.</p>
          <h3 className="text-lg font-bold mt-6">1. Information We Collect</h3>
          <p>We collect your name, email, phone number, and delivery address to process your orders.</p>
          <h3 className="text-lg font-bold mt-6">2. How We Use Information</h3>
          <p>We use your information to deliver orders, provide customer support, and fulfill legal obligations.</p>
        </div>
      );
    }

    if (type === 'terms') {
      if (lang === 'tr') return (
        <div className="space-y-4">
          <p><strong>Mesafeli Satış Sözleşmesi</strong></p>
          <p>Madde 1: Taraflar</p>
          <p>İşbu sözleşme, PetStore AI (Satıcı) ile web sitesinden alışveriş yapan Alıcı arasında akdedilmiştir.</p>
          <p>Madde 2: Konu</p>
          <p>İşbu sözleşmenin konusu, Alıcının Satıcıya ait web sitesinden elektronik ortamda siparişini yaptığı ürünün satışı ve teslimi ile ilgili olarak 6502 sayılı Tüketicinin Korunması Hakkında Kanun hükümleri gereğince tarafların hak ve yükümlülüklerinin saptanmasıdır.</p>
          <p>Madde 3: Cayma Hakkı</p>
          <p>Alıcı, ürünü teslim aldığı tarihten itibaren 14 gün içinde hiçbir gerekçe göstermeksizin cayma hakkına sahiptir.</p>
        </div>
      );
      if (lang === 'ru') return (
        <div className="space-y-4">
          <p><strong>Пользовательское соглашение (Условия продажи)</strong></p>
          <p>Настоящее соглашение регулирует отношения между магазином PetStore AI и Покупателем.</p>
          <p>Оформляя заказ, Покупатель соглашается с условиями доставки и оплаты, указанными на сайте.</p>
          <p>Покупатель имеет право на возврат товара надлежащего качества в течение 14 дней с момента получения.</p>
        </div>
      );
      return (
        <div className="space-y-4">
          <p><strong>Distance Sales Agreement / Terms of Service</strong></p>
          <p>This agreement regulates the relationship between PetStore AI (Seller) and the Buyer.</p>
          <p>By placing an order, the Buyer agrees to the delivery and payment terms specified on the website.</p>
          <p>The Buyer has the right to return the product within 14 days of receipt.</p>
        </div>
      );
    }

    if (type === 'kvkk') {
      if (lang === 'tr') return (
        <div className="space-y-4">
          <p><strong>Kişisel Verilerin Korunması ve İşlenmesi Hakkında Aydınlatma Metni (KVKK)</strong></p>
          <p>Veri Sorumlusu: PetStore AI</p>
          <p>6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca, kişisel verileriniz veri sorumlusu sıfatıyla PetStore AI tarafından aşağıda açıklanan kapsamda işlenebilecektir.</p>
          <h3 className="text-lg font-bold mt-6">Kişisel Verilerin İşlenme Amacı</h3>
          <p>Toplanan kişisel verileriniz, ürün ve hizmetlerimizin sizlere sunulabilmesi, sözleşme süreçlerinin yürütülmesi ve müşteri ilişkileri yönetimi amaçlarıyla işlenmektedir.</p>
          <h3 className="text-lg font-bold mt-6">Kişisel Veri Sahibinin Hakları</h3>
          <p>KVKK'nın 11. maddesi uyarınca, kişisel verilerinizin işlenip işlenmediğini öğrenme, işlenmişse bilgi talep etme, eksik/yanlış işlenme varsa düzeltilmesini isteme haklarına sahipsiniz.</p>
        </div>
      );
      if (lang === 'ru') return (
        <div className="space-y-4">
          <p><strong>Соглашение об обработке персональных данных (KVKK)</strong></p>
          <p>В соответствии с Законом о защите персональных данных Турции (KVKK № 6698), ваши данные обрабатываются PetStore AI в качестве контроллера данных.</p>
          <p>Ваши данные используются исключительно для предоставления услуг, выполнения договоров и управления отношениями с клиентами.</p>
          <p>Вы имеете право запросить информацию о ваших данных, потребовать их исправления или удаления.</p>
        </div>
      );
      return (
        <div className="space-y-4">
          <p><strong>Personal Data Protection Law (KVKK) Information Notice</strong></p>
          <p>In accordance with the Turkish Personal Data Protection Law No. 6698 ("KVKK"), your personal data is processed by PetStore AI as the data controller.</p>
          <p>Your data is used solely for providing our services, executing contracts, and managing customer relations.</p>
          <p>You have the right to request information about your data, and ask for its correction or deletion.</p>
        </div>
      );
    }

    return <p>Document not found.</p>;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-stone-900 mb-8">{getTitle()}</h1>
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100 prose prose-stone max-w-none">
        {getContent()}
      </div>
    </div>
  );
};
