import React, { ReactElement } from "react";
import { Guess } from "../src/domain/types";
import { GetServerSidePropsResult } from "next";
import { CURRENT_WEEK } from "../src/domain/consts";

interface Props {
  answers: Record<string, string>;
  guesses: Guess[];
}

type PeopleCorrect = {
  song: string;
  correct: boolean;
}

const Results = (props: Props): ReactElement => {

  const rows = []
  const people = Object.values(props.answers).sort()

  for (const guesser of props.guesses) {

    let numberCorrect = 0

    const peopleCorrect: Record<string, PeopleCorrect> = {}
    for (const title of Object.keys(guesser.guesses)) {
      if (guesser.guesses[title] === props.answers[title]) {
        numberCorrect += 1;
        peopleCorrect[guesser.guesses[title]] = {
          song: title,
          correct: true
        }
      } else {
        peopleCorrect[guesser.guesses[title]] = {
          song: title,
          correct: false
        }
      }
    }

    const percentCorrect = Math.round((numberCorrect / Object.keys(guesser.guesses).length) * 100)
    const peopleResultsOrdered = Object.keys(peopleCorrect).sort().map(name => peopleCorrect[name])

    rows.push([
      guesser.submitterName,
      percentCorrect,
      ...peopleResultsOrdered
    ])
  }

  const sumPerPerson = rows.reduce((acc: number[], curRow: any[]) => {
    curRow.slice(2).forEach((personCorrect, i) => {
      if(personCorrect.correct) {
        acc[i] += 1
      }
    })
    return acc
  }, Array(people.length).fill(0) as number[])

  const percents = rows.map(row => row[1])
  const maxPercent = percents.reduce((a, b) => Math.max(a, b), -Infinity);
  const winners = rows.filter(row => row[1] >= maxPercent).map(row => row[0])

  const maxSumPerPerson = sumPerPerson.reduce((a, b) => Math.max(a, b), -Infinity);
  const minSumPerPerson = sumPerPerson.reduce((a, b) => Math.min(a, b), 100);

  const easiestToGuess = sumPerPerson.reduce((acc: string[], curr: number, i) => {
    if (curr === maxSumPerPerson) {
      acc.push(people[i])
    }
    return acc
  }, [])

  const mostUnknowable = sumPerPerson.reduce((acc: string[], curr: number, i) => {
    if (curr === minSumPerPerson) {
      acc.push(people[i])
    }
    return acc
  }, [])

  if (Object.keys(props.answers).length === 0) {
    return <>
      <main>
        <div className="container mvxl">
          <div className="row mbl">
            <div className="col-12">
              <h1 className="text-xxl bold">It&apos;s the music league guesser!</h1>
              <p className="mtd">Results for the week of {CURRENT_WEEK}</p>

              <p className="text-xl mtl">Results not yet available for {CURRENT_WEEK}</p>
            </div>

          </div>
        </div>
      </main>
    </>
  }

  return (
    <>
      <main>
        <div className="container mvxl">
          <div className="row mbl">
            <div className="col-12">
              <h1 className="text-xxl bold">It&apos;s the music league guesser!</h1>
              <p className="mtd">Results for the week of {CURRENT_WEEK}</p>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Guesser</th>
                <th>Percent Correct</th>
                {people.map(name => <th key={name}>{name}</th>)}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i}>
                  <td><b>{row[0]}</b></td>
                  <td>{row[1]}%</td>
                  {row.slice(2).map((column, i) => (
                    <td key={`${row[0]}${i}`} className="text-s">
                      {(column as PeopleCorrect).correct ? "✅" : "❌"}{" "}
                      <span className="text-xs">{(column as PeopleCorrect).song}</span>
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                <td></td>
                <td></td>
                {sumPerPerson.map((sum, i) => (
                  <td key={`sum${i}`}>{sum}</td>
                ))}
              </tr>
            </tbody>
          </table>

          <div className="mtl">
            <h2 className="text-l mbs bold">Winner</h2>
            <p><b>{winners.join(", ")}</b> with {maxPercent}%</p>

            <h2 className="text-l mbs bold">Easiest to identify</h2>
            <p><b>{easiestToGuess.join(", ")}</b> with {maxSumPerPerson} correct identifications</p>

            <h2 className="text-l mbs bold">Most unknowable</h2>
            <p><b>{mostUnknowable.join(", ")}</b> with {minSumPerPerson} correct identifications</p>
          </div>
        </div>
      </main>
    </>
  );
};

export const getServerSideProps = async (): Promise<GetServerSidePropsResult<Props>> => {
  const answers = (await import(`../data/${CURRENT_WEEK}/answers.ts`)).default;
  const guesses = (await (await fetch("https://music-league-guesser.netlify.app/api/getstore")).json())
    .filter((it: Guess) => it.timestamp !== "2024-09-27T02:58:24+00:00")

  return { props: { answers, guesses } }; 
};

export default Results;
