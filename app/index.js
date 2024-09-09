import React from "react";
export const SideBar = ({ children }) => {
  return (
    <aside>
      <h1>This is a custom sidebar!</h1>

      {children}
    </aside>
  );
};
