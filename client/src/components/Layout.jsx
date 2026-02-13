import { NavLink, Outlet } from 'react-router-dom';

export default function Layout() {
    return (
        <div className="layout">
            <header className="layout-header">
                <h1>Action Tracker</h1>
                <nav>
                    <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''} end>
                        Home
                    </NavLink>
                    <NavLink to="/status" className={({ isActive }) => isActive ? 'active' : ''}>
                        Status
                    </NavLink>
                </nav>
            </header>
            <main className="layout-main">
                <Outlet />
            </main>
        </div>
    );
}
