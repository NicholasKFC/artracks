import SpotifyWebApi from 'spotify-web-api-node'
import { CLIENT_ID } from './config'

export const spotifyApi = new SpotifyWebApi({ clientId: CLIENT_ID })
