import styled from '@emotion/styled'
import type { Artist } from '../config'

const Card = styled.div({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  background: '#181818',
  padding: '16px',
  borderRadius: '8px',
  transition: 'background-color .3s ease',
  '&:hover': {
    cursor: 'pointer',
    background: '#282828',
  },
})

const RankBadge = styled.div({
  position: 'absolute',
  top: '8px',
  left: '8px',
  backgroundColor: '#1DB954',
  color: 'white',
  borderRadius: '50%',
  width: '24px',
  height: '24px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 'bold',
  fontSize: '0.75rem',
  userSelect: 'none',
})

interface ArtistCardProps {
  artist: Artist
  chooseArtist: (artist: Artist) => void
  rank?: number
}

export default function ArtistCard({ artist, chooseArtist, rank }: ArtistCardProps) {
  return (
    <Card onClick={() => chooseArtist(artist)}>
      {rank !== undefined && <RankBadge>{rank}</RankBadge>}
      <div className="mb-4 flex justify-center overflow-hidden">
        <div
          className="flex h-40 w-40 items-center justify-center rounded-full"
          style={{ background: '#333333' }}
        >
          {artist.imgUrl === '' ? (
            <svg
              viewBox="0 0 24 24"
              fill="#B3B3B3"
              className="h-16 w-16"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          ) : (
            <img
              src={artist.imgUrl}
              alt={artist.name}
              className="h-40 w-40 rounded-full object-cover"
            />
          )}
        </div>
      </div>
      <p className="overflow-hidden text-ellipsis whitespace-nowrap font-bold">
        {artist.name}
      </p>
      <p className="overflow-hidden text-ellipsis whitespace-nowrap text-xs text-gray-300">
        {artist.followers} followers
      </p>
      <p className="overflow-hidden text-ellipsis whitespace-nowrap text-xs text-gray-400">
        {artist.popularity} popularity
      </p>
    </Card>
  )
}
