import { Metadata } from 'next';
import { connectDB } from '@/lib/mongodb';
import Movie from '@/models/Movie';
import { getCountDoc } from '@/lib/count';
import VideoPlayer from '@/components/VideoPlayer';
import SuggestedCard from '@/components/SuggestedCard';
import LoadMore from '@/components/LoadMore';
import { siteConfig } from '@/lib/site-config';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface MoviePageProps {
  params: Promise<{ id: string }>;
}

interface MovieData {
  id: string;
  hadding: string;
  img: string;
  play: string;
}

export async function generateMetadata({ params }: MoviePageProps): Promise<Metadata> {
  const { id } = await params;
  await connectDB();
  const movie = (await Movie.findOne({ id }).lean()) as MovieData | null;

  if (!movie) {
    return { title: 'Not Found' };
  }

  const pageUrl = `${siteConfig.url}/movie/${id}`;

  return {
    title: movie.hadding,
    description: movie.hadding,
    openGraph: {
      title: movie.hadding,
      description: movie.hadding,
      images: [movie.img],
      url: pageUrl,
      type: 'video.other',
    },
    twitter: {
      card: 'player',
      title: movie.hadding,
      description: movie.hadding,
      images: [movie.img],
    },
  };
}

export default async function MoviePage({ params }: MoviePageProps) {
  const { id } = await params;

  await connectDB();

  const data = (await Movie.findOne({ id }).lean()) as MovieData | null;
  if (!data) {
    notFound();
  }

  const suggested = (await Movie.aggregate([
    { $match: { id: { $ne: id } } },
    { $sample: { size: 8 } },
  ])) as MovieData[];

  const { randomData, randomCount } = await getCountDoc();

  const dateArray = ['2025-11-22', '2025-11-23', '2025-11-24', '2025-10-22', '2025-11-20'];
  const date = dateArray[(parseInt(id) - 1) % dateArray.length];

  return (
    <>
      <div className="wrap">
        <h1>
          <i className="fa-solid fa-video" aria-hidden="true" />
          {data.hadding}
        </h1>

        <VideoPlayer
          src={data.play}
          poster={data.img}
          title={data.hadding}
          description="ভিডিও তে ক্লিক করার পর অন্য কোনো জায়গায় নিয়ে গেলে ফিরে আসে আবার ক্লিক করলে ভিডিও চলবে"
          videoId={data.id}
          redirectUrl={siteConfig.smartLink}
        />

        <div className="actions">
          <a
            className="btn"
            href={siteConfig.smartLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fa-solid fa-download" aria-hidden="true" />
            Download Video
          </a>
        </div>
      </div>

      <hr style={{ margin: '20px 0', border: 0, borderTop: '1px solid var(--border)' }} />

      <div className="wrap">
        <h2 className="section-title">
          <i className="fa-solid fa-arrows-rotate" aria-hidden="true" />
          Suggested Videos
        </h2>

        <div className="suggest-grid" id="suggestGrid">
          {suggested.map((item) => (
            <SuggestedCard key={item.id} item={item} />
          ))}
        </div>

        <LoadMore excludeId={id} />

        <div className="otherWebsite">
          <h2 className="section-title" style={{ justifyContent: 'center' }}>
            <i className="fa-solid fa-globe" aria-hidden="true" />
            Other Website
          </h2>
          <a href={siteConfig.moreWebsite} className="btn btn-tw" target="_blank" rel="noopener noreferrer">
            <i className="fa-solid fa-globe" aria-hidden="true" />
            P9X9.COM
          </a>
          <a href={siteConfig.telegramLink} className="btn btn-tg" target="_blank" rel="noopener noreferrer">
            <i className="fa-brands fa-telegram" aria-hidden="true" />
            Telegram
          </a>
        </div>
      </div>

      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              var skip = 8;
              var excludeId = "${id}";
              var grid = document.getElementById("suggestGrid");
              var btn = document.getElementById("loadMore");

              if (!grid || !btn) return;

              window.addEventListener('load-more-data', function(e: any) {
                var data = e.detail;
                if (!data || !data.length) {
                  btn.innerHTML = '<span>No more videos</span>';
                  btn.disabled = true;
                  return;
                }

                data.forEach(function(item) {
                  var rating = (Math.random() * 2 + 8).toFixed(1);
                  var a = document.createElement("a");
                  a.href = '/movie/' + item.id;
                  a.className = 's-card';
                  a.innerHTML =
                    '<div class="rating"><i class="fa-solid fa-star" aria-hidden="true"></i>' + rating + '</div>' +
                    '<img src="' + item.img + '" loading="lazy" decoding="async" alt="' + item.hadding + '">' +
                    '<p>' + item.hadding + '</p>';
                  grid.appendChild(a);
                });

                skip += 8;
                btn.innerHTML = '<span>See More</span><i class="fa-solid fa-chevron-down"></i>';
                btn.disabled = false;
              });
            })();
          `,
        }}
      />
    </>
  );
}