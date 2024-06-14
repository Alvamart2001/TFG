import React, { useState } from 'react';
import './OrderItem.css';
import { db } from '../mainPage/firebaseConfig';
import { doc, deleteDoc, updateDoc, getDoc } from 'firebase/firestore';

const OrderItem = ({ order }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { cart, createdAt, id } = order;
  const date = createdAt ? createdAt.toDate().toLocaleString() : 'Fecha no disponible';

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleCancelOrder = async () => {
    try {
      // Actualizar el stock de todos los productos en el pedido
      for (const item of cart) {
        const productRef = doc(db, 'Productos', item.id);
        const productDoc = await getDoc(productRef);
        if (productDoc.exists()) {
          const newStock = productDoc.data().stock + item.quantity;
          await updateDoc(productRef, { stock: newStock });
        }
      }

      await deleteDoc(doc(db, 'orders', id));
      alert('Pedido cancelado correctamente.');
      window.location.reload(); // Recargar la página para actualizar la lista de pedidos
    } catch (error) {
      console.error("Error cancelling order: ", error);
      alert('Hubo un error al cancelar el pedido. Por favor, inténtelo de nuevo.');
    }
  };

  const handleCancelProduct = async (productId) => {
    try {
      const itemToCancel = cart.find(item => item.id === productId);
      const updatedCart = cart.filter(item => item.id !== productId);
      
      // Actualizar el stock del producto cancelado
      const productRef = doc(db, 'Productos', itemToCancel.id);
      const productDoc = await getDoc(productRef);
      if (productDoc.exists()) {
        const newStock = productDoc.data().stock + itemToCancel.quantity;
        await updateDoc(productRef, { stock: newStock });
      }
      
      await updateDoc(doc(db, 'orders', id), { cart: updatedCart });
      alert('Producto cancelado correctamente.');
      window.location.reload(); // Recargar la página para actualizar la lista de productos
    } catch (error) {
      console.error("Error cancelling product: ", error);
      alert('Hubo un error al cancelar el producto. Por favor, inténtelo de nuevo.');
    }
  };

  return (
    <div className="order-item" onClick={toggleExpand}>
      <div className="order-summary">
        <p><strong>Fecha del pedido:</strong> {date}</p>
        <p><strong>Total de productos:</strong> {cart.length}</p>
        <button className="btn" onClick={handleCancelOrder}>Cancelar Pedido</button>
      </div>
      {isExpanded && (
        <div className="order-details">
          {cart.map((item, index) => (
            <div key={index} className="order-product-box">
              <div className="order-product">
                <img src={item.img} alt={item.descripcion} className="order-product-image" />
                <div className="order-product-info">
                  <div className="order-product-details">
                    <p>{item.descripcion}</p>
                    {item.selectedSize && <p><strong>Talla:</strong> {item.selectedSize}</p>}
                    <p><strong>Precio:</strong> €{item.precio}</p>
                  </div>
                </div>
                <button className="btn" onClick={(e) => {
                  e.stopPropagation(); // Evitar que el click en el botón expanda el pedido
                  handleCancelProduct(item.id);
                }}>Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderItem;
