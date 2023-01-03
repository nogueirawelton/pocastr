import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { usePlayer } from '../../hooks/usePlayer';
import { api } from '../../services/api';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';

import styles from './episode.module.scss';

interface Episode {
  id: string;
  title: string;
  thumbnail: string;
  description: string;
  members: string;
  duration: string;
  durationRaw: number;
  url: string;
  publishedAt: string;
}

interface HomeProps {
  episode: Episode;
}

export default function Episode({ episode }: HomeProps) {
  const { play } = usePlayer();
  return (
    <div className={styles.episodeContainer}>
      <Head>
        <title>{`${episode.title} | Podcastr`}</title>
      </Head>
      <div className={styles.thumbnailContainer}>
        <Link href="/">
          <button>
            <img
              src="/arrow-left.svg"
              alt="Voltar"
            />
          </button>
        </Link>
        <Image
          width={700}
          height={160}
          src={episode.thumbnail}
          alt="Thumbnail"
          objectFit="cover"
        />
        <button onClick={() => play(episode)}>
          <img
            src="/play.svg"
            alt="Tocar Episódio"
          />
        </button>
      </div>
      <header>
        <h1>{episode.title}</h1>
        <span>{episode.members}</span>
        <span>{episode.publishedAt}</span>
        <span>{episode.duration}</span>
      </header>
      <div
        className={styles.description}
        dangerouslySetInnerHTML={{
          __html: episode.description,
        }}
      />
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await api.get('episodes', {
    params: {
      _limit: 2,
      _sort: 'published_at',
      _order: 'desc',
    },
  });

  const paths = data.map((episode) => {
    return {
      params: { slug: episode.id },
    };
  });

  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;

  const {
    data: { id, title, thumbnail, members, description, file, published_at },
  } = await api.get(`/episodes/${slug}`);

  const episode = {
    id,
    title,
    thumbnail,
    members,
    description,
    url: file.url,
    duration: convertDurationToTimeString(Number(file.duration)),
    publishedAt: format(parseISO(published_at), 'd MMM yy', {
      locale: ptBR,
    }),
  };

  return {
    props: {
      episode,
    },
    revalidate: 60 * 60 * 24,
  };
};
