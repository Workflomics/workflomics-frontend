import React, { FC } from 'react';
import './App.css';
import { ExplorationView } from './components/Exploration';
import { Routes, Route, createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Test } from './components/Test';
import Home from './components/Home';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/explore",
    element: <ExplorationView label={'Label'} />,
  },
  {
    path: "/test",
    element: <Test />,
  },
]);

const App: FC = () => {

  const platform_name: string = "Workflomics"
  const user_name: string = "Jane Doe"

  return (
    <div className="App">
      <Header platform_name={platform_name} user_name={user_name} />
      <RouterProvider router={router} />
      <Footer />
    </div>

  );
}

export default App;
