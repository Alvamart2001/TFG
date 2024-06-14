import React from 'react';
import './AddressFaq.css';

const AddressFaq = () => (
  <div className="faq-container">
    <h2>Gestión de direcciones y entregas</h2>
    <div className="faq-section">
      <h3>¿Puedo cambiar mi dirección de envío después de hacer el pedido?</h3>
      <p>Sí, puede cambiar su dirección de envío siempre y cuando el pedido no haya sido procesado para el envío. Para cambiar la dirección, inicie sesión en su cuenta, vaya a la sección de pedidos y seleccione el pedido que desea modificar. Si encuentra dificultades, póngase en contacto con nuestro servicio de atención al cliente.</p>
    </div>
    <div className="faq-section">
      <h3>¿Puedo desviar mi paquete a otra dirección si no estoy disponible para recibirlo?</h3>
      <p>Dependiendo del servicio de mensajería utilizado para su envío, puede que tenga la opción de redirigir su paquete a otra dirección. Visite el sitio web del servicio de mensajería e ingrese su número de seguimiento para ver si esta opción está disponible.</p>
    </div>
    <div className="faq-section">
      <h3>¿Qué ocurre si pierdo el intento de entrega?</h3>
      <p>Si pierde un intento de entrega, el servicio de mensajería generalmente dejará una notificación con instrucciones sobre cómo reprogramar la entrega o recoger su paquete en una ubicación cercana. Siga las instrucciones proporcionadas para asegurarse de recibir su paquete.</p>
    </div>
    <div className="faq-section">
      <h3>¿Puedo combinar varios pedidos para ahorrar en gastos de envío?</h3>
      <p>En este momento, no ofrecemos la opción de combinar varios pedidos en un solo envío. Cada pedido se procesa y envía por separado para asegurar una rápida entrega.</p>
    </div>
    <div className="faq-section">
      <h3>¿Puedo cambiar la dirección de entrega después de haber realizado el pedido?</h3>
      <p>Si tu pedido aún no ha sido procesado para el envío, es posible que puedas cambiar la dirección de entrega. Por favor, contacta con nuestro servicio de atención al cliente lo antes posible para solicitar el cambio.</p>
    </div>
  </div>
);

export default AddressFaq;
