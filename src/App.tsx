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

// Тестовые данные для инициализации
const INITIAL_PRODUCTS = [
  {
    name: "Сухой корм Royal Canin Medium Adult, 15 кг",
    category: "Собаки",
    type: "Корм",
    price: 6200,
    description: "Полнорационный сухой корм для взрослых собак средних размеров (весом от 11 до 25 кг) в возрасте от 12 месяцев до 7 лет.",
    imageUrl: "https://picsum.photos/seed/dogfood1/400/400",
    stock: 15
  },
  {
    name: "Влажный корм Whiskas с говядиной и кроликом, 85 г",
    category: "Кошки",
    type: "Корм",
    price: 35,
    description: "Аппетитные кусочки в желе для взрослых кошек. 100% сбалансированный рацион.",
    imageUrl: "https://picsum.photos/seed/catfood1/400/400",
    stock: 200
  },
  {
    name: "Игрушка для собак Kong Classic, средняя",
    category: "Собаки",
    type: "Игрушки",
    price: 1150,
    description: "Легендарная игрушка из сверхпрочной резины. Идеальна для жевания и игр в апорт. Можно начинять лакомствами.",
    imageUrl: "https://picsum.photos/seed/kongtoy/400/400",
    stock: 40
  },
  {
    name: "Когтеточка-столбик с лежанкой",
    category: "Кошки",
    type: "Аксессуары",
    price: 2500,
    description: "Удобная когтеточка из сизаля с мягкой плюшевой лежанкой наверху. Высота 60 см.",
    imageUrl: "https://picsum.photos/seed/catscratcher/400/400",
    stock: 12
  },
  {
    name: "Капли от блох и клещей Стронгхолд для кошек",
    category: "Кошки",
    type: "Ветаптека",
    price: 1800,
    description: "Эффективное средство от наружных и внутренних паразитов (блох, клещей, гельминтов). 3 пипетки.",
    imageUrl: "https://picsum.photos/seed/stronghold/400/400",
    stock: 30
  },
  {
    name: "Клетка для хомяков Ferplast Duna Space",
    category: "Грызуны",
    type: "Аксессуары",
    price: 4800,
    description: "Просторная двухэтажная клетка с прозрачным пластиковым поддоном. В комплекте колесо, поилка, кормушка и домик.",
    imageUrl: "https://picsum.photos/seed/hamstercage/400/400",
    stock: 8
  },
  {
    name: "Корм для волнистых попугаев RIO, 1 кг",
    category: "Птицы",
    type: "Корм",
    price: 350,
    description: "Основной рацион для волнистых попугайчиков. Содержит отборные зерна, семена и водоросли.",
    imageUrl: "https://picsum.photos/seed/birdfood/400/400",
    stock: 50
  },
  {
    name: "Аквариумный фильтр Aquael Fan Filter 1 Plus",
    category: "Рыбки",
    type: "Аксессуары",
    price: 1650,
    description: "Внутренний фильтр для аквариумов объемом 60-100 литров. Обеспечивает отличную очистку и аэрацию воды.",
    imageUrl: "https://picsum.photos/seed/aquafilter/400/400",
    stock: 15
  },
  {
    name: "Силикагелевый наполнитель для туалета, 5 л",
    category: "Кошки",
    type: "Аксессуары",
    price: 750,
    description: "Отлично впитывает влагу и мгновенно блокирует запахи. Не пылит и не прилипает к лапам.",
    imageUrl: "https://picsum.photos/seed/catlitter/400/400",
    stock: 80
  },
  {
    name: "Рулетка Flexi New Classic, трос 5 м, до 12 кг",
    category: "Собаки",
    type: "Амуниция",
    price: 1300,
    description: "Надежный поводок-рулетка с тросом длиной 5 метров. Удобная тормозная система.",
    imageUrl: "https://picsum.photos/seed/dogleash/400/400",
    stock: 25
  }
];

function App() {
  useEffect(() => {
    // Seed database if empty
    const seedDatabase = async () => {
      try {
        const productsRef = collection(db, 'products');
        const snapshot = await getDocs(productsRef);
        
        if (snapshot.empty) {
          console.log('Seeding database with initial products...');
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
            </Route>
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
