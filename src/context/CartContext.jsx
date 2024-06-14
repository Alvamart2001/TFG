import React, { createContext, useState, useEffect, useContext } from 'react';
import { db } from '../screens/mainPage/firebaseConfig';
import { AuthContext } from './AuthContext';
import { collection, addDoc, query, where, getDocs, doc, setDoc, updateDoc, getDoc } from 'firebase/firestore';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchCart = async () => {
      if (user) {
        const cartRef = doc(db, 'carts', user.uid);
        const cartDoc = await getDoc(cartRef);
        if (cartDoc.exists()) {
          setCart(cartDoc.data().items || []);
        }
      }
    };

    fetchCart();
  }, [user]);

  const saveCartToFirestore = async (updatedCart) => {
    if (user) {
      const cartRef = doc(db, 'carts', user.uid);
      await setDoc(cartRef, { items: updatedCart }, { merge: true });
    }
  };

  const checkStockAndUpdatePrice = async (product) => {
    const productRef = doc(db, 'Productos', product.id);
    const productDoc = await getDoc(productRef);

    if (productDoc.exists()) {
      const productData = productDoc.data();
      if (productData.stock <= 10) {
        return { ...product, precio: product.precio * 0.5, isDiscounted: true };
      }
    }
    return product;
  };

  const addToCart = async (product) => {
    const updatedProduct = await checkStockAndUpdatePrice(product);
    const productIndex = cart.findIndex(item => item.id === updatedProduct.id && item.selectedSize === updatedProduct.selectedSize);
    let updatedCart;
    if (productIndex >= 0) {
      updatedCart = cart.map((item, index) => 
        index === productIndex ? { ...item, quantity: item.quantity + updatedProduct.quantity } : item
      );
    } else {
      updatedCart = [...cart, updatedProduct];
    }
    setCart(updatedCart);
    await saveCartToFirestore(updatedCart);
  };

  const removeFromCart = async (productId, selectedSize) => {
    const updatedCart = cart.filter((product) => !(product.id === productId && product.selectedSize === selectedSize));
    setCart(updatedCart);
    await saveCartToFirestore(updatedCart);
  };

  const clearCart = async () => {
    setCart([]);
    if (user) {
      const cartRef = doc(db, 'carts', user.uid);
      await updateDoc(cartRef, { items: [] });
    }
  };

  const addToOrderHistory = async (cart, sessionId) => {
    if (user) {
      const q = query(collection(db, 'orders'), where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const existingOrders = querySnapshot.docs.map(doc => doc.data());

      const newOrderTime = new Date();
      const newOrderTimeString = `${newOrderTime.getFullYear()}-${newOrderTime.getMonth()}-${newOrderTime.getDate()}-${newOrderTime.getHours()}-${newOrderTime.getMinutes()}`;

      const duplicateOrder = existingOrders.find(order => 
        order.cart.length === cart.length &&
        order.cart.every((item, index) => item.id === cart[index].id) &&
        `${order.createdAt.toDate().getFullYear()}-${order.createdAt.toDate().getMonth()}-${order.createdAt.toDate().getDate()}-${order.createdAt.toDate().getHours()}-${order.createdAt.toDate().getMinutes()}` === newOrderTimeString
      );

      if (!duplicateOrder) {
        const newOrder = {
          userId: user.uid,
          cart: cart,
          sessionId: sessionId,
          createdAt: newOrderTime
        };

        await addDoc(collection(db, 'orders'), newOrder);
      } else {
        console.log("Duplicate order detected, not adding to order history.");
      }
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, addToOrderHistory }}>
      {children}
    </CartContext.Provider>
  );
};
