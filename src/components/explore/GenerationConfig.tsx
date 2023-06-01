import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { ExplorationProgress } from './ExplorationProgress';
import { Link } from 'react-router-dom';
import { WorkflowConfig } from '../../stores/WorkflowTypes';
import { useStore } from '../../store';

const GenerationConfig: React.FC<any> = observer((props) => {
  let { exploreDataStore } = useStore();
  const workflowConfig: WorkflowConfig = exploreDataStore.workflowConfig;

  const runSynthesis = () => {

    
// {
//   "tool_annotations_path": "string",
//   "ontology_path": "string",
//   "ontologyPrefixIRI": "string",
//   "toolsTaxonomyRoot": "string",
//   "dataDimensionsTaxonomyRoots": [
//     "string"
//   ],
//   "strict_tool_annotations": true,
//   "cwl_annotations_path": "string",
//   "solution_length": {
//     "min": 0,
//     "max": 0
//   },
//   "timeout_sec": 0,
//   "solutions": 0,
//   "number_of_execution_scripts": 0,
//   "number_of_generated_graphs": 0,
//   "number_of_cwl_files": 0,
//   "tool_seq_repeat": true,
//   "inputs": [
//     {
//       "data_0006": [
//         "string"
//       ],
//       "format_1915": [
//         "string"
//       ],
//       "APE_label": [
//         "string"
//       ]
//     }
//   ],
//   "outputs": [
//     {
//       "data_0006": [
//         "string"
//       ],
//       "format_1915": [
//         "string"
//       ],
//       "APE_label": [
//         "string"
//       ]
//     }
//   ],
//   "debug_mode": true,
//   "use_workflow_input": "NONE",
//   "use_all_generated_data": "NONE"
// }
  };

  return (
    <div>

      <ExplorationProgress index={3} />

      <div className="m-8">
        <div className="overflow-x-auto text-left space-y-6 mt-10">

          {/* Configuration */}
          <div className="flex items-center space-x-4">
            <span className="text-3xl flex-grow-0 w-32">Configuration</span>
            <div className="flex flex-grow items-center">
            </div>
          </div>

          {/* Prev/next buttons */}
          <div className="flex justify-between p-10">
            <Link to="/explore/constraints"><button className="btn btn-primary">Previous</button></Link>
            <button className="btn btn-primary" onClick={() => runSynthesis()}>Run</button>
          </div>

        </div>
      </div>
    </div>
  );
});

export { GenerationConfig };
