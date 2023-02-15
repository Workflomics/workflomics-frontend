import * as React from 'react';

interface Props {
  /** Title of the current domain. */
  label: string;
  /** Description of the current domain. */
  descr?: string;
}

export function ExplorationView({ label }: Props) {
  return (
    <ul className="steps">
      <li className="step step-primary">Register</li>
      <li className="step step-primary">Choose plan</li>
      <li className="step">Purchase</li>
      <li className="step">Receive Product</li>
    </ul>
  );
}
