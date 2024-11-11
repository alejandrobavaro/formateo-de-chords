import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

//------------ESTILOS--------------//
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./assets/scss/_01-General/_BodyIndexApp.scss";
//------------HEADER--------------//
import Header from "./componentes/Header";
import { HeaderNotificationsProvider } from "./componentes/HeaderNotificacionesContext";
import HeaderSearchBar from "./componentes/HeaderSearchBar";
//------------SIDEBAR--------------//
import Sidebar from "./componentes/Sidebar";
//-----------HOME - MAIN-----------------//
import MainContent from "./componentes/MainContent";
import MainWhatsappIcon from "./componentes/MainWhatsappIcon";

import MainPublicidadSlider from "./componentes/MainPublicidadSlider";
import ToDo from "./componentes/ToDo";
import MainNotas from "./componentes/MainNotas";

import MainTemporizador from "./componentes/MainTemporizador";
//--------------FOOTER----------------//
import Footer from "./componentes/Footer";
//-----------CONTACTO-----------------//
import ContactoLogoRedes from "./componentes/ContactoLogoRedes";
import ContactoFormularioSlider from "./componentes/ContactoFormularioSlider";

//-----------RENTAS--------------//

import ChordsCovers from "./componentes/ChordsCovers";

//-----------DATA------------//
import ChordsAlmango from "./componentes/ChordsAlmango";
//-----------LOGIN-LOGOUT-REGISTRO-----------------//
import { AuthProvider, useAuth } from "./componentes/SesionAuthContext";
import SesionRegister from "./componentes/SesionRegistrate";
import SesionLogout from "./componentes/SesionLogout";
import SesionLogin from "./componentes/SesionLogin";
//-----------OTROS--------------//
import ConsultasAyuda from "./componentes/ConsultasAyuda";

const ProtectedRoute = ({ element, ...rest }) => {
  const { state } = useAuth();
  return state.isAuthenticated ? element : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <HeaderNotificationsProvider>
        <Router>
          <Header />
          <hr className="border border-0 opacity-20" />
          <div className="main-content">
            <Sidebar />
            <div className="content">
              <Routes>
                <Route path="/login" element={<SesionLogin />} />
                <Route path="/register" element={<SesionRegister />} />
                <Route path="/logout" element={<SesionLogout />} />
                <Route
                  path="/"
                  element={<ProtectedRoute element={<MainContent />} />}
                />

                <Route
                  path="/contacto"
                  element={
                    <ProtectedRoute
                      element={
                        <>
                          <ContactoLogoRedes />
                          <ContactoFormularioSlider />
                        </>
                      }
                    />
                  }
                />

                <Route
                  path="/chordsalmango"
                  element={<ProtectedRoute element={<ChordsAlmango />} />}
                />

                <Route
                  path="/ayuda"
                  element={<ProtectedRoute element={<ConsultasAyuda />} />}
                />

                <Route
                  path="/chordscovers"
                  element={<ProtectedRoute element={<ChordsCovers />} />}
                />
                <Route
                  path="/to-do"
                  element={<ProtectedRoute element={<ToDo />} />}
                />
                <Route
                  path="/main-notas"
                  element={<ProtectedRoute element={<MainNotas />} />}
                />
                <Route
                  path="/HeaderSearchBar"
                  element={<ProtectedRoute element={<HeaderSearchBar />} />}
                />

                <Route
                  path="/MainTemporizadorTareas"
                  element={
                    <ProtectedRoute element={<MainTemporizador />} />
                  }
                />
              </Routes>
            </div>
          </div>
          <hr className="border border-0 opacity-20" />
          <MainPublicidadSlider />
          <Footer />
          <MainWhatsappIcon />
        </Router>
      </HeaderNotificationsProvider>
    </AuthProvider>
  );
}

export default App;
