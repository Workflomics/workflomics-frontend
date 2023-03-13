import * as React from 'react';
import { Link } from 'react-router-dom';
import logo from '../res/WORKFLOMICS_logo.png';

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
        <Link to="/"><img src={logo} alt="loading.." className='h-20 m-5 ml-10' /></Link>
      </div>
      <div className="grid grid-flow-col auto-cols-max mt-5">
        <h2 className='m-5'>
          {user_name}
        </h2>
        <div className="avatar">
          <div className="w-14 rounded h-20 w-20">
            <img src="https://lwlies.com/wp-content/uploads/2017/04/avatar-2009.jpg" />
          </div>
        </div>
      </div>
    </div>
  );
}
