import { NavLink } from "react-router-dom";

function NavBar() {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <ul className="flex space-x-12">
        <li><NavLink to="/" className={({ isActive }) => (isActive ? "font-bold" : "")}>Home</NavLink></li>
        <li><NavLink to="/tracker" className={({ isActive }) => (isActive ? "font-bold" : "")}>Tracker</NavLink></li>
        <li><NavLink to="/recipes" className={({ isActive }) => (isActive ? "font-bold" : "")}>Recipes</NavLink></li>
      </ul>
    </nav>
  );
}

export default NavBar;