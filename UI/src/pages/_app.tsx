import "@/styles/globals.scss";
import StyledComponentsRegistry from "@/utils/AntdRegistry";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <StyledComponentsRegistry>
      <Component {...pageProps} />
    </StyledComponentsRegistry>
  );
}
