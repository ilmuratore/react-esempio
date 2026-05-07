import { Outlet, NavLink } from "react-router-dom";

function Layout() {
  return (
    <>
      <div className="layout">
        <header className="layout-header">
          <span className="logo">📝 TODO APP</span>
          <nav>
            <NavLink to="/" className={({isActive}) => isActive ? 'attivo' : ''}>Lista</NavLink>
            <NavLink to="/stats" className={({isActive}) => isActive ? 'attivo' : ''}>Statistiche</NavLink>
          </nav>
        </header>

        <main className="layout-main">
          <Outlet />
        </main>
      </div>
    </>
  );
}

export default Layout;
