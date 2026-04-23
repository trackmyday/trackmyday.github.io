import { Metadata } from 'next';
import fs from 'fs';
import path from 'path';
import MusicPlayer from './MusicPlayer';

export const metadata: Metadata = {
  title: 'Local Music Player | TrackMyDay',
  description: 'Minimalistic Local Music Player',
};

type Track = {
  id: string;
  name: string;
  url: string;
};

type Album = {
  id: string;
  name: string;
  tracks: Track[];
};

function getLocalMusic(): Album[] {
  const songsDir = path.join(process.cwd(), 'public', 'songs');
  
  if (!fs.existsSync(songsDir)) {
    return [];
  }

  const albums: Album[] = [];
  const folders = fs.readdirSync(songsDir, { withFileTypes: true });

  for (const folder of folders) {
    if (folder.isDirectory()) {
      const albumName = folder.name;
      const albumPath = path.join(songsDir, albumName);
      const files = fs.readdirSync(albumPath, { withFileTypes: true });
      
      const tracks: Track[] = files
        .filter(file => file.isFile() && file.name.toLowerCase().endsWith('.mp3'))
        .map((file, index) => ({
          id: `${albumName}-${index}`,
          name: file.name,
          url: `/songs/${encodeURIComponent(albumName)}/${encodeURIComponent(file.name)}`
        }));

      if (tracks.length > 0) {
        albums.push({
          id: albumName,
          name: albumName,
          tracks
        });
      }
    }
  }

  return albums;
}

export default function MusicPage() {
  const albums = getLocalMusic();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-gray-100 p-4 md:p-8 flex flex-col">
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Music Player</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Play local music from your library</p>
      </header>
      <main className="flex-grow flex flex-col relative bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-800 overflow-hidden">
        <MusicPlayer initialAlbums={albums} />
      </main>
    </div>
  );
}
