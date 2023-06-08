import { Link } from 'react-router-dom';

interface Props {
  index: number;
}

export function ExplorationProgress({ index }: Props) {

  return (
    <div className="steps">
      <a href="/explore/domain" className={`step ${index >= 0 ? 'step-primary' : ''}`}>Domain</a>
      <a href="/explore/inputs-outputs" className={`step ${index >= 1 ? 'step-primary' : ''}`}>Inputs &amp; outputs</a>
      <a href="/explore/constraints" className={`step ${index >= 2 ? 'step-primary' : ''}`}>Constraints</a>
      <a href="/explore/configuration" className={`step ${index >= 3 ? 'step-primary' : ''}`}>Configuration</a>
      <a href="/explore/results" className={`step ${index >= 4 ? 'step-primary' : ''}`}>Generate workflows</a>
    </div>
  );
}
