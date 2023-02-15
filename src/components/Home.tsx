import React, { FC } from 'react';
import { HomeBox } from './HomeBox';
import { ExplorationView } from './Exploration';
import { Routes, Route } from 'react-router-dom';
import { Test } from './Test';

const Home: FC = () => {

  return (
    <div>
      <div className="flex space-x-7 p-11">
        <HomeBox label="Generate workflow" descr="Generation of workflows" imgUrl="" buttonText="Explore" isEnabled={true} component="/explore" />
        <HomeBox label="Benchmark workflows" descr="Evaluate the quality of your workflows" imgUrl="" buttonText="Benchmark" isEnabled={true} component="/test" />
        <HomeBox label="My workflows" descr="Explore discovered and uploaded workflows" imgUrl="" buttonText="Workflows" isEnabled={true} component="/" />
      </div>
    </div>

  );
}

export default Home;
