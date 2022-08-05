import "../styles/globals.css";
import { MyProvider } from "../src/context/state";

function MyApp({ Component, pageProps }) {
  return (
    <MyProvider>
      <Component {...pageProps} />
    </MyProvider>
  );
}

export default MyApp;
