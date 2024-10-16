import React from "react";
// toma la SideBar, recibe los argumentos children
export const SideBar = ({ children }) => {

  // retorna
  return (
    <aside>
      <h1>Custom SideBar TODO</h1>

      {children}
      
    </aside>
  );
};
