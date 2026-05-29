import styled from '@emotion/styled'
import { useEffect, useMemo, useState } from 'react'
import type SpotifyWebApi from 'spotify-web-api-node'
import type { Artist, SortDirection, SortField, Track } from '../config'
import TrackRow from './TrackRow'

const CreatePlaylistButton = styled.button({
  color: '#a7a7a7',
  fontWeight: '600',
  marginLeft: '12px',
  padding: '0.25rem',
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  '&:hover': {
    transform: 'scale(1.04)',
    color: 'white',
  },
  '&:disabled': {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
})

const Spinner = styled.div({
  border: '4px solid #f3f3f3',
  borderTop: '4px solid #1DB954',
  borderRadius: '50%',
  width: '24px',
  height: '24px',
  marginLeft: '12px',
  animation: 'spin 1s linear infinite',
  '@keyframes spin': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' },
  },
})

const SortHeader = styled.div({
  display: 'flex',
  background: '#181818',
  padding: '16px',
  margin: '5px',
  borderRadius: '8px',
  alignItems: 'center',
  transition: 'background-color .3s ease',
  '&:hover': {
    cursor: 'pointer',
    background: '#282828',
  },
  '@media (max-width: 640px)': {
    '.release-date-column': {
      display: 'none',
    },
    '.sort-button': {
      display: 'none',
    },
  },
})

interface ArtistTracksProps {
  artist: Artist
  clearArtist: () => void
  spotifyApi: SpotifyWebApi
  accessToken: string
}

function dedupeTracks(tracks: Track[]): Track[] {
  return Array.from(new Map(tracks.map((track) => [track.id, track])).values())
}

