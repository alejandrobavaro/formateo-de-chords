import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../assets/scss/_03-Componentes/_Sidebar.scss";
import {
  FiArrowLeftCircle,
  FiCreditCard,
  FiBriefcase,
  FiHelpCircle,
} from "react-icons/fi";
import { BsClock } from "react-icons/bs"; // Asegúrate de importar BsClock
import HeaderNotificaciones from "./HeaderNotificaciones"; // Importa el componente de notificaciones
import { useHeaderNotifications } from "./HeaderNotificacionesContext"; // Importa el contexto para las notificaciones

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { notifications } = useHeaderNotifications(); // Obtén las notificaciones desde el contexto

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };

    handleResize(); // Ejecuta la función en la carga inicial
    window.addEventListener("resize", handleResize); // Añade el event listener para cambios de tamaño de pantalla

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <button
        className="sidebar-toggle"
        onClick={toggleSidebar}
        aria-label="Toggle Sidebar"
      >
        <FiArrowLeftCircle />
      </button>
      <div className="sidebar-content">
        {/* <h2>
          <FiCreditCard size={20} color="gray" /> Chords
        </h2>
        <ul>
          <li>
            <Link to="/chordsalmango">Chords Almango</Link>
          </li>
          <li>
            <Link to="/chordscovers">Chords Covers</Link>
          </li>
          <hr />
        </ul>

        <h2>
          <FiBriefcase size={20} color="gray" /> Formateo
        </h2>

        <ul>
          <li><Link to="/formateo-chords">Formateo Chords</Link></li>
        </ul>

        <h2>
          <BsClock size={20} color="gray" /> Tareas
        </h2>
        <ul>
          <li>
            <Link to="/calendario-pagos">
              Notificaciones{" "}
              <HeaderNotificaciones reminderCount={notifications.today} />
            </Link>
          </li>
          <li>
            <Link to="/MainTemporizadorTareas">Temporizador</Link>
          </li>
          <li>
            <Link to="/to-do">To-Do</Link>
          </li>
        </ul>

        <h2>
          <FiHelpCircle size={20} color="gray" /> Otros
        </h2>
        <ul>
          <li>
            <Link to="/ayuda">Ayuda</Link>
          </li>
        </ul> */}
      </div>
    </div>
  );
};

export default Sidebar;
