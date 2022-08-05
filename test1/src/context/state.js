import { createContext, useContext } from "react";

const MyContext = createContext();

export function MyProvider({ children }) {
  const sharedState = { number: 0, name: "name" };

  return <MyContext.Provider value={sharedState}>{children}</MyContext.Provider>;
}

export function useMyContext() {
  return useContext(MyContext);
}
