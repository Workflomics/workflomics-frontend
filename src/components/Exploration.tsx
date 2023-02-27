import * as React from 'react';
import { ChooseDomain } from './ChooseDomain';

interface Props {
  /** Title of the current domain. */
  label: string;
  /** Description of the current domain. */
  descr?: string;
}

export function ExplorationView({ label }: Props) {
  return (
    <div>
      <ul className="steps">
        <li className="step step-primary">Choose a domain</li>
        <li className="step step-primary">Inputs and outputs</li>
        <li className="step step-primary">Workflow constraints</li>
        <li className="step step-primary">Automated generation configuration</li>
        <li className="step ">Generate workflows</li>
      </ul>
      <ChooseDomain />
    </div>
  );
}
