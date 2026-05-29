import styled from '@emotion/styled'
import { useEffect, useState } from 'react'
import { REDIRECT_URI } from './config'
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
    const hash = window.location.hash
    let token = window.localStorage.getItem('token') ?? ''
    const expiryTime = window.localStorage.getItem('expiryTime') ?? ''

    if (expiryTime && new Date().getTime() > Number(expiryTime)) {
      window.localStorage.removeItem('token')
      window.localStorage.removeItem('expiryTime')
      token = ''
    }

    if (!token && hash) {
      const accessTokenParam = hash
        .substring(1)
        .split('&')
        .find((param) => param.startsWith('access_token='))

      if (accessTokenParam) {
        token = accessTokenParam.split('=')[1]
        window.location.href = REDIRECT_URI
        window.localStorage.setItem('token', token)
        window.localStorage.setItem(
          'expiryTime',
          `${new Date().getTime() + 60 * 60 * 1000}`,
        )
      }
    }

    setAccessToken(token)
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
