import Image from 'next/image';
import Slider from 'rc-slider';
import { useEffect, useRef, useState } from 'react';
import { usePlayer } from '../../hooks/usePlayer';

import 'rc-Slider/assets/index.css';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';
import styles from './styles.module.scss';

export const Player = () => {
  const {
    episodeList,
    currentEpisodeIndex,
    isPlaying,
    togglePlay,
    setPlayingState,
    playNext,
    playPrevious,
    hasNext,
    hasPrevious,
    toggleLoop,
    isLooping,
    toggleShuffle,
    isShuffling,
    clearPlayerState,
  } = usePlayer();

  const episode = episodeList[currentEpisodeIndex];

  const audioRef = useRef<HTMLAudioElement>(null);

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!audioRef.current) {
      return;
    }

    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  function setupProgressListener() {
    audioRef.current.currentTime = 0;
    audioRef.current.addEventListener('timeupdate', () => {
      setProgress(Math.floor(audioRef.current.currentTime));
    });
  }

  function handleSeek(amount: number) {
    audioRef.current.currentTime = amount;
  }

  function handleEpisodeEnded() {
    if (hasNext) {
      playNext();
    } else {
      clearPlayerState();
    }
  }

  return (
    <div className={styles.playerContainer}>
      <header>
        <img
          src="/playing.svg"
          alt="Tocando agora"
        />
        <strong>Tocando agora</strong>
      </header>
      {episode ? (
        <div className={styles.playingEpisode}>
          <Image
            width={592}
            height={592}
            src={episode.thumbnail}
            alt={episode.title}
            objectFit="cover"
          />
          <strong>{episode.title}</strong>
          <span>{episode.members}</span>
        </div>
      ) : (
        <div className={styles.emptyPlayer}>
          <strong>Selecione um podcast para ouvir</strong>
        </div>
      )}

      <footer className={!episode ? styles.empty : ''}>
        <div className={styles.progress}>
          <span>{convertDurationToTimeString(progress)}</span>
          <div className={styles.slider}>
            {episode ? (
              <Slider
                trackStyle={{ backgroundColor: '#04d361' }}
                railStyle={{
                  backgroundColor: '#9f75ff',
                }}
                handleStyle={{
                  borderColor: '##04d361',
                  borderWidth: 4,
                }}
                max={episode.durationRaw}
                value={progress}
                onChange={handleSeek}
              />
            ) : (
              <div className={styles.emptySlider} />
            )}
          </div>
          <span>{convertDurationToTimeString(episode?.durationRaw ?? 0)}</span>
        </div>
        {episode && (
          <audio
            ref={audioRef}
            src={episode.url}
            loop={isLooping}
            autoPlay
            onPlay={() => setPlayingState(true)}
            onPause={() => setPlayingState(false)}
            onLoadedMetadata={setupProgressListener}
            onEnded={handleEpisodeEnded}
          />
        )}
        <div className={styles.buttons}>
          <button
            disabled={!episode || episodeList.length === 1}
            onClick={toggleShuffle}
            className={isShuffling ? styles.isActive : ''}>
            <img
              src="/shuffle.svg"
              alt="Embaralhar"
            />
          </button>
          <button
            disabled={!episode || !hasPrevious}
            onClick={playPrevious}>
            <img
              src="/play-previous.svg"
              alt="Tocar anterior"
            />
          </button>
          <button
            className={styles.playButton}
            disabled={!episode}
            onClick={togglePlay}>
            {isPlaying ? (
              <img
                src="/pause.svg"
                alt="Tocar"
              />
            ) : (
              <img
                src="/play.svg"
                alt="Tocar"
              />
            )}
          </button>
          <button
            disabled={!episode || !hasNext}
            onClick={playNext}>
            <img
              src="/play-next.svg"
              alt="Tocar Próxima"
            />
          </button>
          <button
            disabled={!episode}
            onClick={toggleLoop}
            className={isLooping ? styles.isActive : ''}>
            <img
              src="/repeat.svg"
              alt="Repetir"
            />
          </button>
        </div>
      </footer>
    </div>
  );
};
