import { Component } from "react";
import Cookies from "js-cookie";
import { Navigate } from "react-router-dom";
import { withRouter } from "../utils/router";
import Logo from "./Logo";
import { loginHeroUri } from "./Illustrations";

interface Props {
  navigate: (path: string, opts?: any) => void;
}

interface State {
  username: string;
  password: string;
  showError: boolean;
  errorMsg: string;
  submitting: boolean;
}

class Login extends Component<Props, State> {
  private _isMounted = false;

  state: State = {
    username: "",
    password: "",
    showError: false,
    errorMsg: "",
    submitting: false,
  };

  componentDidMount() {
    this._isMounted = true;
    document.title = "Book Hub — Login";
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  onChangeUsername = (e: React.ChangeEvent<HTMLInputElement>) =>
    this.setState({ username: e.target.value });

  onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) =>
    this.setState({ password: e.target.value });

  onSubmitSuccess = (jwtToken: string) => {
    Cookies.set("jwt_token", jwtToken, { expires: 30 });
    this.props.navigate("/", { replace: true });
  };

  onSubmitFailure = (errorMsg: string) => {
    if (this._isMounted) {
      this.setState({ showError: true, errorMsg, submitting: false });
    }
  };

  onSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    const { username, password } = this.state;

    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    if (!trimmedUsername || !trimmedPassword) {
      this.setState({
        showError: true,
        errorMsg: "Please enter a valid username and password",
        submitting: false,
      });
      return;
    }

    this.setState({ submitting: true, showError: false });
    const url = "https://apis.ccbp.in/login";
    const userDetails = { username: trimmedUsername, password: trimmedPassword };
    const options = {
      method: "POST",
      body: JSON.stringify(userDetails),
    };

    try {
      const response = await fetch(url, options);
      const data = await response.json();
      if (response.ok) {
        this.onSubmitSuccess(data.jwt_token);
      } else {
        this.onSubmitFailure(data.error_msg || "Invalid credentials");
      }
    } catch {
      this.onSubmitFailure("Something went wrong. Please check your connection.");
    }
  };

  render() {
    const token = Cookies.get("jwt_token");
    if (token !== undefined) {
      return <Navigate to="/" replace />;
    }
    const { username, password, showError, errorMsg, submitting } = this.state;
    return (
      <div className="login-page">
        <div className="login-illustration-desktop">
          <img src={loginHeroUri} alt="website login" />
        </div>

        <div className="login-illustration-mobile">
          <img src={loginHeroUri} alt="website login" />
        </div>

        <div className="login-form-wrap">
          <form onSubmit={this.onSubmitForm} className="login-form">
            <div className="login-logo-row">
              <Logo alt="login website logo" />
            </div>

            <div className="login-field">
              <label htmlFor="username" className="login-label">
                Username*
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={this.onChangeUsername}
                placeholder="rahul"
                className="login-input"
                autoComplete="username"
              />
            </div>

            <div className="login-field">
              <label htmlFor="password" className="login-label">
                Password*
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={this.onChangePassword}
                placeholder="rahul@2021"
                className="login-input"
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="login-submit"
            >
              {submitting ? "Logging in..." : "Login"}
            </button>
            {showError && <p className="login-error">*{errorMsg}</p>}
          </form>
        </div>
      </div>
    );
  }
}

export default withRouter(Login);
