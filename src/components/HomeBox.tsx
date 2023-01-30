import * as React from 'react';

interface Props {
    /** Title of the menu option. */
    title: string;
    /** Description of the menu option. */
    desc : string;
    /** URL of the Thumbnail image of the menu option. */
    imgUrl: string;
    /** True if the menu is available only to registered users. */
    loginRequired?: boolean;
}

export function HomeBox (props: Props) {
  return (
    <div>
      <h1>{props.title}</h1>
    </div>
  );
}
