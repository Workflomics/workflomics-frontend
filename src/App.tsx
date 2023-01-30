import React, {FC } from 'react';
import './App.css';
import { HomeBox } from './components/HomeBox';

const App:FC =  () => {
  
  const platform_name: string = "Workflomics"

  return (
    <div className="App">
      
      <div className="text-5xl font-bold">
        <h1>{platform_name}</h1>
      </div>

      <div className="flex space-x-7 p-11">
        <HomeBox label="Explore workflow" descr="Exploration of workflows" imgUrl="" buttonText="Explore" isEnabled={true}/>
        <HomeBox label="Compose & benchmark" descr="Automatically compose and benchmark workflows" imgUrl="" buttonText="Compose" isEnabled={true}/>
        <HomeBox label="Benchmark workflows" descr="Evaluate the quality of your workflows" imgUrl="" buttonText="Benchmark" isEnabled={true}/>
        <HomeBox label="My workflows" descr="Explore discovered and uploaded workflows" imgUrl="" buttonText="Workflows" isEnabled={true}/>
      </div>
    </div>
  );
}

export default App;
