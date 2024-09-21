import "@styles/index.scss";
import React, { ReactElement } from "react";
import { AppProps } from "next/app";
import Head from "next/head";

const App = ({ Component, pageProps }: AppProps): ReactElement => {
  return (
    <>
      <Head>
        <title>Music League Guesser</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
};

export default App;
