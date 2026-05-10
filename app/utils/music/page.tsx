import { Metadata } from 'next';
import fs from 'fs';
import path from 'path';
import NodeID3 from 'node-id3';
import MusicPlayer from './MusicPlayer';

export const metadata: Metadata = {
  title: 'Music Player',
  description: 'Minimalistic Music Player',
  manifest: "/manifests/music.webmanifest",
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

function getMusic(): Album[] {
  const songsDir = path.join(process.cwd(), 'public', 'songs');
  const remoteJsonPath = path.join(process.cwd(), 'app', 'utils', 'music', 'remote-songs.json');
  const albumsMap = new Map<string, Track[]>();

  if (fs.existsSync(songsDir)) {
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
              const songNameWithoutExt = file.name.replace(/\.mp3$/i, '');
              const songImagePath = path.join(albumPath, `${songNameWithoutExt}.jpeg`);
              const thumbnailPath = path.join(albumPath, 'thumbnail.jpeg');
              
              if (fs.existsSync(songImagePath)) {
                coverUrl = `/songs/${encodeURIComponent(albumName)}/${encodeURIComponent(`${songNameWithoutExt}.jpeg`)}`;
              } else if (fs.existsSync(thumbnailPath)) {
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
          albumsMap.set(albumName, tracks);
        }
      }
    }
  }

  const localAlbumNames = new Set(albumsMap.keys());

  if (fs.existsSync(remoteJsonPath)) {
    try {
      const remoteData = JSON.parse(fs.readFileSync(remoteJsonPath, 'utf8'));
      if (Array.isArray(remoteData)) {
        for (const remoteAlbum of remoteData) {
          const albumName = remoteAlbum.folder;
          const albumPath = path.join(songsDir, albumName);
          
          if (Array.isArray(remoteAlbum.songs)) {
            const remoteTracks: Track[] = remoteAlbum.songs.map((song: { name: string; url: string }, index: number) => {
              let coverUrl: string | undefined;
              const songNameWithoutExt = song.name.replace(/\.mp3$/i, '');
              
              const songImagePath = path.join(albumPath, `${songNameWithoutExt}.jpeg`);
              const thumbnailPath = path.join(albumPath, 'thumbnail.jpeg');
              
              if (fs.existsSync(songImagePath)) {
                coverUrl = `/songs/${encodeURIComponent(albumName)}/${encodeURIComponent(`${songNameWithoutExt}.jpeg`)}`;
              } else if (fs.existsSync(thumbnailPath)) {
                coverUrl = `/songs/${encodeURIComponent(albumName)}/thumbnail.jpeg`;
              }

              return {
                id: `remote-${albumName}-${index}`,
                name: song.name,
                url: song.url,
                coverUrl
              };
            });

            if (remoteTracks.length > 0) {
              if (albumsMap.has(albumName)) {
                albumsMap.set(albumName, [...albumsMap.get(albumName)!, ...remoteTracks]);
              } else {
                albumsMap.set(albumName, remoteTracks);
              }
            }
          }
        }
      }
    } catch (e) {
      console.error('Failed to parse remote-songs.json', e);
    }
  }

  const albums: Album[] = Array.from(albumsMap.entries()).map(([albumName, tracks]) => ({
    id: albumName,
    name: albumName,
    tracks
  }));

  albums.sort((a, b) => {
    const aIsLocal = localAlbumNames.has(a.name);
    const bIsLocal = localAlbumNames.has(b.name);
    if (aIsLocal && !bIsLocal) return -1;
    if (!aIsLocal && bIsLocal) return 1;
    return a.name.localeCompare(b.name);
  });

  return albums;
}

export default function MusicPage() {
  const albums = getMusic();

  return (
    <div className="min-h-screen bg-transparent text-gray-900 dark:text-gray-100 p-4 md:p-8 flex flex-col">
      <MusicPlayer initialAlbums={albums} />
    </div>
  );
}
