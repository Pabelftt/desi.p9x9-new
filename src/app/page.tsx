import { Metadata } from 'next';
import { connectDB } from '@/lib/mongodb';
import Movie from '@/models/Movie';
import { getCountDoc } from '@/lib/count';
import Navbar from '@/components/Navbar';
import MovieCard from '@/components/MovieCard';
import LoadMore from '@/components/LoadMore';
import { siteConfig } from '@/lib/site-config';
import Link from 'next/link';

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    url: siteConfig.url,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
};

interface MovieCardData {
  id: string;
  hadding: string;
  img: string;
}

interface LatestData {
  id: string;
  hadding: string;
}

interface HomePageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const { q } = await searchParams;
  const query = q || '';

  await connectDB();

  let rawData;
  if (query) {
    rawData = await Movie.find({ $text: { $search: query } }, { score: { $meta: 'textScore' } })
      .sort({ score: { $meta: 'textScore' } })
      .lean();
    if (!rawData.length) {
      rawData = await Movie.find({ hadding: { $regex: query.split(' ')[0], $options: 'i' } }).lean();
    }
  } else {
    rawData = await Movie.find({}).lean();
  }

  const data: MovieCardData[] = rawData.map((movie: any) => ({
    id: movie.id,
    hadding: movie.hadding,
    img: movie.img,
  }));

  for (let i = data.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [data[i], data[j]] = [data[j], data[i]];
  }

  const latestRaw = await Movie.find({}).sort({ _id: -1 }).limit(5).select('id hadding').lean();
  const latest: LatestData[] = latestRaw.map((movie: any) => ({
    id: movie.id,
    hadding: movie.hadding,
  }));

  const { randomData, randomCount } = await getCountDoc();

  return (
    <>
      <Navbar query={query} />

      {query && (
        <div className="search-box">
          <div className="search-result" role="status">
            <i className="fa-solid fa-magnifying-glass" aria-hidden="true" />
            <span>Search result for: "{query}"</span>
          </div>
        </div>
      )}

      <div className="latest">
        <div className="latest-title">
          <i className="fa-solid fa-fire" aria-hidden="true" />
          Latest Additions
        </div>
        <div className="latest-grid">
          {latest.map((item) => (
            <Link key={item.id} href={`/movie/${item.id}`}>
              <i className="fa-solid fa-play" aria-hidden="true" />
              {item.hadding}
            </Link>
          ))}
        </div>
      </div>

      <div className="grid">
        {data.map((movie, idx) => (
          <MovieCard key={movie.id} movie={movie} priority={idx === 0} />
        ))}
      </div>

      <LoadMore excludeId="" />
    </>
  );
}