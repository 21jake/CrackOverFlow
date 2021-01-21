import NavBar from './main/component/entities/shared/NavBar'
import User from './main/component/entities/user/User';
import Home from './main/component/Home';
import { BrowserRouter, Route } from 'react-router-dom';
import SignUp from './main/component/auth/SignUp';
import SignInSide from './main/component/auth/SignIn';
import PostCreate from './main/component/entities/post/PostCreate'
import { ToastContainer } from 'react-toastify';
import { useState, useEffect, createContext, useContext, useRef } from 'react';
import Axios from "./main/api/Axios";


export const AuthContext = createContext();


function App() {

  const [user, setUser] = useState(null);
  const [verifying, setVerifying] = useState(true);
  // const history = useHistory();

  // console.log(user, 'user');


  const fetchUserInfo = async () => {
    const accessToken = localStorage.getItem('crackToken');
    if (!accessToken) {
      return setVerifying(false);
    }
    try {
      const res = await Axios.get('/auth/verify');
      if (res.data.status) {
        setUser(res.data.data);
        setVerifying(false);
      } else {
        setVerifying(false);
      }
    } catch (err) {
      setVerifying(false);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const login = (user, token) => {
    localStorage.setItem('crackToken', token);
    setUser(user);
  }

  const logout = () => {
    Axios.get('/auth/logout');
    localStorage.removeItem('crackToken');
    setUser(null);
  }

  // console.log(user);

  return (

    <AuthContext.Provider value={{ user, login, logout }}>
      <div className="App">
        <ToastContainer />
        <BrowserRouter>
          <NavBar />
          <Route path="/" exact component={Home} />
          <Route path="/current" exact component={User} />
          <Route path="/register" exact component={SignUp} />
          <Route path="/login" exact component={SignInSide} />
          <Route path="/posts/create" exact component={PostCreate} />
        </BrowserRouter>
      </div>
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export default App;
