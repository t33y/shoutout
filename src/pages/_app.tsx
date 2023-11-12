import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import Head from "next/head";
import { SideNav } from "~/components/SideNav";
import Header from "~/components/Header";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Head>
        <title>Twitter Clone</title>
        <meta name="description" content="Twitter clone by t33why" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <SideNav />
      <div className="dak:bg-slate-800 container flex  min-h-screen dark:text-white  sm:pr-4">
        <div className="ml-[50px] min-h-screen flex-grow border-x sm:ml-40  ">
          <Component {...pageProps} />
        </div>
      </div>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
