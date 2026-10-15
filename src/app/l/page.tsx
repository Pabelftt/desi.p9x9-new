import { Metadata } from 'next';
import { connectDB } from '@/lib/mongodb';
import Movie from '@/models/Movie';
import MovieCard from '@/components/MovieCard';
import Navbar from '@/components/Navbar';
import LoadMore from '@/components/LoadMore';
import { siteConfig } from '@/lib/site-config';

export const metadata: Metadata = {
  title: 'All Videos',
  description: siteConfig.description,
  keywords: siteConfig.keywords,
};

interface MovieCardData {
  id: string;
  hadding: string;
  img: string;
}

export default async function VideosPage() {
  await connectDB();
  const rawData = await Movie.find({}).lean();

  const data: MovieCardData[] = rawData.map((movie: any) => ({
    id: movie.id,
    hadding: movie.hadding,
    img: movie.img,
  }));

  for (let i = data.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [data[i], data[j]] = [data[j], data[i]];
  }

  return (
    <>
      <Navbar />
      <div className="grid">
        {data.map((movie, idx) => (
          <MovieCard key={movie.id} movie={movie} priority={idx === 0} />
        ))}
      </div>
      <LoadMore excludeId="" />
    </>
  );
}