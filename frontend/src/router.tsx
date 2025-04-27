//src/router.tsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./Layout";
import App from "./App";
import Watch from "./pages/Watch";
import Read from "./pages/Read";
import Retro from "./pages/Retro";
import Pro from "./pages/Pro";
import About from "./pages/About";
import React from "react";
import ReadBooks from "./pages/ReadBooks";
import ReadNovels from "./pages/ReadNovels";
import ReadComics from "./pages/ReadComics";
import ReadGolden from "./pages/ReadGolden"; 
import { CreateUsername } from "./components/User/CreateUsername"; 



const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <App /> },
      { path: "/create", element: <CreateUsername /> },
      
      { path: "/watch", element: <Watch /> },
      { path: "/read", element: <Read /> },
      { path: "/retro", element: <Retro /> },
      { path: "/pro", element: <Pro /> },
      { path: "/about", element: <About /> },
      {
        path: "/read/books",
        element: <ReadBooks />,
      },
      {
        path: "/read/novels",
        element: <ReadNovels />,
      },
      {
        path: "/read/comics",
        element: <ReadComics />,
      },
      {
        path: "/read/golden",
        element: <ReadGolden />,
      } 
    ],
  },
]);

export default function Routes() {
  return (
    <RouterProvider
      router={router}
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    />
  );
}
