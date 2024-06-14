import React, { useState, useContext, useEffect, useRef } from 'react';
import './Navbar.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import LogoAS from '/img/logo.png';
import { Link } from 'react-router-dom';
import CartDropdown from '../cart/CartDropdown';
import { AuthContext } from '../../context/AuthContext';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileMenuVisible, setIsProfileMenuVisible] = useState(false);
  const [isFaqMenuVisible, setIsFaqMenuVisible] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);

  const profileMenuRef = useRef(null);
  const faqMenuRef = useRef(null);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuVisible(!isProfileMenuVisible);
  };

  const toggleFaqMenu = () => {
    setIsFaqMenuVisible(!isFaqMenuVisible);
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuVisible(false);
      }
      if (faqMenuRef.current && !faqMenuRef.current.contains(event.target)) {
        setIsFaqMenuVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="navbar-container">
      <nav className="navbar navbar-dark bg-black d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <button className="navbar-toggler" type="button" onClick={toggleSidebar}>
            <span className="navbar-toggler-icon"></span>
          </button>
          <Link className="navbar-brand d-flex align-items-center ms-2" to="/">
            <img src={LogoAS} alt="Logo" className="logo img-fluid" />
          </Link>
        </div>
        
        <div className="d-flex align-items-center">
          <div className="nav-item dropdown" ref={faqMenuRef}>
            <a className="nav-link dropdown-toggle" onClick={toggleFaqMenu}>
              Faq
            </a>
            {isFaqMenuVisible && (
              <div className="faq-menu">
                <Link className="dropdown-item" to="/faq/shipping">Plazos y métodos de envío</Link>
                <Link className="dropdown-item" to="/faq/tracking">Seguimiento y actualizaciones</Link>
                <Link className="dropdown-item" to="/faq/address-management">Gestión de direcciones y entregas</Link>
                <Link className="dropdown-item" to="/faq/shipping-options">Opciones y gastos de envío</Link>
                <Link className="dropdown-item" to="/faq/delays">Retrasos y situaciones especiales</Link>
              </div>
            )}
          </div>
          {user && (
            <>
              <button className="nav-link" onClick={toggleCart}>Cesta</button>
              <CartDropdown isOpen={isCartOpen} toggleCart={toggleCart} />
            </>
          )}
          <div className="nav-item dropdown" ref={profileMenuRef}>
            <a className="nav-link dropdown-toggle" onClick={toggleProfileMenu}>
              Perfil
            </a>
            {isProfileMenuVisible && (
              <div className="profile-menu">
                {!user && <Link className="dropdown-item" to="/login">Iniciar Sesión</Link>}
                {user && (
                  <>
                    <Link className="dropdown-item" to="/order-history">Historial Pedidos</Link>
                    <button className="dropdown-item" onClick={logout}>Cerrar Sesión</button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>
      
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <button className="close-btn" onClick={toggleSidebar}>×</button>
        <ul className="sidebar-menu">
          <li><a href="/ropa-mujer">Ropa para Mujer</a></li>
          <li><a href="/ropa-hombre">Ropa para Hombre</a></li>
          <li><a href="/cosmetica-cuidados">Cosmética y Cuidado Personal</a></li>
          <li><Link to="/alimentacion-saludable">Alimentación Saludable</Link></li>
        </ul>
      </div>
    </div>
  );
}

export default Navbar;
