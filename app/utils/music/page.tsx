import { Metadata } from 'next';
import Image from 'next/image';
import fs from 'fs';
import path from 'path';
import NodeID3 from 'node-id3';
import MusicPlayer from './MusicPlayer';

export const metadata: Metadata = {
  title: 'Music Player',
  description: 'Minimalistic Music Player',
};

type Track = {
  id: string;
  name: string;
  url: string;
  coverUrl?: string;
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
        .map((file, index) => {
          const filePath = path.join(albumPath, file.name);
          const tags = NodeID3.read(filePath);
          let coverUrl: string | undefined;
          
          if (tags.image && typeof tags.image !== 'string' && tags.image.imageBuffer) {
            coverUrl = `data:${tags.image.mime};base64,${tags.image.imageBuffer.toString('base64')}`;
          } else {
            const thumbnailPath = path.join(albumPath, 'thumbnail.jpeg');
            if (fs.existsSync(thumbnailPath)) {
              coverUrl = `/songs/${encodeURIComponent(albumName)}/thumbnail.jpeg`;
            }
          }

          return {
            id: `${albumName}-${index}`,
            name: file.name,
            url: `/songs/${encodeURIComponent(albumName)}/${encodeURIComponent(file.name)}`,
            coverUrl
          };
        });

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
      <MusicPlayer initialAlbums={albums} />
    </div>
  );
}
