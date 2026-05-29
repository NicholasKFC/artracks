import styled from '@emotion/styled'
import type { Track } from '../config'

const Row = styled.div({
  display: 'flex',
  background: '#181818',
  borderRadius: '8px',
  transition: 'background-color .3s ease',
  padding: '16px',
  margin: '5px',
  gap: '16px',
  alignItems: 'center',
  '&:hover': {
    cursor: 'pointer',
    background: '#282828',
  },
  '@media (max-width: 640px)': {
    '.release-date-column': {
      display: 'none',
    },
  },
})

interface TrackRowProps {
  track: Track
}

export default function TrackRow({ track }: TrackRowProps) {
  return (
    <Row className="grid grid-cols-4 gap-4 p-3">
      <div className="flex w-44 min-w-0 items-center sm:w-1/4">
        <div className="mr-3 flex h-10 w-10 flex-none items-center justify-center rounded-lg">
          <img
            src={track.imgUrl}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            alt="no-img"
            className="rounded-lg"
          />
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-center sm:w-1/4">
          <p className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-sm">
            {track.name}
          </p>
          <p className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-xs text-gray-400">
            {track.artistsNames}
          </p>
        </div>
      </div>
      <div className="flex min-w-0 flex-col justify-center sm:w-1/4">
        <p className="overflow-hidden text-ellipsis whitespace-nowrap text-xs text-gray-400">
          {track.albumName}
        </p>
      </div>
      <div className="release-date-column flex min-w-0 flex-col justify-center">
        <p className="overflow-hidden text-ellipsis whitespace-nowrap text-xs text-gray-400">
          {track.releaseDate}
        </p>
      </div>
    </Row>
  )
}
