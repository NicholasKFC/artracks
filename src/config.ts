export const CLIENT_ID = '5795051f0e63428d98c10f833e872697'

export function getRedirectUri(): string {
  if (window.location.hostname === '127.0.0.1') {
    // Must match Spotify dashboard exactly (no trailing slash).
    return window.location.origin
  }

  // Production GitHub Pages URL including base path.
  return new URL(import.meta.env.BASE_URL, window.location.origin).href
}

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
