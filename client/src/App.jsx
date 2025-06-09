import { Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Landing from './pages/Landing.jsx';
import LoginRegisterLayout from './layouts/loginRegisterLayout.jsx';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />

        <Route element={<LoginRegisterLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
        
      </Routes>
    </>
  );
}

export default App
