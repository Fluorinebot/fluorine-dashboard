import { useState } from "react";
import {
  BrowserRouter,
  createBrowserRouter,
  Route,
  Router,
  RouterProvider,
  Routes,
} from "react-router-dom";
import Home from "./routes/home";

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/servers", element: <div>you're now on the servers page</div> },
]);

export default function App() {
  const prefersDarkScheme = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;

  const currentTheme = localStorage.getItem("theme");

  const [isDark, setDarkState] = useState<boolean>(
    currentTheme ? JSON.parse(currentTheme) : prefersDarkScheme
  );

  document.body.classList.add(isDark ? "dark" : "light");

  if (!currentTheme) {
    localStorage.setItem("theme", JSON.stringify(prefersDarkScheme));
  }

  function setDark() {
    localStorage.setItem("theme", JSON.stringify(!isDark));
    setDarkState((dark: boolean) => !dark);
    document.body.classList.toggle(isDark ? "dark" : "light");
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}
