import React from 'react';
import "../assets/scss/_03-Componentes/_FormateoPedidosFecha.scss";
import Sidebar from './Sidebar';

const FormateoPedidosFecha = () => {
  return (
    <div className="formateo-pedidos-fecha">
      <div className="sidebar-container">
        <Sidebar />
      </div>
      <div className="contenido">
        <h1>Pedidos de Fecha</h1>
        <p>Este es el contenido para pedidos de fecha...</p>
      </div>
    </div>
  );
};

export default FormateoPedidosFecha;
