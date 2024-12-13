import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import DisplayProduct from "./pages/DisplayProduct";
import AddPredefine from "./pages/AddPredefine";
import Home from "./pages/Home";

const router = createBrowserRouter([
  { path: "/", element: <App />,
    children : [
      { path : '/', element : <Home/>},
      { path: "/displayProduct", element: <DisplayProduct /> },
      { path: "/addPredefine", element: <AddPredefine /> },
    ]
   },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router}>
      <App />
    </RouterProvider>
  </StrictMode>
);
