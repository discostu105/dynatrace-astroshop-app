import React from "react";
import { Link } from "react-router-dom";
import { AppHeader } from "@dynatrace/strato-components-preview/layouts";

export const Header = () => {
  return (
    <AppHeader>
      <AppHeader.NavItems>
        <AppHeader.AppNavLink as={Link} to="/">
          Orders
        </AppHeader.AppNavLink>
        <AppHeader.AppNavLink as={Link} to="/geo">
          Geographic
        </AppHeader.AppNavLink>
      </AppHeader.NavItems>
    </AppHeader>
  );
};
