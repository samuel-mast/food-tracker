import { NavLink } from "react-router-dom";

function NavBar({ setToken }) {
  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between">
      <ul className="flex space-x-12">
        <li><NavLink to="/" className={({ isActive }) => (isActive ? "font-bold" : "hover:text-gray-300") }>Home</NavLink></li>
        <li><NavLink to="/tracker" className={({ isActive }) => (isActive ? "font-bold" : "hover:text-gray-300")}>Tracker</NavLink></li>
        <li><NavLink to="/recipes" className={({ isActive }) => (isActive ? "font-bold" : "hover:text-gray-300")}>Recipes</NavLink></li>
      </ul>
      <form onSubmit= {(e) => { e.preventDefault(); setToken(null); localStorage.removeItem('token'); }}>
        <button type="submit" className="text-white hover:text-gray-300">Logout</button>
      </form>
    </nav>
  );
}

export default NavBar;