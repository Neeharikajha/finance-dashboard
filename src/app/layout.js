// "use client";
// import { Provider } from "react-redux";
// import { store } from "../store";
// import './globals.css';

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <body>
//         <Provider store={store}>
//           {children}
//         </Provider>
//       </body>
//     </html>
//   );
// }


"use client";

import { useState, createContext, useContext } from "react";
import { Provider } from "react-redux";
import { store } from "../store";
import "./globals.css";

// Create Theme Context
export const ThemeContext = createContext();

export default function RootLayout({ children }) {
  const [darkMode, setDarkMode] = useState(true);

  return (
    <html lang="en">
      <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
        <body className={darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}>
          <Provider store={store}>
            {children}
          </Provider>
        </body>
      </ThemeContext.Provider>
    </html>
  );
}

// Custom hook for easier usage
export const useTheme = () => useContext(ThemeContext);
