// src/components/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css"; 

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>© {new Date().getFullYear()} UaiEats - Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}

export default Footer;
