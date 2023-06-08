import { Link } from 'react-router-dom';

interface Props {
  index: number;
}

export function ExplorationProgress({ index }: Props) {

  return (
    <div>
      <ul className="steps">
        <li className={`step ${ index >= 0 ? 'step-primary' : ''}`}><Link to="../domain">Domain</Link></li>
        <li className={`step ${ index >= 1 ? 'step-primary' : ''}`}><Link to="../inputs-outputs">Inputs & outputs</Link></li>
        <li className={`step ${ index >= 2 ? 'step-primary' : ''}`}><Link to="../constraints">Constraints</Link></li>
        <li className={`step ${ index >= 3 ? 'step-primary' : ''}`}><Link to="../configuration">Configuration</Link></li>
        <li className={`step ${ index >= 4 ? 'step-primary' : ''}`}><Link to="../results">Generate workflows</Link></li>
      </ul>
    </div>
  );
}
