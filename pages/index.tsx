import Head from "next/head";

import { useNoAdmin } from "@/hooks/noAdmin";

export default function Home() {
  const { isLoadingAccount } = useNoAdmin({ redirectTo: "/mi-restaurante" });

  if (isLoadingAccount) return <></>;

  return (
    <>
      <Head>
        <title> Sabores Pasto - Inicio </title>
      </Head>
      <main></main>;
    </>
  );
}
