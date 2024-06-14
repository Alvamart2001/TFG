import React from 'react';
import './Footer.css';
import { FaFacebook, FaTwitter, FaInstagram, FaWhatsapp, FaTelegram } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="footer d-flex flex-column flex-md-row justify-content-between align-items-center p-4">
      <div className="text-center text-md-start textWhite mb-3 mb-md-0">
        ©️ 2024 ActiveStyle. Todos los derechos reservados. | 
        <a href="/privacy-policy" className="text-decoration-none"> Política de privacidad</a> | 
        <a href="/terms-and-conditions" className="text-decoration-none"> Términos y condiciones</a> | 
        Contáctanos: <a href="mailto:info@activeStyle.com" className="text-decoration-none">activestyletfg@gmail.com</a>
      </div>
      <div className="d-flex justify-content-center justify-content-md-start">
        <a href="https://x.com/activestyletfg" target="_blank" rel="noopener noreferrer">
          <FaTwitter size={32} className="mx-2 icon-hover" />
        </a>
        <a href="https://www.instagram.com/activestyletfg/" target="_blank" rel="noopener noreferrer">
          <FaInstagram size={32} className="mx-2 icon-hover" />
        </a>
      </div>
    </footer>
  );
}

export default Footer;
