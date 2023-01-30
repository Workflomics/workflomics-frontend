import React, {FC } from 'react';
import './App.css';
import { HomeBox } from './components/HomeBox';

const App:FC =  () => {
  
  const platform_name: string = "Workflomics"

  return (
    <div className="App">
      {platform_name}
      <HomeBox title="Explore workflow" desc="Exploration of workflows" imgUrl=""/>
    </div>
  );
}

export default App;
