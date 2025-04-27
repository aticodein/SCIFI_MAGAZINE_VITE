//src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import Routes from "./router";
import "./index.css";
import { Toaster } from 'react-hot-toast';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Routes />
    <Toaster
      position="top-center"
      reverseOrder={false}
      toastOptions={{
        duration: 4000,
        style: {
          background: '#333',
          color: '#fff',
          border: '1px solid #22d3ee', // Light-cyber glow color
        },
      }}
    />
  </React.StrictMode>
);
