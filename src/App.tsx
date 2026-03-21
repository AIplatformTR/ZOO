import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Catalog } from './pages/Catalog';
import { ProductDetails } from './pages/ProductDetails';
import { Cart } from './pages/Cart';
import { Admin } from './pages/Admin';
import { Legal } from './pages/Legal';
import { About } from './pages/About';
import { INITIAL_PRODUCTS } from './data/initialProducts';
import { ErrorBoundary } from './components/ErrorBoundary';

function DatabaseSeeder() {
  const { profile } = useAuth();
  const isAdmin = profile?.role === 'admin';

  useEffect(() => {
    // Seed database if empty and user is admin
    const seedDatabase = async () => {
      if (!isAdmin || !db) return;
      
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
  }, [isAdmin]);

  return null;
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <DatabaseSeeder />
        <CartProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="about" element={<About />} />
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
    </ErrorBoundary>
  );
}

export default App;
