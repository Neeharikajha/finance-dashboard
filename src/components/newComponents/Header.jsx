

// "use client";

// import { useTheme } from "../../app/layout"; // adjust path
// import { useState } from "react";

// export default function Header() {
//   const { darkMode, setDarkMode } = useTheme();

//   const toggleTheme = () => setDarkMode(!darkMode);

//   return (
//     <header
//       className={`p-4 flex justify-between items-center transition-colors duration-300 ${
//         darkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-900"
//       }`}
//     >
//       <h1 className="text-xl font-bold">Finance Dashboard</h1>
//       <button
//         onClick={toggleTheme}
//         className="p-2 text-2xl hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition"
//       >
//         {darkMode ? "🌙" : "🌞"}
//       </button>
//     </header>
//   );
// }


"use client";

import { useTheme } from "../../app/layout"; // adjust path
import { Sun } from "lucide-react"; // Make sure lucide-react is installed

export default function Header() {
  const { darkMode, setDarkMode } = useTheme();

  const toggleTheme = () => setDarkMode(!darkMode);

  return (
    <header
      className={`p-4 flex justify-between items-center transition-colors duration-300 ${
        darkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <h1 className="text-xl font-bold">Finance Dashboard</h1>
      <button
        onClick={toggleTheme}
        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
      >
        {darkMode ? (
          <Sun className="h-6 w-6 text-white" /> // filled/white sun for dark mode
        ) : (
          <Sun className="h-6 w-6 text-yellow-400" /> // empty/light yellow sun for light mode
        )}
      </button>
    </header>
  );
}
