import { useEffect, useState } from 'react'
import type SpotifyWebApi from 'spotify-web-api-node'
import type { Artist } from '../config'
import ArtistCard from './ArtistCard'

interface ArtistSearchProps {
  search: string
  spotifyApi: SpotifyWebApi
  accessToken: string
  chooseArtist: (artist: Artist) => void
}

export default function ArtistSearch({
  search,
  spotifyApi,
  accessToken,
  chooseArtist,
}: ArtistSearchProps) {
  const [artists, setArtists] = useState<Artist[]>([])
  const [limit, setLimit] = useState(15)
  const [timeRange, setTimeRange] = useState<
    'short_term' | 'medium_term' | 'long_term'
  >('medium_term')

  useEffect(() => {
    if (accessToken) {
      spotifyApi.setAccessToken(accessToken)
    }
  }, [accessToken, spotifyApi])

  useEffect(() => {
    const fetchTopArtists = async () => {
      try {
        const response = await spotifyApi.getMyTopArtists({
          limit,
          time_range: timeRange,
        })

        if (!response.body?.items) {
          setArtists([])
          return
        }

        const mapped = response.body.items.map((artist) => ({
          id: artist.id,
          name: artist.name,
          followers: artist.followers?.total ?? 0,
          popularity: artist.popularity ?? 0,
          imgUrl: artist.images[0]?.url ?? '',
        }))

        setArtists(mapped)
      } catch (error) {
        console.error(error)
        setArtists([])
      }
    }

    const fetchSearchResults = async () => {
      try {
        const response = await spotifyApi.searchArtists(search)

        if (!response.body?.artists?.items) {
          setArtists([])
          return
        }

        const mapped = response.body.artists.items.map((artist) => ({
          id: artist.id,
          name: artist.name,
          followers: artist.followers?.total ?? 0,
          popularity: artist.popularity ?? 0,
          imgUrl: artist.images[0]?.url ?? '',
        }))

        setArtists(mapped)
      } catch (error) {
        console.error(error)
        setArtists([])
      }
    }

    if (!search) {
      fetchTopArtists()
      return
    }

    fetchSearchResults()
  }, [search, limit, timeRange, spotifyApi])

  return (
    <div className="w-full overflow-y-auto overflow-x-hidden p-5">
      <h1 className="mb-1 text-3xl font-bold">
        {search ? `Searching for: ${search}` : 'Your Top Artists'}
      </h1>
      <div className="mb-4 flex flex-wrap gap-4">
        <div>
          <label htmlFor="limit" className="mr-2 font-semibold">
            Number of Artists:
          </label>
          <select
            id="limit"
            value={limit}
            onChange={(event) => setLimit(Number(event.target.value))}
            className="bg-transparent px-1 py-0.5 text-white focus:border-white focus:outline-none"
            style={{ backgroundColor: '#121212', borderRadius: '4px' }}
          >
            <option className="bg-[#121212] text-white" value={15}>
              15
            </option>
            <option className="bg-[#121212] text-white" value={30}>
              30
            </option>
            <option className="bg-[#121212] text-white" value={50}>
              50
            </option>
          </select>
        </div>
        <div>
          <label htmlFor="timeRange" className="mr-2 font-semibold">
            Time Range:
          </label>
          <select
            id="timeRange"
            value={timeRange}
            onChange={(event) =>
              setTimeRange(
                event.target.value as 'short_term' | 'medium_term' | 'long_term',
              )
            }
            className="bg-transparent px-1 py-0.5 text-white focus:border-white focus:outline-none"
            style={{ backgroundColor: '#121212', borderRadius: '4px' }}
          >
            <option
              className="bg-[#121212] text-white"
              value="short_term"
              title="Approximately last 4 weeks"
            >
              Last 4 weeks
            </option>
            <option
              className="bg-[#121212] text-white"
              value="medium_term"
              title="Approximately last 6 months"
            >
              Last 6 months
            </option>
            <option
              className="bg-[#121212] text-white"
              value="long_term"
              title="Approximately last 1 year"
            >
              Last 12 months
            </option>
          </select>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {artists.map((artist, index) => (
          <ArtistCard
            key={artist.id}
            artist={artist}
            chooseArtist={chooseArtist}
            rank={search ? undefined : index + 1}
          />
        ))}
      </div>
    </div>
  )
}
