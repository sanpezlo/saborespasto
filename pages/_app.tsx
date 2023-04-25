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
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <AuthProvider>
        <Header />
        <Component {...pageProps} />
      </AuthProvider>
    </>
  );
}
