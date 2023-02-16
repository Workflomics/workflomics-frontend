import * as React from 'react';
import { Link } from 'react-router-dom';
import background from '../res/header_background.jpg';

interface Props {
  /** Name of the platform presented in the header. */
  platform_name: string;
  /** Name of the user currently logged in. */
  user_name: string;

}

export function Header({ platform_name, user_name }: Props) {
  return (
    <div className="grid grid-flow-col auto-cols-auto w-full mt-4 mb-8">
      <div className="text-5xl font-bold">
        <h1>{platform_name}</h1>
      </div>
      <div className="grid grid-flow-col auto-cols-max">
        <h2 className='m-4'>
          {user_name}
        </h2>
        <div className="avatar">
          <div className="w-14 rounded">
            <img src="https://lwlies.com/wp-content/uploads/2017/04/avatar-2009.jpg" />
          </div>
        </div>
      </div>
    </div>
  );
}
