import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Trang chủ", end: true },
  { to: "/gioi-thieu", label: "Giới thiệu" },
  { to: "/tin-tuc", label: "Tin tức" },
  { to: "/admin", label: "Quản trị" },
];

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar__brand">
        <span className="navbar__logo">⚓</span>
        <div>
          <div className="navbar__title">VIMARU</div>
          <div className="navbar__subtitle">Trường Đại học Hàng hải Việt Nam</div>
        </div>
      </div>
      <nav className="navbar__links">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) => (isActive ? "navbar__link navbar__link--active" : "navbar__link")}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
