import React, { useContext, useState, useEffect, useRef } from 'react';
import { CartContext } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';
import './CartDropdown.css';
import { loadStripe } from '@stripe/stripe-js';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../../screens/mainPage/firebaseConfig';

const stripePromise = loadStripe('pk_test_51PQ7oVP0QsaqRabXjvSuAw4YHahvyutalDBNpPJMlSf2jzmL9TdCUh9ZgEOPcJ9Ex2JXC7oRWq8UFMP04QYRMIFb00Bo9Z5zeV');

function CartDropdown({ isOpen, toggleCart }) {
  const { cart, removeFromCart, clearCart, addToOrderHistory } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const paymentCheckedRef = useRef(false); 

  const total = cart.reduce((acc, product) => acc + product.precio * product.quantity, 0).toFixed(2);

  async function handleCheckout() {
    const stripe = await stripePromise;
    try {
      const response = await fetch('http://localhost:3000/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: cart, userId: user.uid }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API response is not OK. Status: ${response.status}. Error: ${errorText}`);
      }

      const session = await response.json();

      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        alert(result.error.message);
      } else {
        console.log("Redirección a Stripe realizada con éxito");
      }
    } catch (error) {
      console.error('Error in handleCheckout:', error.message);
      alert(`Checkout error: ${error.message}`);
    }
  }

  useEffect(() => {
    async function checkPaymentStatus() {
      const urlParams = new URLSearchParams(window.location.search);
      const sessionId = urlParams.get('session_id');
      if (sessionId && !paymentCheckedRef.current) {
        try {
          const response = await fetch('http://localhost:3000/api/check-session', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ session_id: sessionId }),
          });

          if (!response.ok) {
            throw new Error('Failed to verify session');
          }

          const session = await response.json();

          if (session.payment_status === 'paid') {
            console.log("Payment successful, adding to order history");

          
            for (const item of cart) {
              const productRef = doc(db, 'Productos', item.id);
              const productDoc = await getDoc(productRef);
              if (productDoc.exists) {
                const newStock = productDoc.data().stock - item.quantity;
                await updateDoc(productRef, { stock: newStock });
              }
            }

            addToOrderHistory(cart, sessionId); 
            clearCart();
            paymentCheckedRef.current = true; 
            window.history.replaceState({}, document.title, "/");
          }
        } catch (error) {
          console.error('Error verifying payment status:', error.message);
        }
      }
    }

    checkPaymentStatus();
  }, [addToOrderHistory, cart, clearCart]);

  return (
    <div className={`cart-dropdown ${isOpen ? 'open' : ''}`}>
      <div className="cart-header">
        <h2>Carrito de Compras</h2>
        <button className="close-btn" onClick={toggleCart}>×</button>
      </div>
      <div className="cart-items">
        {cart.length === 0 ? (
          <p>El carrito está vacío</p>
        ) : (
          cart.map((product, index) => (
            <div key={index} className="cart-item">
              <img src={product.img} alt={product.descripcion} className="cart-item-image" />
              <div className="cart-item-info">
                <h3>{product.descripcion}</h3>
                {product.selectedSize && <p>Talla: {product.selectedSize}</p>}
                <p>Precio: €{(product.precio * product.quantity).toFixed(2)} {product.isDiscounted && <span className="discount-badge">Últimas unidades!</span>}</p>
                <p>Cantidad: {product.quantity}</p>
                <button className="btn btn-danger" onClick={() => removeFromCart(product.id, product.selectedSize)}>Eliminar</button>
              </div>
            </div>
          ))
        )}
      </div>
      {cart.length > 0 && (
        <div className="cart-footer">
          <p>Total ({cart.length} productos): €{total}</p>
          <button className="btn btn-primary" onClick={handleCheckout}>Comprar</button>
        </div>
      )}
    </div>
  );
}

export default CartDropdown;
