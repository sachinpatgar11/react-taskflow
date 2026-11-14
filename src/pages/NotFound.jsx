import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="not-found">
      <h1>404</h1>
      <p>The page you're looking for doesn't exist.</p>
      <Link to="/dashboard">Return to dashboard</Link>
    </div>
  );
}

export default NotFound;
