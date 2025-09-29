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
import PetSelection from "./pages/PetSelection/PetSelection";
import EventType from "./pages/EventType/EventType";
import MedicineEvent from "./pages/MedicineEvent/MedicineEvent";
import GenericEvent from "./pages/GenericEvent/GenericEvent";
import SuccessEvent from "./pages/SuccessEvent/SuccessEvent";
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
          
          {/* Event creation flow routes */}
          <Route path="/pet-selection" element={<PetSelection />} />
          <Route path="/event-type" element={<EventType />} />
          <Route path="/medicine-event" element={<MedicineEvent />} />
          <Route path="/generic-event" element={<GenericEvent />} />
          <Route path="/success-event" element={<SuccessEvent />} />
          
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
          
          <Route path="/pets" element={
            <LayoutWithNavigation>
              <div>Pets Page</div>
            </LayoutWithNavigation>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;