import styled from '@emotion/styled'
import { useEffect, useState } from 'react'
import { exchangeCodeForToken } from './auth'
import { spotifyApi } from './spotify'
import LoginPage from './components/LoginPage'
import Main from './components/Main'

const AppContainer = styled.div({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  width: '100%',
  background: 'linear-gradient(#888 0%, #000 100%)',
  overflow: 'hidden',
})

export default function App() {
  const [accessToken, setAccessToken] = useState('')

  const logout = () => {
    window.localStorage.removeItem('token')
    window.localStorage.removeItem('expiryTime')
    setAccessToken('')
  }

  useEffect(() => {
    const initAuth = async () => {
      let token = window.localStorage.getItem('token') ?? ''
      const expiryTime = window.localStorage.getItem('expiryTime') ?? ''

      if (expiryTime && Date.now() > Number(expiryTime)) {
        window.localStorage.removeItem('token')
        window.localStorage.removeItem('expiryTime')
        token = ''
      }

      if (!token) {
        const code = new URLSearchParams(window.location.search).get('code')
        if (code) {
          try {
            const data = await exchangeCodeForToken(code)
            token = data.access_token
            window.localStorage.setItem('token', token)
            window.localStorage.setItem(
              'expiryTime',
              `${Date.now() + data.expires_in * 1000}`,
            )
            window.history.replaceState({}, document.title, window.location.pathname)
          } catch (error) {
            console.error(error)
          }
        }
      }

      setAccessToken(token)
    }

    initAuth()
  }, [])

  return (
    <AppContainer>
      {accessToken ? (
        <Main spotifyApi={spotifyApi} accessToken={accessToken} logout={logout} />
      ) : (
        <LoginPage />
      )}
    </AppContainer>
  )
}
