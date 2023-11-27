import Nav from "../Nav/nav";
import type { ReactNode } from "react";
import Head from "next/head";

interface Props {
  children?: ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <>
      <Head>
        <title>CRM</title>
        <meta name="description" content="CRM" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Nav />
      {children}
    </>
  );
}
