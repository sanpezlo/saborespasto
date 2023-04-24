import Head from "next/head";

import Loading from "@/components/loading";
import { useAdmin } from "@/hooks/admin";

export default function MiRestaurante() {
  const { account, isLoadingAccount } = useAdmin();

  if (isLoadingAccount)
    return (
      <>
        <Head>
          <title> Sabores Pasto - Mi Restaurante</title>
        </Head>
        <main className="mx-auto flex max-w-7xl items-center justify-center">
          <Loading />
        </main>
      </>
    );

  return (
    <>
      <Head>
        <title> Sabores Pasto - Mi Restaurante </title>
      </Head>

      <main className="mx-auto flex max-w-7xl items-center justify-center"></main>
    </>
  );
}
