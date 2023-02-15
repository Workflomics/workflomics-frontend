import * as React from 'react';
import { Link } from 'react-router-dom';

interface Props {
  /** Name of the platform presented in the header. */
  platform_name: string;

}

export function Header({ platform_name }: Props) {
  return (
    <div className="text-5xl font-bold">
      <h1>{platform_name}</h1>
    </div>
  );
}
