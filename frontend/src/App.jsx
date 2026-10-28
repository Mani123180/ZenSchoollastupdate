import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import Features from './pages/Features';
import Pricing from './pages/Pricing';
import About from './pages/About';
import Academics from './pages/Academics';
import StudentLife from './pages/StudentLife';
import Admissions from './pages/Admissions';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Portal from './pages/Portal';

export default function App() {
  const location = useLocation();
  const isPortal = location.pathname.startsWith('/portal');
  const isLogin = location.pathname === '/login';

  return (
    <div className="app-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {!isPortal && !isLogin && <Navbar />}

      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/features" element={<Features />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/about" element={<About />} />
          <Route path="/academics" element={<Academics />} />
          <Route path="/student-life" element={<StudentLife />} />
          <Route path="/admissions" element={<Admissions />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/portal" element={<Portal />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>

      
      {!isPortal && !isLogin && <Footer />}
    </div>
  );
}
