import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  Home,
  Auth,
  PetTypePage,
  PetRegistration,
  Success,
  Dashboard,
  Profile,
} from "./pages";
import "./App.css";
import CalendarPage from "./pages/Calendar/CalendarPage";
import LayoutWithNavigation from "./components/LayoutWithNavigation/LayoutWithNavigation";

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          {/* Rutas SIN navegación */}
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/pet-type" element={<PetTypePage />} />
          <Route path="/pet-registration" element={<PetRegistration />} />
          <Route path="/success" element={<Success />} />
          
          {/* Rutas CON navegación - todo después de /success */}
          <Route path="/dashboard" element={
            <LayoutWithNavigation>
              <Dashboard />
            </LayoutWithNavigation>
          } />
          <Route path="/profile" element={
            <LayoutWithNavigation>
              <Profile />
            </LayoutWithNavigation>
          } />
          <Route path="/calendar" element={
            <LayoutWithNavigation>
              <CalendarPage />
            </LayoutWithNavigation>
          } />
          
          {/* Si tienes la ruta /pets que aparece en tu navigation */}
          <Route path="/pets" element={
            <LayoutWithNavigation>
              {/* Aquí deberías tener un componente PetsPage */}
              <div>Pets Page - Crea este componente</div>
            </LayoutWithNavigation>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;