export default function ArtistTracks({
  artist,
  clearArtist,
  spotifyApi,
  accessToken,
}: ArtistTracksProps) {
  const [tracks, setTracks] = useState<Track[]>([])
  const [creatingPlaylist, setCreatingPlaylist] = useState(false)
  const [sortField, setSortField] = useState<SortField | undefined>()
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [loading, setLoading] = useState(true)
  const [showToast, setShowToast] = useState(false)

  useEffect(() => {
    if (accessToken) {
      spotifyApi.setAccessToken(accessToken)
    }
  }, [accessToken, spotifyApi])

  useEffect(() => {
    if (!artist) {
      setTracks([])
      return
    }

    const fetchTracks = async () => {
      setLoading(true)
      let allTracks: Track[] = []
      setTracks([])

      let hasMoreAlbums = true
      let albumOffset = 0

      while (hasMoreAlbums) {
        try {
          const albumsResponse = await spotifyApi.getArtistAlbums(artist.id, {
            limit: 50,
            offset: albumOffset,
            include_groups: 'single,album,compilation',
          })

          albumOffset += 50

          const albums = albumsResponse.body.items.map((album) => {
            const smallestImage = album.images.reduce(
              (smallest, image) =>
                !image.height || !smallest.height || image.height < smallest.height
                  ? image
                  : smallest,
              album.images[0],
            )

            return {
              id: album.id,
              name: album.name,
              imgUrl: smallestImage?.url ?? '',
              releaseDate: album.release_date,
            }
          })

          for (const album of albums) {
            let hasMoreTracks = true
            let trackOffset = 0

            while (hasMoreTracks) {
              try {
                const tracksResponse = await spotifyApi.getAlbumTracks(album.id, {
                  limit: 50,
                  offset: trackOffset,
                })

                trackOffset += 50

                const albumTracks = tracksResponse.body.items
                  .map((track) => ({
                    id: track.id,
                    name: track.name,
                    imgUrl: album.imgUrl,
                    albumName: album.name,
                    releaseDate: album.releaseDate,
                    artistsIDs: track.artists.map((a) => a.id),
                    artistsNames: track.artists.map((a) => a.name).join(', '),
                  }))
                  .filter((track) => track.artistsIDs.includes(artist.id))

                allTracks = [...allTracks, ...albumTracks]
                setTracks(dedupeTracks(allTracks))

                if (!tracksResponse.body.next) {
                  hasMoreTracks = false
                }
              } catch (error) {
                console.error(error)
                hasMoreTracks = false
                setLoading(false)
                return
              }
            }
          }

          if (!albumsResponse.body.next) {
            hasMoreAlbums = false
          }
        } catch (error) {
          console.error(error)
          hasMoreAlbums = false
          setLoading(false)
          return
        }
      }

      setLoading(false)
    }

    fetchTracks()
  }, [artist, accessToken, spotifyApi])

  const sortedTracks = useMemo(() => {
    if (!sortField) {
      return tracks
    }

    const sorted = [...tracks]
    const multiplier = sortDirection === 'asc' ? 1 : -1

    if (sortField === 'track') {
      sorted.sort((a, b) => multiplier * a.name.localeCompare(b.name))
    } else if (sortField === 'album') {
      sorted.sort((a, b) => multiplier * a.albumName.localeCompare(b.albumName))
    } else if (sortField === 'releaseDate') {
      sorted.sort((a, b) => {
        const dateA = new Date(a.releaseDate).getTime()
        const dateB = new Date(b.releaseDate).getTime()
        return multiplier * (dateA - dateB)
      })
    }

    return sorted
  }, [tracks, sortField, sortDirection])

  const toggleSortDirection = () => {
    setSortDirection((direction) => (direction === 'asc' ? 'desc' : 'asc'))
  }

  const handleSortClick = (field: SortField) => {
    if (sortField === field) {
      toggleSortDirection()
    } else {
      setSortField(field)
    }
  }

  const sortIcon = (field: SortField) => {
    if (sortField !== field) {
      return '⇅'
    }
    return sortDirection === 'asc' ? '↑' : '↓'
  }

  const createPlaylist = async () => {
    if (!artist) {
      return
    }

    try {
      setCreatingPlaylist(true)

      const playlistResponse = await spotifyApi.createPlaylist(artist.name, {
        description: `${artist.name}'s full playlist`,
      })

      const playlistId = playlistResponse.body.id
      let hasMore = true
      let start = 0
      let end = 100

      while (hasMore) {
        if (end >= tracks.length) {
          hasMore = false
        }

        const uris = tracks.slice(start, end).map((track) => `spotify:track:${track.id}`)
        await spotifyApi.addTracksToPlaylist(playlistId, uris)

        start += 100
        end += 100
      }

      setCreatingPlaylist(false)
      setShowToast(true)
    } catch (error) {
      console.error(error)
      setCreatingPlaylist(false)
    }
  }

  useEffect(() => {
    if (showToast) {
      const timeout = setTimeout(() => setShowToast(false), 5000)
      return () => clearTimeout(timeout)
    }
  }, [showToast])

  return (
    <div className="w-full overflow-y-auto overflow-x-hidden px-5 pb-5">
      <div
        className="sticky top-0 flex items-center bg-black pb-5 text-white"
        style={{ background: '#121212' }}
      >
        <button
          onClick={() => clearArtist()}
          className="mr-4 rounded p-1 hover:bg-gray-700"
          aria-label="Back"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-4xl font-bold">{artist.name}</h1>
        {loading ? (
          <Spinner />
        ) : (
          !loading && (
            <CreatePlaylistButton
              onClick={createPlaylist}
              disabled={!tracks.length || creatingPlaylist}
            >
              Create Playlist
            </CreatePlaylistButton>
          )
        )}
      </div>

      {!loading && (
        <div className="pb-3">
          <h4>Total Tracks: {tracks.length}</h4>
        </div>
      )}

      {showToast && (
        <div
          style={{
            position: 'fixed',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#1DB954',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
            zIndex: 1000,
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            minWidth: '200px',
          }}
        >
          <span>Playlist created successfully!</span>
          <button
            onClick={() => setShowToast(false)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'white',
              fontSize: '16px',
              cursor: 'pointer',
            }}
            aria-label="Close toast"
          >
            x
          </button>
        </div>
      )}

      <SortHeader className="grid grid-cols-4 gap-4 p-3">
        <div className="flex w-44 min-w-0 flex-col justify-center sm:w-1/4">
          <p className="flex items-center overflow-hidden text-ellipsis whitespace-nowrap text-xs text-gray-400">
            Track
            <button
              className="sort-button ml-2 rounded bg-gray-700 px-1 py-0.5 text-xs text-white"
              onClick={() => handleSortClick('track')}
              aria-label="Sort by Track Name"
            >
              {sortIcon('track')}
            </button>
          </p>
        </div>
        <div className="flex min-w-0 flex-col justify-center sm:w-1/4">
          <p className="flex items-center overflow-hidden text-ellipsis whitespace-nowrap text-xs text-gray-400">
            Album
            <button
              className="sort-button ml-2 rounded bg-gray-700 px-1 py-0.5 text-xs text-white"
              onClick={() => handleSortClick('album')}
              aria-label="Sort by Album Name"
            >
              {sortIcon('album')}
            </button>
          </p>
        </div>
        <div className="release-date-column flex min-w-0 flex-col justify-center sm:w-1/4">
          <p className="flex items-center overflow-hidden text-ellipsis whitespace-nowrap text-xs text-gray-400">
            Release Date
            <button
              className="sort-button ml-2 rounded bg-gray-700 px-1 py-0.5 text-xs text-white"
              onClick={() => handleSortClick('releaseDate')}
              aria-label="Sort by Release Date"
            >
              {sortIcon('releaseDate')}
            </button>
          </p>
        </div>
      </SortHeader>

      {sortedTracks.map((track) => (
        <TrackRow key={track.id} track={track} />
      ))}
    </div>
  )
}
