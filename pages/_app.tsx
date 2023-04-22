import type { AppProps } from "next/app";

import "@/styles/globals.css";
import Header from "@/components/header";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title> Sabores Pasto </title>
      </Head>
      <Header />
      <Component {...pageProps} />
    </>
  );
}
