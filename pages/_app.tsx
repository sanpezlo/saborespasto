import type { AppProps } from "next/app";
import Head from "next/head";

import "@/styles/globals.css";
import Header from "@/components/header";
import { AuthProvider } from "@/context/Auth";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title> Sabores Pasto </title>
      </Head>
      <AuthProvider>
        <Header />
        <Component {...pageProps} />
      </AuthProvider>
    </>
  );
}
