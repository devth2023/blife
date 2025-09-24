// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// สมมุติว่าเรามีไฟล์เหล่านี้ ถ้ายังไม่มี ต้องสร้างแยก
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import Header from './components/Header';
import Footer from './components/Footer';
// Import Pages (ซึ่งต้องสร้างแยก)
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
// Import Dashboard Pages (ซึ่งต้องสร้างแยก)
import MemberDashboardPage from './pages/MemberDashboardPage';
import SellerDashboardPage from './pages/SellerDashboardPage';
import MLMDashboardPage from './pages/MLMDashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
// Import หน้าอื่นๆ ตามที่ต้องการ

const App: React.FC = () => {
  return (
    // 1. Setup Providers สำหรับ Context ต่างๆ
    <AuthProvider>
      <CartProvider>
        {/* 2. Setup Router สำหรับการทำ Routing */}
        <Router>
          <div className="flex flex-col min-h-screen">
            {/* 3. Header - แสดงทุกหน้า */}
            <Header />
            
            {/* 4. Main Content Area - เปลี่ยนตาม Route */}
            <main className="flex-grow">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                {/* Member Routes */}
                <Route path="/dashboard/*" element={<MemberDashboardPage />} />
                {/* Seller Routes */}
                <Route path="/seller/*" element={<SellerDashboardPage />} />
                {/* MLM Routes */}
                <Route path="/mlm/*" element={<MLMDashboardPage />} />
                {/* Admin Routes */}
                <Route path="/admin/*" element={<AdminDashboardPage />} />
                {/* 404 Page - ควรเพิ่ม Route สำหรับ Not Found */}
                {/* <Route path="*" element={<NotFoundPage />} /> */}
              </Routes>
            </main>
            
            {/* 5. Footer - แสดงทุกหน้า */}
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;