import React from "react";
const _jsxFileName = "src\\components\\NavLink.tsx";import { NavLink as RouterNavLink, } from "react-router-dom";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const NavLink = forwardRef(
  ({ className, activeClassName, pendingClassName, to, ...props }, ref) => {
    return (
      React.createElement(RouterNavLink, {
        ref: ref,
        to: to,
        className: ({ isActive, isPending }) =>
          cn(className, isActive && activeClassName, isPending && pendingClassName)
        ,
        ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 14}}
      )
    );
  },
);

NavLink.displayName = "NavLink";

export { NavLink };
