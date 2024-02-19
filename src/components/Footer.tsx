import * as React from 'react';

interface Props {
}

export function Footer({ }: Props) {
  return (
    <div>
      <footer className="footer px-10 py-4 border-t bg-base-200 text-base-content border-base-300">
        <div className="items-center grid-flow-col">
          <p>Developed by <a href="http://www.https://www.esciencecenter.nl/" >Netherlands eSceince Center</a> in collaboration with <a href="https://www.lumc.nl/" >LUMC (Leids Universitair Medisch Centrum)</a> and <a href="https://www.uni-potsdam.de/en/university-of-potsdam">University of Potsdam</a>.
            Illustrations are designed by < a href="http://www.freepik.com" >Freepik</a >.</p>
        </div>
      </footer>
    </div>
  );
}
