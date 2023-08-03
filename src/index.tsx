import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';
import { StoreProvider } from './store';
import App from './App';
import Home from './components/Home';
import { ChooseDomain } from './components/explore/ChooseDomain';
import { InputsOutputs } from './components/explore/InputsOutputs';
import { WorkflowConstraints } from './components/explore/WorkflowConstraints';
import { GenerationConfig } from './components/explore/GenerationConfig';
import { GenerationResults } from './components/explore/GenerationResults';
import { VisualizeBenchmark } from './components/benchmark/VisualizeBenchmarks';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "explore",
        children: [
          { path: "domain", element: <ChooseDomain /> },
          { path: "inputs-outputs", element: <InputsOutputs /> },
          { path: "constraints", element: <WorkflowConstraints /> },
          { path: "configuration", element: <GenerationConfig /> },
          { path: "results", element: <GenerationResults />}
        ]
      },
      {
        path: "benchmark",
        children: [
          { path: "visualize", element: <VisualizeBenchmark /> }
        ]
      }
    ]
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <StoreProvider>
      <RouterProvider router={router} />
    </StoreProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
