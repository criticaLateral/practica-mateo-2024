import React from "react";
// toma la SideBar, recibe los argumentos children
export const SideBar = ({ children }) => {

  // retorna
  return (
    <aside>
      <h1></h1>

      {children}
      
    </aside>
  );
};
