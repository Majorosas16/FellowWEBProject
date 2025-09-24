// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
// import {
//   Home,
//   Auth,
//   PetTypePage,
//   PetRegistration,
//   Success,
//   Dashboard,
// } from './pages'

import './App.css'
import Button from './components/Button/Button'

/**
 * Main App component with routing setup
 * Mobile-first responsive pet care application
 */

function App() {
    const handleClick = () => {
    alert('¡Botón primario clickeado!');
  };
  return (
    // <Router>
    //   <div className="app">
    //     <Routes>
    //       <Route path="/" element={<Home />} />
    //       <Route path="/auth" element={<Auth />} />
    //       <Route path="/pet-type" element={<PetTypePage />} />
    //       <Route path="/pet-registration" element={<PetRegistration />} />
    //       <Route path="/success" element={<Success />} />
    //       <Route path="/dashboard" element={<Dashboard />} />
    //     </Routes>
    //   </div>
    // </Router>
    <>
      <Button variant="primary" text="Aceptar" onClick={handleClick} />
    </>
  )
}

export default App
