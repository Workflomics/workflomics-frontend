import React, { FC } from 'react';
import './App.css';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Outlet } from 'react-router-dom';

const App: FC = () => {

  const platform_name: string = "Workflomics"
  const user_name: string = "Jane Doe"

  return (
    <div className="App">
      <Header platform_name={platform_name} user_name={user_name} />
      <Outlet />
      <Footer />
    </div>

  );
}

export default App;
