import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../mainPage/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import './ProductDetails.css';
import { CartContext } from '../../context/CartContext';

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isStockExceeded, setIsStockExceeded] = useState(false); // Estado para manejar si se excede el stock
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      const docRef = doc(db, 'Productos', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const productData = docSnap.data();
        setProduct(productData);
        if (productData.talla && productData.talla.length > 0) {
          setSelectedSize(productData.talla[0]);
        }
      } else {
        console.log("No such document!");
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    // Comprobar si la cantidad seleccionada excede el stock disponible
    if (product && quantity > product.stock) {
      setIsStockExceeded(true);
    } else {
      setIsStockExceeded(false);
    }
  }, [quantity, product]);

  if (!product) {
    return <div>Loading...</div>;
  }

  const handleAddToCart = () => {
    if (quantity <= product.stock) {
      addToCart({ ...product, id, selectedSize, quantity });
      navigate('/'); // Redirect to main page after adding to cart
    }
  };

  return (
    <div className="product-details-container">
      <div className="product-image">
        <img src={product.img} alt={product.descripcion} />
      </div>
      <div className="product-info">
        <h1>{product.descripcion}</h1>
        <p>Categoria: {product.categoria}</p>
        <p>{product.descripcion}</p>
        <p>Precio: €{product.precio}</p>
        <p>Stock: {product.stock}</p>
        {(product.categoria !== 'Cosmetica y Cuidado Personal' && product.categoria !== 'Alimentacion Saludable') && product.talla && product.talla.length > 0 && (
          <div className="product-size">
            <label htmlFor="size">Talla:</label>
            <select id="size" value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)}>
              {product.talla.map((talla, index) => (
                <option key={index} value={talla}>{talla}</option>
              ))}
            </select>
          </div>
        )}
        <div className="product-quantity">
          <label htmlFor="quantity">Cantidad:</label>
          <input
            type="number"
            id="quantity"
            value={quantity}
            min="1"
            max={product.stock}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
          {isStockExceeded && <p className="error-message">La cantidad seleccionada excede el stock disponible.</p>}
        </div>
        <button className="btn btn-primary" onClick={handleAddToCart} disabled={isStockExceeded}>Agregar al carrito</button>
      </div>
    </div>
  );
}

export default ProductDetails;
