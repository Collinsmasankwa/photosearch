import {createContext, useContext} from "react";

export const AppContext = createContext({});
export const useAppProvider = () => useContext(AppContext);
