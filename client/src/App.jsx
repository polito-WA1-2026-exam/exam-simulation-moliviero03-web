import 'bootstrap/dist/css/bootstrap.min.css';

import { useContext, useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { Navigate, Outlet, Route, Routes, useNavigate } from 'react-router';
;
import { LoginForm, Logout } from './components/LoginForm.jsx';

import UserContext from './contexts/UserContext.js';

function App() {
  return (
    <UserContext.Provider value={user}>
      <Container>
        <Routes>
          
        </Routes>
      </Container>
    </UserContext.Provider>
  )
}

export default App
