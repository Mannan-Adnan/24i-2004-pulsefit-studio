import { Link, NavLink } from 'react-router-dom';
import { usePlan } from '../context/PlanContext.jsx';

export default function Header() {
  const { totalSpots } = usePlan();

  return (
    <header className="header">
      <div className="container header-inner">
        <Link to="/" className="logo">
          Pulse<span>Fit</span>
        </Link>
        <nav aria-label="Main">
          <ul className="nav-list">
            <li>
              <NavLink to="/" end>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/classes">Classes</NavLink>
            </li>
            <li>
              <NavLink to="/plan">
                My plan <span className="count">{totalSpots}</span>
                <span className="visually-hidden"> spots</span>
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
