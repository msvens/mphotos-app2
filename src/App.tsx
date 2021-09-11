import React from 'react';
import './App.css';
import {Guest, User, UXConfig} from "./api/types";
import PhotosApi from "./api/photoapi";
import {useGuest} from "./hooks/useGuest";
import {useUser} from "./hooks/useUser";
import {useUXConfig} from "./hooks/useUXConfig";
import {createTheme, CssBaseline, responsiveFontSizes, ThemeProvider} from "@material-ui/core";
import MPhotos from "./MPhotos";

interface IMPContext {
  isGuest: boolean
  guest: Guest
  isGuestLoading: boolean
  checkGuest: () => void
  isUser: boolean
  user: User
  checkUser: () => void
  uxConfig: UXConfig
  checkUXConfig: () => void
}

const dummyContext: IMPContext = {
  isGuest: false,
  isGuestLoading: false,
  guest: {
    name: "",
    email: ""
  },
  checkGuest: () => {
    alert("dummy")
  },
  isUser: false,
  user: {
    name: "",
    bio: "",
    pic: ""
  },
  checkUser: () => {
    alert("dummy")
  },
  uxConfig: PhotosApi.defaultUxConfig,
  checkUXConfig: () => {
    alert("dummy")
  }
}

export const MPContext = React.createContext<IMPContext>(dummyContext)



function App() {

  const [isGuest, guest, checkGuest] = useGuest()
  const [isUser, user, checkUser] = useUser()
  const [uxConfig, checkUXConfig] = useUXConfig()

  const defaultContext: IMPContext = {
    isGuest: isGuest,
    guest: guest,
    isGuestLoading: false,
    checkGuest: checkGuest,
    isUser: isUser,
    user: user,
    checkUser: checkUser,
    uxConfig: uxConfig,
    checkUXConfig: checkUXConfig
  }

  let theme = React.useMemo(
      () => createTheme({
        palette: {
          mode: uxConfig.colorTheme === 'dark' ? 'dark' : 'light'
        },
        typography: {
          body1: {
            lineHeight: '1.5em',
          },
          body2: {
            lineHeight: '1.3em',
          },
          h4: {
            marginTop: '2em',
            textTransform: 'uppercase',
          },
          h5: {
            marginTop: '2em',
            textTransform: 'uppercase',
          },
          h6: {
            fontWeight: 'normal'
          }
        },
      }), [uxConfig.colorTheme])

  theme = responsiveFontSizes(theme)

  return (
      <ThemeProvider theme={theme}>
        <CssBaseline/>
        <MPContext.Provider value={defaultContext}>
          <MPhotos/>
        </MPContext.Provider>
      </ThemeProvider>
  );
}

export default App;
