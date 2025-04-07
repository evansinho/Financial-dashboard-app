/* eslint-disable @typescript-eslint/no-explicit-any */
import { SessionProvider } from "next-auth/react";
import { Provider } from "react-redux";
import { store } from "../store";
import "../styles/globals.css";

export default function MyApp({ Component, pageProps }: any) {
  return (
    <Provider store={store}>
      <SessionProvider session={pageProps.session}>
        <Component {...pageProps} />
      </SessionProvider>
    </Provider>
  );
}
