import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { BrowserRouter, Navigate, NavLink, Outlet, Route, Routes, useLocation } from "react-router-dom";
import API from "./api/api";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CreateIssue from "./pages/CreateIssue";
import Chatbot from "./pages/Chatbot";
import StudyPlanner from "./pages/StudyPlanner";
import Admin from "./pages/Admin";
import "./App.css";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

function Icon({ name, size = 19 }) {
  const paths = { grid: <><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></>, plus: <><path d="M12 5v14M5 12h14"/></>, chat: <><path d="M20 11.5a7.5 7.5 0 0 1-8 7.5 8.8 8.8 0 0 1-3.5-.7L4 20l1.2-3.5A7.1 7.1 0 0 1 4 12c0-4.2 3.6-7.5 8-7.5s8 2.8 8 7Z"/></>, book: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21z"/><path d="M4 5.5v13A2.5 2.5 0 0 1 6.5 16H20M8 7h8"/></>, sliders: <><path d="M4 7h9m4 0h3M4 17h3m4 0h9"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="17" r="2"/></>, logout: <><path d="M10 17l5-5-5-5M15 12H3"/><path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6"/></>, sun: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></>, moon: <path d="M20.5 14A8.5 8.5 0 0 1 10 3.5 8.5 8.5 0 1 0 20.5 14Z"/>, arrow: <><path d="M5 12h14M13 6l6 6-6 6"/></>, close: <><path d="m18 6-12 12M6 6l12 12"/></>, search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>, spark: <><path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 16l1 2.5 2.5 1-2.5 1L19 23l-1-2.5-2.5-1 2.5-1z"/></>, check: <path d="m5 12 4 4L19 6"/>, alert: <><path d="M12 3 2.5 20h19z"/><path d="M12 9v4m0 3h.01"/></> };
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{paths[name] || paths.grid}</svg>;
}

function Layout() {
  const { user, logout, theme, toggleTheme } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  useEffect(() => setMobileOpen(false), [location.pathname]);
  const admin = ["college_admin", "super_admin"].includes(user?.role);
  const links = [
    { to: "/dashboard", label: "Overview", icon: "grid" },
    { to: "/report", label: "Report an issue", icon: "plus" },
    { to: "/assistant", label: "Campus assistant", icon: "chat" },
    { to: "/planner", label: "Study planner", icon: "book" },
    ...(admin ? [{ to: "/manage", label: "Management", icon: "sliders" }] : []),
  ];
  return <div className={`app-shell ${mobileOpen ? "sidebar-open" : ""}`}>
    <aside className="sidebar">
      <div className="brand"><span className="brand-mark"><Icon name="spark" size={21}/></span><span>campus<span className="brand-light">mind</span><small>STUDENT SUPPORT, SIMPLIFIED</small></span></div>
      <div className="workspace-label">WORKSPACE</div>
      <nav className="side-nav" aria-label="Main navigation">{links.map(link => <NavLink key={link.to} to={link.to} className={({isActive}) => `nav-link ${isActive ? "active" : ""}`}><Icon name={link.icon}/><span>{link.label}</span>{link.to === "/report" && <span className="nav-plus">+</span>}</NavLink>)}</nav>
      <div className="sidebar-bottom"><div className="help-card"><div className="help-icon"><Icon name="chat" size={18}/></div><strong>Need a hand?</strong><p>Your campus assistant is here whenever you need it.</p><NavLink to="/assistant">Ask a question <Icon name="arrow" size={14}/></NavLink></div><button className="theme-toggle" onClick={toggleTheme} aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}><Icon name={theme === "light" ? "moon" : "sun"}/><span>{theme === "light" ? "Dark appearance" : "Light appearance"}</span><span className={`switch ${theme === "dark" ? "on" : ""}`} /></button><div className="profile-row"><div className="avatar">{(user?.name || "U").slice(0,1).toUpperCase()}</div><div className="profile-copy"><strong>{user?.name || user?.email || "Campus user"}</strong><span>{(user?.role || "student").replaceAll("_", " ")}</span></div><button className="icon-button logout-button" onClick={logout} aria-label="Sign out" title="Sign out"><Icon name="logout" size={17}/></button></div></div>
    </aside>
    {mobileOpen && <button className="sidebar-scrim" onClick={() => setMobileOpen(false)} aria-label="Close navigation"/>}
    <main className="main-area"><header className="topbar"><button className="menu-button" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle navigation">☰</button><div className="breadcrumb">Campus workspace <span>/</span> <strong>{links.find(link => link.to === location.pathname)?.label || "Overview"}</strong></div><div className="topbar-actions"><span className="status-dot"/> Campus services online <div className="top-avatar">{(user?.name || "U").slice(0,1).toUpperCase()}</div></div></header><div className="page-content"><Outlet/></div><footer className="app-footer">Made for a better campus day <span>·</span> CampusMind AI</footer></main>
  </div>;
}

function RequireAuth() { const { user, loading } = useAuth(); const location = useLocation(); if (loading) return <div className="center-loading"><span className="spinner"/> Restoring your session…</div>; return user ? <Layout/> : <Navigate to="/login" replace state={{from: location.pathname}}/>; }

function Root() {
  const [user, setUser] = useState(null); const [loading, setLoading] = useState(Boolean(localStorage.getItem("token"))); const [theme, setTheme] = useState(localStorage.getItem("campusmind-theme") || "light");
  useEffect(() => { document.documentElement.dataset.theme = theme; localStorage.setItem("campusmind-theme", theme); }, [theme]);
  useEffect(() => { if (!localStorage.getItem("token")) return; API.get("/protected/me").then(({data}) => setUser(data)).catch(() => { localStorage.removeItem("token"); localStorage.removeItem("campusmind-user"); }).finally(() => setLoading(false)); }, []);
  const value = useMemo(() => ({ user, setUser, loading, logout: () => { localStorage.removeItem("token"); localStorage.removeItem("campusmind-user"); setUser(null); }, theme, toggleTheme: () => setTheme(theme === "light" ? "dark" : "light") }), [user, loading, theme]);
  return <AuthContext.Provider value={value}><Routes><Route path="/login" element={user ? <Navigate to="/dashboard" replace/> : <Login/>}/><Route element={<RequireAuth/>}><Route path="/dashboard" element={<Dashboard/>}/><Route path="/report" element={<CreateIssue/>}/><Route path="/assistant" element={<Chatbot/>}/><Route path="/planner" element={<StudyPlanner/>}/><Route path="/manage" element={<Admin/>}/></Route><Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} replace/>}/></Routes></AuthContext.Provider>;
}

export default function App() { return <BrowserRouter><Root/></BrowserRouter>; }
export { Icon };
