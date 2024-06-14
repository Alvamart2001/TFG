import React, { useEffect, useState } from 'react';
import './MainPage.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { db } from './firebaseConfig';
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';

function MainPage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const navigate = useNavigate();

  const carouselItems = [
    '/img/alimentacion-saludable-banner.jpg',
    '/img/ropa-hombre-banner.jpg'
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(db, 'Productos'));
      const products = [];
      querySnapshot.forEach((doc) => {
        products.push({ id: doc.id, ...doc.data() });
      });

      const filteredProducts = products.filter(product => product.stock <= 10);

      setFeaturedProducts(filteredProducts);
    };

    fetchProducts().catch(error => {
      console.log("Error getting documents:", error);
    });
  }, []);

  const handleProductClick = (id) => {
    navigate(`/product-details/${id}`);
  };

  return (
    <main className="main-container-mainpage">
      <div>
        <div id="carousel-mainpage" className="carousel slide" data-bs-ride="carousel" data-bs-interval="10000">
          <div className="carousel-inner">
          {carouselItems.map((item, index) => (
            <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`} style={{ backgroundImage: `url(${item})`, backgroundSize: 'cover' }}>
              <div className="d-flex align-items-center justify-content-center h-100">
                <div className="text-center">
                  <h2>{item.descripcion}</h2>
                  <p>{item.talla}</p>
                </div>
              </div>
            </div>
            ))}
          </div>
          <button className="carousel-control-prev d-none d-sm-block" type="button" data-bs-target="#carousel-mainpage" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button className="carousel-control-next d-none d-sm-block" type="button" data-bs-target="#carousel-mainpage" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </div>
      
      {/* Productos Destacados */}
      <section className="featured-products">
        <h2>Productos destacados</h2>
        <div className="products-grid-mainpage">
          {featuredProducts.map(product => (
            <div key={product.id} className="product-box-mainpage" onClick={() => handleProductClick(product.id)}>
              <img src={product.img} alt={product.descripcion} className="product-img" />
              <div className="product-info-mainpage">
                <h3>{product.descripcion}</h3>
                <div className="product-price">€{product.precio}</div>
                {product.stock <= 10 && <span className="discount-badge">Últimas unidades!</span>}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default MainPage;