import 'bootstrap/dist/css/bootstrap.min.css';

import { useContext, useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { Navigate, Outlet, Route, Routes, useNavigate } from 'react-router';

import { LoginForm, Logout } from './components/LoginForm.jsx';

import UserContext from './contexts/UserContext.js';
import { checkSession, doLogin } from './api/auth.js';
import { getCourses } from './api/api.js';

function App() {

  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);

  useEffect(() => {
    async function getCourseList() {
      try {
        const courses_list = await getCourses();
        setCourses(courses_list);
      }
      catch (err){
        navigate('*');
      }
    }
    getCourseList()
  }, [])

  const [user, setUser] = useState({ id: undefined, name: undefined, surname: undefined, email: undefined, planType: undefined});

  useEffect(() => {
    checkSession().then(result => {
      if (result) {
        setUser({id: result.userId, name: result.name, surname: result.surname, email: result.email, planType: result.planType});
      }
    })
  }, [])

  const login = (user) => {
    setUser({id: result.userId, name: result.name, surname: result.surname, email: result.email, planType: result.planType});
    navigate('/');
  }

  return (
    <UserContext.Provider value={user}>
      <Container>
        <Routes>
          <Route path='/' element={<MainLayout doLogin={login}/>}>
            <Route path='login' element={<LoginForm login={login}/>}/>
            <Route path='studyplan'>
              <Route path='new' />
              <Route path='edit' />
            </Route>
            <Route path='*' element={<h1>Something went wrong</h1>}/>
          </Route>
        </Routes>
      </Container>
    </UserContext.Provider>
  )
}

function MainLayout(props){
  return (
    <Container>
      <Header login={props.login}></Header>
      <Outlet />
    </Container>
  )
}

export default App