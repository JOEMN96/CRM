import "@/styles/globals.scss";
import StyledComponentsRegistry from "@/utils/AntdRegistry";
import { NextPage } from "next";
import type { AppProps } from "next/app";
import { ReactElement, ReactNode } from "react";
import { Josefin_Sans } from "next/font/google";
import { store } from "../store/store.ts";
import { Provider } from "react-redux";

const fredoka = Josefin_Sans({ subsets: ["latin"] });

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout || ((page) => page);

  return (
    <Provider store={store}>
      {getLayout(
        <main className={fredoka.className}>
          <StyledComponentsRegistry>
            <Component {...pageProps} />
          </StyledComponentsRegistry>
        </main>
      )}
    </Provider>
  );
}
