import React from 'react';
import Footer from './components/footer/Footer';
import MainPage from './screens/mainPage/MainPage';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar/Navbar'; 
import AlimentacionSaludable from './screens/products/alimentacion-saludable/alimentacionSaludable';
import RopaHombre from './screens/products/ropa-hombre/RopaHombre';
import RopaMujer from './screens/products/ropa-mujer/RopaMujer';
import CosmeticaCuidados from './screens/products/cosmetica-cuidados/CosmeticaCuidados'; 
import Login from './screens/login/Login';
import Register from './screens/register/Register';
import ProductDetails from './screens/productDetails/ProductDetails';
import PrivacyPolicy from './screens/privacyPolicy/PrivacyPolicy'; 
import TermsAndConditions from './screens/termsAndConditions/TermsAndConditions'; 
import OrderHistory from './screens/orderHistory/OrderHistory';
import ShippingFaq from './screens/faq/shippingFaq/ShippingFaq';
import TrackingFaq from './screens/faq/trackingFaq/TrackingFaq';
import AddressFaq from './screens/faq/addressFaq/AddressFaq'; 
import ShippingCostsFaq from './screens/faq/shippingCostsFaq/ShippingCostsFaq';
import DelaysFaq from './screens/faq/delaysFaq/DelaysFaq';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import Success from './components/Success';
import Cancel from './components/Cancel';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <div className="App">
          <Router>
            <Navbar />
            <Routes>
              <Route path="/alimentacion-saludable" element={<AlimentacionSaludable />} />
              <Route path="/cosmetica-cuidados" element={<CosmeticaCuidados />} /> 
              <Route path="/ropa-hombre" element={<RopaHombre />} />
              <Route path="/ropa-mujer" element={<RopaMujer />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/product-details/:id" element={<ProductDetails />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} /> {}
              <Route path="/terms-and-conditions" element={<TermsAndConditions />} /> {}
              <Route path="/order-history" element={<OrderHistory />} />
              <Route path="/faq/shipping" element={<ShippingFaq />} />
              <Route path="/faq/tracking" element={<TrackingFaq />} />
              <Route path="/faq/address-management" element={<AddressFaq />} />
              <Route path="/faq/shipping-options" element={<ShippingCostsFaq />} />
              <Route path="/faq/delays" element={<DelaysFaq />} />
              <Route path="/success" element={<Success />} />
              <Route path="/cancel" element={<Cancel />} />
              <Route path="/" element={<MainPage />} />
            </Routes>
          </Router>
          <main>
          </main>
          <Footer />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
