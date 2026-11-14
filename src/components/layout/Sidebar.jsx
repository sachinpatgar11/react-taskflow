import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  ListTodo,
  Settings,
  CircleHelp,
  Layers,
} from "lucide-react";

const navigation = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Projects", path: "/projects", icon: FolderKanban },
  { label: "Issues", path: "/issues", icon: ListTodo },
];

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-icon">
          <Layers size={22} />
        </div>
        <span>TaskFlow</span>
      </div>

      <div className="workspace-label">WORKSPACE</div>

      <nav className="sidebar-nav" aria-label="Main navigation">
        {navigation.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            <Icon size={19} aria-hidden="true" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <NavLink to="/settings" className="nav-link">
          <Settings size={19} aria-hidden="true" />
          <span>Settings</span>
        </NavLink>

        <a className="nav-link" href="mailto:support@example.com">
          <CircleHelp size={19} aria-hidden="true" />
          <span>Help & Support</span>
        </a>

        <div className="user-profile">
          <div className="avatar">AM</div>
          <div>
            <strong>Alex Morgan</strong>
            <span>Workspace Admin</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
