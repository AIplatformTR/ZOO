import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Catalog } from './pages/Catalog';
import { ProductDetails } from './pages/ProductDetails';
import { Cart } from './pages/Cart';
import { Admin } from './pages/Admin';
import { Legal } from './pages/Legal';

// Тестовые данные для инициализации с переводами и новыми фото
const INITIAL_PRODUCTS = [
  {
    name: {
      ru: "Сухой корм Royal Canin Medium Adult, 15 кг",
      en: "Royal Canin Medium Adult Dry Dog Food, 15 kg",
      tr: "Royal Canin Medium Adult Kuru Köpek Maması, 15 kg"
    },
    category: "dogs",
    type: "food",
    price: 6200,
    description: {
      ru: "Полнорационный сухой корм для взрослых собак средних размеров (весом от 11 до 25 кг) в возрасте от 12 месяцев до 7 лет.",
      en: "Complete dry food for adult medium breed dogs (weight from 11 to 25 kg) aged 12 months to 7 years.",
      tr: "12 aylıktan 7 yaşına kadar orta ırk yetişkin köpekler (11-25 kg) için tam kuru mama."
    },
    imageUrl: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=400&q=80",
    stock: 15
  },
  {
    name: {
      ru: "Влажный корм Whiskas с говядиной и кроликом, 85 г",
      en: "Whiskas Wet Cat Food with Beef and Rabbit, 85 g",
      tr: "Whiskas Sığır ve Tavşan Etli Yaş Kedi Maması, 85 g"
    },
    category: "cats",
    type: "food",
    price: 35,
    description: {
      ru: "Аппетитные кусочки в желе для взрослых кошек. 100% сбалансированный рацион.",
      en: "Appetizing chunks in jelly for adult cats. 100% balanced diet.",
      tr: "Yetişkin kediler için jöle içinde iştah açıcı parçalar. %100 dengeli beslenme."
    },
    imageUrl: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=400&q=80",
    stock: 200
  },
  {
    name: {
      ru: "Игрушка для собак Kong Classic, средняя",
      en: "Kong Classic Dog Toy, Medium",
      tr: "Kong Classic Köpek Oyuncağı, Orta"
    },
    category: "dogs",
    type: "toys",
    price: 1150,
    description: {
      ru: "Легендарная игрушка из сверхпрочной резины. Идеальна для жевания и игр в апорт. Можно начинять лакомствами.",
      en: "Legendary ultra-durable rubber toy. Perfect for chewing and fetch games. Can be stuffed with treats.",
      tr: "Efsanevi ultra dayanıklı kauçuk oyuncak. Çiğneme ve getir-götür oyunları için ideal. İçi ödül maması ile doldurulabilir."
    },
    imageUrl: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=400&q=80",
    stock: 40
  },
  {
    name: {
      ru: "Когтеточка-столбик с лежанкой",
      en: "Cat Scratcher Post with Bed",
      tr: "Yataklı Kedi Tırmalama Sütunu"
    },
    category: "cats",
    type: "accessories",
    price: 2500,
    description: {
      ru: "Удобная когтеточка из сизаля с мягкой плюшевой лежанкой наверху. Высота 60 см.",
      en: "Comfortable sisal scratcher with a soft plush bed on top. Height 60 cm.",
      tr: "Üstünde yumuşak peluş yatak bulunan rahat sisal tırmalama tahtası. Yükseklik 60 cm."
    },
    imageUrl: "https://images.unsplash.com/photo-1543852786-1cf6624b9987?auto=format&fit=crop&w=400&q=80",
    stock: 12
  },
  {
    name: {
      ru: "Капли от блох и клещей Стронгхолд для кошек",
      en: "Stronghold Flea and Tick Drops for Cats",
      tr: "Kediler için Stronghold Pire ve Kene Damlası"
    },
    category: "cats",
    type: "vet",
    price: 1800,
    description: {
      ru: "Эффективное средство от наружных и внутренних паразитов (блох, клещей, гельминтов). 3 пипетки.",
      en: "Effective treatment against external and internal parasites (fleas, ticks, helminths). 3 pipettes.",
      tr: "Dış ve iç parazitlere (pire, kene, helmint) karşı etkili tedavi. 3 pipet."
    },
    imageUrl: "https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?auto=format&fit=crop&w=400&q=80",
    stock: 30
  },
  {
    name: {
      ru: "Клетка для хомяков Ferplast Duna Space",
      en: "Ferplast Duna Space Hamster Cage",
      tr: "Ferplast Duna Space Hamster Kafesi"
    },
    category: "rodents",
    type: "accessories",
    price: 4800,
    description: {
      ru: "Просторная двухэтажная клетка с прозрачным пластиковым поддоном. В комплекте колесо, поилка, кормушка и домик.",
      en: "Spacious two-story cage with a transparent plastic base. Includes a wheel, water bottle, feeder, and house.",
      tr: "Şeffaf plastik tabanlı geniş iki katlı kafes. Tekerlek, suluk, yemlik ve ev dahildir."
    },
    imageUrl: "https://images.unsplash.com/photo-1425082661705-1834bfd0999c?auto=format&fit=crop&w=400&q=80",
    stock: 8
  },
  {
    name: {
      ru: "Корм для волнистых попугаев RIO, 1 кг",
      en: "RIO Budgerigar Food, 1 kg",
      tr: "RIO Muhabbet Kuşu Yemi, 1 kg"
    },
    category: "birds",
    type: "food",
    price: 350,
    description: {
      ru: "Основной рацион для волнистых попугайчиков. Содержит отборные зерна, семена и водоросли.",
      en: "Main diet for budgerigars. Contains selected grains, seeds, and algae.",
      tr: "Muhabbet kuşları için ana besin. Seçilmiş tahıllar, tohumlar ve yosun içerir."
    },
    imageUrl: "https://images.unsplash.com/photo-1552728089-57168bb3e003?auto=format&fit=crop&w=400&q=80",
    stock: 50
  },
  {
    name: {
      ru: "Аквариумный фильтр Aquael Fan Filter 1 Plus",
      en: "Aquael Fan Filter 1 Plus Aquarium Filter",
      tr: "Aquael Fan Filter 1 Plus Akvaryum Filtresi"
    },
    category: "fish",
    type: "accessories",
    price: 1650,
    description: {
      ru: "Внутренний фильтр для аквариумов объемом 60-100 литров. Обеспечивает отличную очистку и аэрацию воды.",
      en: "Internal filter for aquariums of 60-100 liters. Provides excellent water cleaning and aeration.",
      tr: "60-100 litrelik akvaryumlar için iç filtre. Mükemmel su temizliği ve havalandırma sağlar."
    },
    imageUrl: "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=400&q=80",
    stock: 15
  },
  {
    name: {
      ru: "Силикагелевый наполнитель для туалета, 5 л",
      en: "Silica Gel Cat Litter, 5 L",
      tr: "Silika Jel Kedi Kumu, 5 L"
    },
    category: "cats",
    type: "accessories",
    price: 750,
    description: {
      ru: "Отлично впитывает влагу и мгновенно блокирует запахи. Не пылит и не прилипает к лапам.",
      en: "Excellently absorbs moisture and instantly blocks odors. Dust-free and doesn't stick to paws.",
      tr: "Nemi mükemmel şekilde emer ve kokuları anında hapseder. Tozsuzdur ve patilere yapışmaz."
    },
    imageUrl: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=400&q=80",
    stock: 80
  },
  {
    name: {
      ru: "Рулетка Flexi New Classic, трос 5 м, до 12 кг",
      en: "Flexi New Classic Retractable Leash, 5m cord, up to 12kg",
      tr: "Flexi New Classic Otomatik Kayış, 5m kordon, 12kg'a kadar"
    },
    category: "dogs",
    type: "equipment",
    price: 1300,
    description: {
      ru: "Надежный поводок-рулетка с тросом длиной 5 метров. Удобная тормозная система.",
      en: "Reliable retractable leash with a 5-meter cord. Convenient braking system.",
      tr: "5 metrelik kordonlu güvenilir otomatik kayış. Kullanışlı fren sistemi."
    },
    imageUrl: "https://images.unsplash.com/photo-1605025540943-77cd0256140b?auto=format&fit=crop&w=400&q=80",
    stock: 25
  }
];

function App() {
  useEffect(() => {
    // Seed database if empty
    const seedDatabase = async () => {
      try {
        const productsRef = collection(db, 'products_i18n');
        const snapshot = await getDocs(productsRef);
        
        if (snapshot.empty) {
          console.log('Seeding database with i18n products...');
          for (const product of INITIAL_PRODUCTS) {
            await addDoc(productsRef, {
              ...product,
              createdAt: serverTimestamp()
            });
          }
          console.log('Database seeded successfully!');
        }
      } catch (error) {
        console.error('Error seeding database:', error);
      }
    };

    seedDatabase();
  }, []);

  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="catalog" element={<Catalog />} />
              <Route path="product/:id" element={<ProductDetails />} />
              <Route path="cart" element={<Cart />} />
              <Route path="admin" element={<Admin />} />
              <Route path="legal/:type" element={<Legal />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
