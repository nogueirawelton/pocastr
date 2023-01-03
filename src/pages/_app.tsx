import { AppProps } from 'next/app';
import { Header } from '../components/Header';
import { Player } from '../components/Player';
import { PlayerProvider } from '../hooks/usePlayer';

import styles from '../styles/app.module.scss';
import '../styles/global.scss';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className={styles.wrapper}>
      <PlayerProvider>
        <main>
          <Header />
          <Component {...pageProps} />
        </main>
        <Player />
      </PlayerProvider>
    </div>
  );
}

export default MyApp;
