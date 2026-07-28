import { Component } from "react";
import { Link, NavLink, withRouter } from "../utils/router";
import Cookies from "js-cookie";
import { HiOutlineMenu } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import { FiLogOut } from "react-icons/fi";
import Logo from "./Logo";

interface Props {
  navigate: (path: string) => void;
}

interface State {
  menuOpen: boolean;
}

class Header extends Component<Props, State> {
  state: State = { menuOpen: false };

  onLogout = () => {
    Cookies.remove("jwt_token");
    this.props.navigate("/login");
  };

  toggleMenu = () => this.setState((p) => ({ menuOpen: !p.menuOpen }));

  render() {
    const { menuOpen } = this.state;
    return (
      <header className="header">
        <div className="header-inner">
          <Link to="/" className="header-logo-link">
            <Logo alt="website logo" className="header-logo" />
          </Link>

          <nav className="header-nav">
            <NavLink
              to="/"
              end
              className={({ isActive }: { isActive: boolean }) =>
                isActive ? "header-link active" : "header-link"
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/shelf"
              className={({ isActive }: { isActive: boolean }) =>
                isActive ? "header-link active" : "header-link"
              }
            >
              Bookshelves
            </NavLink>
            <button
              type="button"
              onClick={this.onLogout}
              className="header-logout"
            >
              Logout
            </button>
          </nav>

          <button
            type="button"
            className="header-menu-btn"
            onClick={this.toggleMenu}
            aria-label="menu"
          >
            <HiOutlineMenu />
          </button>
        </div>

        {menuOpen && (
          <div className="mobile-menu">
            <div className="mobile-menu-close-row">
              <button
                onClick={this.toggleMenu}
                className="mobile-menu-close-btn"
                aria-label="close"
              >
                <IoClose />
              </button>
            </div>
            <div className="mobile-menu-items">
              <Link to="/" onClick={this.toggleMenu} className="mobile-menu-link">
                Home
              </Link>
              <Link to="/shelf" onClick={this.toggleMenu} className="mobile-menu-link">
                Bookshelves
              </Link>
              <button
                type="button"
                onClick={() => {
                  this.toggleMenu();
                  this.onLogout();
                }}
                className="mobile-menu-logout"
              >
                <FiLogOut /> Logout
              </button>
            </div>
          </div>
        )}
      </header>
    );
  }
}

export default withRouter(Header);
