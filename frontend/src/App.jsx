import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Sidebar from './components/Sidebar';
import SplashEntrance from './components/SplashEntrance';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Customers from './pages/Customers';
import Sellers from './pages/Sellers';
import Warehouses from './pages/Warehouses';
import Calculator from './pages/Calculator';
import Orders from './pages/Orders';
import AiChat from './components/AiChat';
import './App.css';

function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <>
      {showSplash && <SplashEntrance onEnter={() => setShowSplash(false)} />}
      <BrowserRouter>
        <div className="app-layout" style={{ opacity: showSplash ? 0 : 1, transition: 'opacity 0.5s ease 0.3s' }}>
          <Sidebar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/products" element={<Products />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/sellers" element={<Sellers />} />
              <Route path="/warehouses" element={<Warehouses />} />
              <Route path="/calculator" element={<Calculator />} />
              <Route path="/orders" element={<Orders />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
      {!showSplash && <AiChat />}
    </>
  );
}

export default App;
