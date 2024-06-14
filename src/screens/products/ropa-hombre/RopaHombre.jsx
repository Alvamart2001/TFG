import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './RopaHombre'
import { db } from '../../mainPage/firebaseConfig';
import { collection, getDocs, query, where } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';

function RopaHombre() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      const q = query(collection(db, 'Productos'), where('categoria', '==', 'Ropa de hombre'));
      const querySnapshot = await getDocs(q);
      const productsList = [];
      querySnapshot.forEach((doc) => {
        productsList.push({ id: doc.id, ...doc.data() });
      });
      setProducts(productsList);
    };

    fetchProducts().catch(error => {
      console.log("Error getting documents:", error);
    });
  }, []);

  const handleProductClick = (id) => {
    navigate(`/product-details/${id}`);
  };

  return (
    <main className="main-container">
      <section className="featured-products">
        <h2>Ropa de Hombre</h2>
        <div className="products-grid-mainpage">
          {products.map(product => (
            <div key={product.id} className="product-box-mainpage" onClick={() => handleProductClick(product.id)}>
              <img src={product.img} alt={`Imagen de ${product.descripcion}`} className="product-img" />
              <div className="product-info-mainpage">
                <h3>{product.descripcion}</h3>
                <div className="product-price">€{product.precio}</div>
                {product.stock <= 10 && <div className="discount-badge">Últimas unidades</div>}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default RopaHombre;
