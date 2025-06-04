import React, { useEffect, useState } from "react";

import { Provider as ReduxProvider } from "react-redux";

import { BrowserRouter as Router } from "react-router-dom";

import { OidcProvider } from "redux-oidc";
import Almacenamiento from "./redux/almacenamiento";

import ComponenteBase from "./componentes/ComponenteBase";

// Notifications
import { ToastContainer } from "react-toastify";
import userManager from "./userManager";
import { esES } from '@mui/x-data-grid/locales';
import { createTheme, ThemeProvider, useTheme } from "@mui/material";

function App() {
  const [navegadorFirefox, setNavegadorFirefox] = useState<boolean>(true);
  const theme = useTheme();
  const themeWithLocale = React.useMemo(() => createTheme(theme, esES), [theme]);

  const detectarNavegadorFirefox = (): boolean => {
    if (
      (navigator.userAgent.includes("Firefox") ||
      navigator.userAgent.includes("Gecko") ||
      navigator.userAgent.includes("FxiOS")) && !navigator.userAgent.includes("Chrome")
    ) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    setNavegadorFirefox(detectarNavegadorFirefox());
  }, []);

  if (!navegadorFirefox) {
    return (
      <div
        style={{
          padding: "20px",
          backgroundColor: "#f44336",
          color: "white",
          textAlign: "center",
        }}
      >
        <h6>El sistema solo funciona en el navegador Firefox.</h6>
      </div>
    );
  }

  return (
    <ReduxProvider store={Almacenamiento}>
      <OidcProvider store={Almacenamiento} userManager={userManager}>
        <ThemeProvider theme={themeWithLocale}>
          <div>
            <ToastContainer />
            <Router>
              <ComponenteBase />
            </Router>
          </div>
        </ThemeProvider>
      </OidcProvider>
    </ReduxProvider>
  );
}

export default App;
