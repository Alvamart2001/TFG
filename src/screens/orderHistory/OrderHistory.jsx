import React, { useState, useEffect, useContext } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../mainPage/firebaseConfig';
import { AuthContext } from '../../context/AuthContext';
import './OrderHistory.css';
import OrderItem from './OrderItem';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const loadOrders = async () => {
      if (user) {
        const q = query(collection(db, 'orders'), where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const ordersList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Filtrar pedidos vacíos
        const filteredOrders = ordersList.filter(order => order.cart && order.cart.length > 0 && order.cart.some(item => item.img));

        // Filtrar pedidos duplicados
        const uniqueOrders = filterUniqueOrders(filteredOrders);
        setOrders(uniqueOrders);
      }
    };

    const filterUniqueOrders = (orders) => {
      const uniqueOrdersMap = new Map();

      orders.forEach(order => {
        const date = order.createdAt ? order.createdAt.toDate().toLocaleString() : 'Fecha no disponible';
        if (!uniqueOrdersMap.has(date)) {
          uniqueOrdersMap.set(date, order);
        }
      });

      return Array.from(uniqueOrdersMap.values());
    };

    loadOrders();
  }, [user]);

  return (
    <div className="order-history-container">
      <h2>Historial de Pedidos</h2>
      {orders.length === 0 ? (
        <p>No hay pedidos para mostrar</p>
      ) : (
        orders.map(order => (
          <>
            <OrderItem order={order} />
          </>
        ))
      )}
    </div>
  );
};

export default OrderHistory;
