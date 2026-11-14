import { Bell, Search, Plus } from "lucide-react";
import { useLocation } from "react-router-dom";

const pageTitles = {
  "/dashboard": "Dashboard",
  "/projects": "Projects",
  "/issues": "Issues",
  "/settings": "Settings",
};

function Header() {
  const location = useLocation();
  const title = pageTitles[location.pathname] || "TaskFlow";

  return (
    <header className="topbar">
      <div>
        <span className="breadcrumb">Workspace / </span>
        <strong>{title}</strong>
      </div>

      <div className="topbar-actions">
        <label className="header-search">
          <Search size={17} aria-hidden="true" />
          <input type="search" placeholder="Search anything..." />
          <kbd>⌘ K</kbd>
        </label>

        <button
          className="icon-button"
          type="button"
          aria-label="Notifications"
        >
          <Bell size={19} />
        </button>

        <button className="create-button" type="button" disabled>
          <Plus size={18} />
          <span>Create new</span>
        </button>
      </div>
    </header>
  );
}

export default Header;
