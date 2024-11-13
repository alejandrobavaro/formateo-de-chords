import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

//------------ESTILOS--------------
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./assets/scss/_01-General/_BodyIndexApp.scss";

//------------HEADER--------------
import Header from "./componentes/Header";
import { TareasNotificacionesProvider } from "./componentes/TareasNotificacionesContext";
import { HeaderSearchProvider } from "./componentes/HeaderSearchContextBuscadorModular";
import HeaderSearchBar from "./componentes/HeaderSearchBar";

//-----------HOME - MAIN-----------------
import MainContent from "./componentes/MainContent";
import MainWhatsappIcon from "./componentes/MainWhatsappIcon";
import MainPublicidadSlider from "./componentes/MainPublicidadSlider";

//---------------TAREAS---------------
import TareasToDo from "./componentes/TareasToDo";
import TareasNotas from "./componentes/TareasNotas";
import TareasTemporizador from "./componentes/TareasTemporizador";

//--------------FOOTER----------------
import Footer from "./componentes/Footer";

//-----------CONTACTO-----------------
import ContactoLogoRedes from "./componentes/ContactoLogoRedes";
import ContactoFormularioSlider from "./componentes/ContactoFormularioSlider";

//-----------CHORDS--------------
import ChordsCovers from "./componentes/ChordsCovers";
import ChordsAlmango from "./componentes/ChordsAlmango";

//---------FORMATEO COMPONENTES--------------
import FormateoChords from "./componentes/FormateoChords";
import FormateoGacetilla from "./componentes/FormateoGacetilla";
import FormateoListas from "./componentes/FormateoListas";
import FormateoRiderAudio from "./componentes/FormateoRiderAudio";
import FormateoRiderVideo from "./componentes/FormateoRiderVideo";
import FormateoPedidosFecha from "./componentes/FormateoPedidosFecha";

//-----------LOGIN-LOGOUT-REGISTRO-----------------
import { AuthProvider, useAuth } from "./componentes/SesionAuthContext";
import SesionRegister from "./componentes/SesionRegistrate";
import SesionLogout from "./componentes/SesionLogout";
import SesionLogin from "./componentes/SesionLogin";

//-----------OTROS--------------
import ConsultasAyuda from "./componentes/ConsultasAyuda";

// Componente de Rutas Protegidas
const ProtectedRoute = ({ children }) => {
  const { state } = useAuth();
  return state.isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <TareasNotificacionesProvider>
        <Router>
          <Header />
          <hr className="border border-0 opacity-20" />
          <div className="main-content">
            <HeaderSearchProvider>
              <HeaderSearchBar />
            </HeaderSearchProvider>
            <div className="content">
              <Routes>
                <Route
                  path="*"
                  element={
                    <ProtectedRoute>
                      <MainContent />
                    </ProtectedRoute>
                  }
                />
                <Route path="/login" element={<SesionLogin />} />
                <Route path="/register" element={<SesionRegister />} />
                <Route path="/logout" element={<SesionLogout />} />

                {/* Rutas protegidas */}
                <Route
                  path="/contacto"
                  element={
                    <ProtectedRoute>
                      <ContactoLogoRedes />
                      <ContactoFormularioSlider />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/formateo-chords"
                  element={
                    <ProtectedRoute>
                      <FormateoChords />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/formateo-gacetilla"
                  element={
                    <ProtectedRoute>
                      <FormateoGacetilla />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/formateo-listas"
                  element={
                    <ProtectedRoute>
                      <FormateoListas />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/formateo-rider-audio"
                  element={
                    <ProtectedRoute>
                      <FormateoRiderAudio />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/formateo-rider-video"
                  element={
                    <ProtectedRoute>
                      <FormateoRiderVideo />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/pedidos-fecha"
                  element={
                    <ProtectedRoute>
                      <FormateoPedidosFecha />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/chordsalmango"
                  element={
                    <ProtectedRoute>
                      <ChordsAlmango />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/ayuda"
                  element={
                    <ProtectedRoute>
                      <ConsultasAyuda />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/chordscovers"
                  element={
                    <ProtectedRoute>
                      <ChordsCovers />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/to-do"
                  element={
                    <ProtectedRoute>
                      <TareasToDo />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/main-notas"
                  element={
                    <ProtectedRoute>
                      <TareasNotas />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/HeaderSearchBar"
                  element={
                    <ProtectedRoute>
                      <HeaderSearchBar />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/MainTemporizadorTareas"
                  element={
                    <ProtectedRoute>
                      <TareasTemporizador />
                    </ProtectedRoute>
                  }
                />

                {/* Ruta para manejar cualquier otra ruta no encontrada */}
                <Route path="*" element={<MainContent />} />
              </Routes>
            </div>
          </div>
          <hr className="border border-0 opacity-20" />
          <MainPublicidadSlider />
          <Footer />
          <MainWhatsappIcon />
        </Router>
      </TareasNotificacionesProvider>
    </AuthProvider>
  );
}

export default App;
