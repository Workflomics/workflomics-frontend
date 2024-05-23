import React, { FC } from 'react';
import { HomeBox } from './HomeBox';
import generate_img from "../res/generate_workflow.jpg";
import benchmark_img from "../res/benchmark_workflow.jpg";
import history_img from "../res/history.jpg";

const Home: FC = () => {

  return (
    <div>
      <div className="flex space-x-7 p-11 justify-center">
        <HomeBox label="Generate workflow" descr="Generation of workflows" imgUrl={generate_img} buttonText="Explore" isEnabled={true} component="/explore/domain" />
        <HomeBox label="Benchmark workflows" descr="Evaluate the quality of your workflows" imgUrl={benchmark_img} buttonText="Benchmark" isEnabled={true} component="/benchmark/visualize" />
        <HomeBox label="How to use Workflomics?" descr="Explore the Workflomics documentation" imgUrl={history_img} buttonText="User Guide" isEnabled={true} component="https://workflomics.readthedocs.io/en/latest/user-guide/web-interface.html" />
      </div>
    </div>

  );
}

export default Home;
