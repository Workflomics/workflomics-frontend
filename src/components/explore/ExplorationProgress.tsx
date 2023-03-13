import { Link } from 'react-router-dom';

interface Props {
  index: number;
}

export function ExplorationProgress({ index }: Props) {

  return (
    <div>
      <ul className="steps">
        <li className={`step ${ index >= 0 ? 'step-primary' : ''}`}><Link to="../domain">Choose a domain</Link></li>
        <li className={`step ${ index >= 1 ? 'step-primary' : ''}`}><Link to="../inputs-outputs">Inputs and outputs</Link></li>
        <li className={`step ${ index >= 2 ? 'step-primary' : ''}`}><Link to="../inputs-outputs">Workflow constraints</Link></li>
        <li className={`step ${ index >= 3 ? 'step-primary' : ''}`}>Automated generation configuration</li>
        <li className={`step ${ index >= 4 ? 'step-primary' : ''}`}>Generate workflows</li>
      </ul>
    </div>
  );
}
