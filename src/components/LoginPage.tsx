import styled from '@emotion/styled'
import { getAuthUrl } from '../auth'

const LoginCard = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '8px',
  color: 'white',
  padding: '8rem 3rem',
  background: '#121212',
})

const LoginLink = styled.a({
  textTransform: 'none',
  padding: '12px 25px',
  marginTop: '30px',
  textDecoration: 'none',
  outline: '1px solid #DFDEE4',
  borderRadius: '10px',
  color: 'white',
  '&:hover': {
    outline: '1px solid #15D75F',
  },
})

export default function LoginPage() {
  const handleLogin = async () => {
    window.location.href = await getAuthUrl()
  }

  return (
    <div className="flex w-full flex-1 flex-col items-center justify-center">
      <LoginCard>
        <h1 className="text-4xl font-bold">Artracks</h1>
        <LoginLink as="button" type="button" onClick={handleLogin}>
          <div className="flex items-center">
            <div className="mr-3 h-6 w-6">
              <svg
                style={{ color: '#15D75F' }}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 496 512"
              >
                <path
                  fill="currentColor"
                  d="M248 8C111.1 8 0 119.1 0 256s111.1 248 248 248 248-111.1 248-248S384.9 8 248 8zm100.7 364.9c-4.2 0-6.8-1.3-10.7-3.6-62.4-37.6-135-39.2-206.7-24.5-3.9 1-9 2.6-11.9 2.6-9.7 0-15.8-7.7-15.8-15.8 0-10.3 6.1-15.2 13.6-16.8 81.9-18.1 165.6-16.5 237 26.2 6.1 3.9 9.7 7.4 9.7 16.5s-7.1 15.4-15.2 15.4zm26.9-65.6c-5.2 0-8.7-2.3-12.3-4.2-62.5-37-155.7-51.9-238.6-29.4-4.8 1.3-7.4 2.6-7.4 5.8 0 2.9 2.2 4.8 5 5.8 73.2 18.2 153.3 10.9 223.8-26.9 2.5-1.2 5-1.8 7.2-1.8 3.2.1 6.4 1.9 6.4 5.9zm62.7-13.8c-.1-3.2-2.5-5.8-6-5.8-1.9 0-3.7.7-5.2 1.6C241.1 397.4 159.7 420.7 74.9 403.1c-3.1-.8-6.1-1.4-8.9-1.9-3-0.5-5.7 1.7-5.7 4.7 0 2.9 2.2 4.7 5 5.5 88.2 20.2 175.6 16.2 254.8-11.6 2.5-.9 4.9-1.7 7.1-1.7 3.5 0 6.1 2.7 6.2 5.8zm-18.5 66.8c-3.2 0-6.2-1.6-7.9-4.3-61.2-98-159.7-151.6-279.1-133.1-3.3 0.5-6.4 1.9-6.4 5.6 0 3.1 2.1 4.9 5 5.4 127.6 18.6 220.6 67.3 286.1 172.7 1.5 2.4 3.9 4.1 6.6 4.1 3.4 0 6.2-2.8 6.2-6.2-.1-3.2-2.7-5.7-6.5-6.1z"
                />
              </svg>
            </div>
            <div>Sign in with Spotify</div>
          </div>
        </LoginLink>
      </LoginCard>
    </div>
  )
}
