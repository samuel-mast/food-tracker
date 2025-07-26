import NavBar from './NavBar';
import { Outlet } from 'react-router-dom';

function App() {
  return (
    <div>
      <header>
        <NavBar />
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default App;
