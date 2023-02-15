import * as React from 'react';
import { Link, Route } from 'react-router-dom';

interface Props {
  /** Title of the menu option. */
  label: string;
  /** Description of the menu option. */
  descr: string;
  /** Text on button */
  buttonText: string;
  /** URL of the Thumbnail image of the menu option. */
  imgUrl: string;
  /** True if the menu is available only to registered users. */
  isEnabled: boolean;
  /**
   * Link to the page that the menu leads to.
   */
  component: string;
}


export function HomeBox({ label, descr, buttonText, imgUrl, isEnabled, component }: Props) {
  return (
    <div className="card w-96 bg-base-100 shadow-xl">
      <figure className="px-10 pt-10">
        <img src={imgUrl} alt={label} className="rounded-xl" />
      </figure>
      <div className="card-body items-center text-center">
        <h2 className="card-title">{label}</h2>
        <p>{descr}</p>
        <div className="card-actions">
          <Link className="btn btn-primary" to={component}>{buttonText}</Link>
        </div>
      </div>
    </div>
  );
}
