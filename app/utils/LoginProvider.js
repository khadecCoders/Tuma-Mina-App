import React, { createContext, useContext, useState } from 'react'

const LoginContext = createContext()

const LoginProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [profile, setProfile] = useState({});
    const [locationData, setLocationData] = useState({});
    const [user_Id, setUserId] = useState('');
    const [ready, setReady] = useState(false);
    const [loadingSignIn, setLoadingSignIn] = useState(false);
    const [isInternetReachable, setIsInternetReachable] = useState(false);
    const [ viewedOnBoarding, setViewedOnBoarding ] = useState(false);
    const [location, setLocation] = useState({});

  return (
    <LoginContext.Provider value={{
      isLoggedIn, setIsLoggedIn, 
      profile, setProfile, 
      user_Id, setUserId, 
      ready, setReady, 
      locationData, setLocationData, 
      location, setLocation,
      loadingSignIn, setLoadingSignIn,
      isInternetReachable, setIsInternetReachable,
      viewedOnBoarding, setViewedOnBoarding

      }}>
    {children}
    </LoginContext.Provider>
  ) 
}

export const useLogin = () => useContext(LoginContext);

export default LoginProvider;