import NavBar from './layouts/NavBar';
import LoginRegister from './pages/LoginRegister';
import { Outlet } from 'react-router-dom';
import { useState } from 'react';

function useToken() {
  const getToken = () => {
    const tokenString = localStorage.getItem('token');
    const userToken = JSON.parse(tokenString);
    return userToken || null;
  };

  const [token, setToken] = useState(getToken());

  const saveToken = userToken => {
    localStorage.setItem('token', JSON.stringify(userToken));
    setToken(userToken);
  };

  return {
    setToken: saveToken,
    token
  }
}

function App() {
  const { token, setToken } = useToken();
  
  if(!token) {
    return <LoginRegister setToken={setToken} />;
  }

  return (
    <div>
      <header>
        <NavBar setToken={setToken} />
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default App;
