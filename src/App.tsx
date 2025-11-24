import "./App.css";
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
  Notifications,
  Settings,
  PetProfile,
  // LeftNavigation,
} from "./pages";
import { ProtectedRoutes } from "./components/ProtectedRoutes";
import { auth } from "./services/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { useDispatch } from "react-redux";
import { clearUser, setUser } from "./redux/slices/authSlice";
import { useEffect } from "react";
import { useEventsListener } from "./hook/useEventsListener";
import { useEventNotifications } from "./hook/useEventNotifications";


function App() {
  const dispatch = useDispatch();
  useEventsListener();
  useEventNotifications();

  // Mantiene el usuario en el Redux y la base de datos cuando inicia/cierra sesión
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(setUser(user.uid));
      } else {
        dispatch(clearUser());
      }
    });
    return () => unsubscribe();
  }, [dispatch]);

  return (
    <Router>
      <div className="app">
        <Routes>
          {/* Rutas públicas: solo Home y Auth */}
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />

          {/* Todas las demás rutas protegidas */}
          <Route
            path="/pet-type"
            element={
              <ProtectedRoutes>
                <PetTypePage />
              </ProtectedRoutes>
            }
          />
          <Route
            path="/pet-registration"
            element={
              <ProtectedRoutes>
                <PetRegistration />
              </ProtectedRoutes>
            }
          />
          <Route
            path="/success"
            element={
              <ProtectedRoutes>
                <Success />
              </ProtectedRoutes>
            }
          />
          <Route
            path="/pet-selection"
            element={
              <ProtectedRoutes>
                <PetSelection />
              </ProtectedRoutes>
            }
          />
          <Route
            path="/event-type"
            element={
              <ProtectedRoutes>
                <EventType />
              </ProtectedRoutes>
            }
          />
          <Route
            path="/medicine-event"
            element={
              <ProtectedRoutes>
                <MedicineEvent />
              </ProtectedRoutes>
            }
          />
          <Route
            path="/generic-event"
            element={
              <ProtectedRoutes>
                <GenericEvent />
              </ProtectedRoutes>
            }
          />
          <Route
            path="/success-event"
            element={
              <ProtectedRoutes>
                <SuccessEvent />
              </ProtectedRoutes>
            }
          />

          {/* Rutas con navegación inferior protegidas */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoutes>
                <LayoutWithNavigation>
                  <Dashboard />
                </LayoutWithNavigation>
              </ProtectedRoutes>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoutes>
                <LayoutWithNavigation>
                  <Profile />
                </LayoutWithNavigation>
              </ProtectedRoutes>
            }
          />
          <Route
            path="/calendar"
            element={
              <ProtectedRoutes>
                <LayoutWithNavigation>
                  <CalendarPage />
                </LayoutWithNavigation>
              </ProtectedRoutes>
            }
          />
          <Route
            path="/pets"
            element={
              <ProtectedRoutes>
                <LayoutWithNavigation>
                  <PetsPage />
                </LayoutWithNavigation>
              </ProtectedRoutes>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoutes>
                <LayoutWithNavigation>
                  <Notifications />
                </LayoutWithNavigation>
              </ProtectedRoutes>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoutes>
                <LayoutWithNavigation>
                  <Settings />
                </LayoutWithNavigation>
              </ProtectedRoutes>
            }
          />

          <Route
            path="/edit-pet/:petId"
            element={
              <ProtectedRoutes>
                <LayoutWithNavigation>
                  <PetProfile />
                </LayoutWithNavigation>
              </ProtectedRoutes>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
