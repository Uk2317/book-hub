import { useEffect } from "react";
import { Link } from "react-router-dom";
import { notFoundUri } from "./Illustrations";

const NotFound = () => {
  useEffect(() => {
    document.title = "Book Hub — Page Not Found";
  }, []);

  return (
    <div className="notfound animate-fade-in">
      <img src={notFoundUri} alt="not found" className="notfound-img" />
      <h1 className="notfound-title">Page Not Found</h1>
      <p className="notfound-desc">
        we are sorry, the page you requested could not be found.
      </p>
      <Link to="/" className="notfound-btn">
        Go Back to Home
      </Link>
    </div>
  );
};

export default NotFound;
