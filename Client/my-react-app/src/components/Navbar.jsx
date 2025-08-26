import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <nav className="nav-container">
      <div className="nav-content">
        <Link to="/" className="nav-brand">
          My App
        </Link>
        <ul className="nav-links">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/notes">Notes</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/data">Data</Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
