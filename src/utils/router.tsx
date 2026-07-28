import type { ComponentType } from "react";
import { useNavigate, useParams, useLocation, Link, NavLink } from "react-router-dom";

export function withRouter<P extends object>(WrappedComponent: ComponentType<P & any>) {
  const ComponentWithRouterProp = (props: P) => {
    const navigate = useNavigate();
    const params = useParams();
    const location = useLocation();
    return (
      <WrappedComponent
        {...(props as any)}
        navigate={navigate}
        params={params}
        location={location}
      />
    );
  };
  return ComponentWithRouterProp;
}

export { Link, NavLink };
