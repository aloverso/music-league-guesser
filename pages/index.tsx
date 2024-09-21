import React, { ChangeEvent, ReactElement, useState } from "react";
import { Song } from "../src/domain/types";
import { GetServerSidePropsResult } from "next";
import { CURRENT_WEEK } from "../src/domain/consts";

interface Props {
  songs: Song[];
  names: string[];
}

const Index = (props: Props): ReactElement => {
  const [guesses, setGuesses] = useState<Record<string, string>>({});
  const [name, setName] = useState<string>("");

  const guessedNames = Object.values(guesses);
  const remainingNames = props.names.filter((it) => !guessedNames.includes(it));

  const selectName = (event: ChangeEvent<HTMLSelectElement>, title: string): void => {
    const name = event.target.value;
    setGuesses((prevState) => {
      return { ...prevState, [title]: name };
    });
  };

  const clear = (title: string): void => {
    setGuesses((prevState) => {
      delete prevState[title];
      return { ...prevState };
    });
  };

  const clearAll = (): void => {
    setGuesses({});
  };

  const submit = () => {
    fetch("/api/set", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, guesses }),
    }).then(() => {
      window.location.href = "/submitted";
    });
  };

  return (
    <>
      <main>
        <div className="container mvxl">
          <div className="row mbl">
            <div className="col-12">
              <h1 className="text-xxl bold">It&apos;s the music league guesser!</h1>
              <p className="mtd">Guess who submitted each song for week of {CURRENT_WEEK}</p>
            </div>
          </div>

          <div className="row mbxl">
            <div className="col-12">
              <div>
                <label htmlFor="#your-name">Your Name (please don&apos;t lie):</label>
                <input
                  id="your-name"
                  type="text"
                  className="mls"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </div>
              <button onClick={submit} disabled={remainingNames.length > 0 || name.length == 0}>
                Submit
              </button>
            </div>
          </div>

          <div className="row">
            <div className="col-7">
              <h2 className="text-xl bold mbs">Songs</h2>

              {props.songs.map((song) => (
                <div className="mbl" key={song.title}>
                  <h3 className="text-m bold">{song.title}</h3>
                  <p>{song.artist}</p>
                  <p className="mld">
                    <i>{song.comment}</i>
                  </p>
                  <select
                    className="pas width-50"
                    onChange={(event) => selectName(event, song.title)}
                  >
                    {guesses[song.title] ? (
                      <option value={guesses[song.title]} selected>
                        {guesses[song.title]}
                      </option>
                    ) : (
                      <option value="" hidden disabled selected>
                        -- select --
                      </option>
                    )}
                    {remainingNames.map((name) => (
                      <option value={name} key={song.title + name}>
                        {name}
                      </option>
                    ))}
                  </select>
                  <button className="mls secondary" onClick={() => clear(song.title)}>
                    Clear
                  </button>
                </div>
              ))}
            </div>

            <div className="col-4 offset-1">
              <h2 className="text-xl bold mbd">Remaining Names ({remainingNames.length})</h2>
              {props.names.map((it) => {
                if (remainingNames.includes(it)) return <p>{it}</p>;
                else
                  return (
                    <p>
                      <s>{it}</s>
                    </p>
                  );
              })}
              <button className="secondary" onClick={clearAll}>
                Clear all guesses
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export const getServerSideProps = async (): Promise<GetServerSidePropsResult<Props>> => {
  const names = (await import(`../data/${CURRENT_WEEK}/names.ts`)).default;
  const songs = (await import(`../data/${CURRENT_WEEK}/songs.ts`)).default;

  if (songs.length !== names.length) {
    throw new Error("names and songs do not match");
  }

  return { props: { songs, names } };
};

export default Index;
