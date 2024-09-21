import React, { ReactElement } from "react";
import { CURRENT_WEEK } from "../src/domain/consts";


const Submitted = (): ReactElement => {
  return (
    <>
      <main>
        <div className="container mvxl">
          <div className="row mbl">
            <div className="col-12">
              <h1 className="text-xxl bold">It's the music league guesser!</h1>
              <p className="mtd">Guess who submitted each song for week of {CURRENT_WEEK}</p>
            </div>
          </div>

          <h2 className="text-xl">Thanks for you submission!</h2>
        </div>
      </main>
    </>
  );
};

export default Submitted;
