import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProfilePage } from './pages/ProfilePage';

// Code splitting: Lazy load secondary routes to keep initial bundle tiny and fast
const CategoriesPage = lazy(() => import('./pages/CategoriesPage').then(m => ({ default: m.CategoriesPage })));
const CategoryDetailPage = lazy(() => import('./pages/CategoryDetailPage').then(m => ({ default: m.CategoryDetailPage })));
const CollectionsPage = lazy(() => import('./pages/CollectionsPage').then(m => ({ default: m.CollectionsPage })));
const CollectionDetailPage = lazy(() => import('./pages/CollectionDetailPage').then(m => ({ default: m.CollectionDetailPage })));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage').then(m => ({ default: m.ProductDetailPage })));
const CartPage = lazy(() => import('./pages/CartPage').then(m => ({ default: m.CartPage })));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage').then(m => ({ default: m.CheckoutPage })));
const WorkshopsPage = lazy(() => import('./pages/WorkshopsPage').then(m => ({ default: m.WorkshopsPage })));
const WorkshopDetailPage = lazy(() => import('./pages/WorkshopDetailPage').then(m => ({ default: m.WorkshopDetailPage })));
const OrdersPage = lazy(() => import('./pages/OrdersPage').then(m => ({ default: m.OrdersPage })));
const AboutPage = lazy(() => import('./pages/AboutPage').then(m => ({ default: m.AboutPage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then(m => ({ default: m.ContactPage })));
const AdminPage = lazy(() => import('./pages/AdminPage').then(m => ({ default: m.AdminPage })));
const DesignSystemShowcase = lazy(() => import('./pages/DesignSystemShowcase').then(m => ({ default: m.DesignSystemShowcase })));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then(m => ({ default: m.NotFoundPage })));

const RouteLoading: React.FC = () => (
  <div className="min-h-[50vh] flex items-center justify-center text-[#79002F] font-serif text-sm">
    <div className="w-6 h-6 border-2 border-[#79002F] border-t-transparent rounded-full animate-spin" />
  </div>
);

export const App: React.FC = () => {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Suspense fallback={<RouteLoading />}>
        <Routes>
          <Route element={<AppLayout />}>
            {/* Core Fast Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/profile" element={<ProfilePage />} />

            {/* On-Demand Lazy Routes */}
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/categories/:slug" element={<CategoryDetailPage />} />
            <Route path="/collections" element={<CollectionsPage />} />
            <Route path="/collections/:slug" element={<CollectionDetailPage />} />
            <Route path="/products/:slug" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/workshops" element={<WorkshopsPage />} />
            <Route path="/workshops/:slug" element={<WorkshopDetailPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/design-system" element={<DesignSystemShowcase />} />

            {/* 404 Catch-All */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
