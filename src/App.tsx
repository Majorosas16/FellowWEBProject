import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  Home,
  Auth,
  PetTypePage,
  PetRegistration,
  Success,
  Dashboard,
  Profile,
  CalendarPage,
  PetsPage,
  PetSelection,
  EventType,
  MedicineEvent,
  GenericEvent,
  SuccessEvent,
  LayoutWithNavigation,
} from "./pages";

import "./App.css";

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          {/* Routes without Bottom Navigation */}
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/pet-type" element={<PetTypePage />} />
          <Route path="/pet-registration" element={<PetRegistration />} />
          <Route path="/success" element={<Success />} />

          {/* Event creation */}
          <Route path="/pet-selection" element={<PetSelection />} />
          <Route path="/event-type" element={<EventType />} />
          <Route path="/medicine-event" element={<MedicineEvent />} />
          <Route path="/generic-event" element={<GenericEvent />} />
          <Route path="/success-event" element={<SuccessEvent />} />

          {/* Routes with Bottom Navigation */}
          <Route
            path="/dashboard"
            element={
              <LayoutWithNavigation>
                <Dashboard />
              </LayoutWithNavigation>
            }
          />
          <Route
            path="/profile"
            element={
              <LayoutWithNavigation>
                <Profile />
              </LayoutWithNavigation>
            }
          />
          <Route
            path="/calendar"
            element={
              <LayoutWithNavigation>
                <CalendarPage />
              </LayoutWithNavigation>
            }
          />

          <Route
            path="/pets"
            element={
              <LayoutWithNavigation>
                <PetsPage />
              </LayoutWithNavigation>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
