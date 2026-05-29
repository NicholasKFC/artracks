export const CLIENT_ID = '5795051f0e63428d98c10f833e872697'
export const REDIRECT_URI = 'https://nicholaskfc.github.io/artracks/'
export const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent('playlist-modify-public user-top-read')}&response_type=token`

export interface Artist {
  id: string
  name: string
  followers: number
  popularity: number
  imgUrl: string
}

export interface Track {
  id: string
  name: string
  imgUrl: string
  albumName: string
  releaseDate: string
  artistsIDs: string[]
  artistsNames: string
}

export type SortField = 'track' | 'album' | 'releaseDate'
export type SortDirection = 'asc' | 'desc'
