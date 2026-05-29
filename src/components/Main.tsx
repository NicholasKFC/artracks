import styled from '@emotion/styled'
import { useEffect, useState } from 'react'
import type SpotifyWebApi from 'spotify-web-api-node'
import spotifyLogo from '../assets/spotify-logo.png'
import type { Artist } from '../config'
import ArtistSearch from './ArtistSearch'
import ArtistTracks from './ArtistTracks'

const Header = styled.div({
  display: 'flex',
  width: '100%',
  background: 'black',
  color: 'white',
  padding: '1.5rem',
  justifyContent: 'space-between',
})

const LogoutButton = styled.button({
  color: '#a7a7a7',
  fontWeight: '600',
  '&:hover': {
    transform: 'scale(1.04)',
    color: 'white',
  },
})

const Content = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  margin: '10px',
  borderRadius: '8px',
  color: 'white',
  background: '#121212',
  flex: 1,
  overflow: 'hidden',
})

const SearchInput = styled.input({
  margin: '1rem',
  borderRadius: '500px',
  background: '#242424',
  color: 'white',
  border: 'none',
  '&:hover': {
    outline: '1px solid white',
  },
  '&:focus': {
    outline: '2px solid white',
  },
})

interface MainProps {
  spotifyApi: SpotifyWebApi
  accessToken: string
  logout: () => void
}

export default function Main({ spotifyApi, accessToken, logout }: MainProps) {
  const [search, setSearch] = useState('')
  const [selectedArtist, setSelectedArtist] = useState<Artist | undefined>()

  useEffect(() => {
    if (accessToken) {
      spotifyApi.setAccessToken(accessToken)
    }
  }, [accessToken, spotifyApi])

  const chooseArtist = (artist: Artist) => {
    setSearch('')
    setSelectedArtist(artist)
  }

  const clearArtist = () => {
    setSearch('')
    setSelectedArtist(undefined)
  }

  return (
    <div className="flex w-full flex-1 flex-col overflow-hidden">
      <Header>
        <div
          className="flex cursor-pointer justify-center"
          onClick={() => setSelectedArtist(undefined)}
        >
          <img
            className="mr-3 hidden h-10 w-10 sm:block"
            src={spotifyLogo}
            alt="Spotify logo"
          />
          <p className="text-2xl font-bold">Artracks</p>
        </div>
        <LogoutButton className="text-sm sm:text-base" onClick={logout}>
          Logout
        </LogoutButton>
      </Header>
      <Content>
        <div>
          <SearchInput
            className="px-4 py-2 sm:px-8 sm:py-4"
            type="text"
            placeholder="Search for an artist..."
            value={search}
            onChange={(event) => {
              setSearch(event.target.value)
              setSelectedArtist(undefined)
            }}
          />
        </div>
        {selectedArtist ? (
          <ArtistTracks
            artist={selectedArtist}
            clearArtist={clearArtist}
            spotifyApi={spotifyApi}
            accessToken={accessToken}
          />
        ) : (
          <ArtistSearch
            search={search}
            spotifyApi={spotifyApi}
            accessToken={accessToken}
            chooseArtist={chooseArtist}
          />
        )}
      </Content>
    </div>
  )
}
