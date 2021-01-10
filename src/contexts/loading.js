import React, { useState } from 'react';

export const LoadingContext = React.createContext({
  loading: false,

  setLoading: () => {},
})

export const LoadingProvider = ({ children }) => {
  const [loadingState, setLoadingState] = useState({
    loading: false,
  })

  const setLoading = loadingData => {
    setLoadingState({ ...loadingState, ...loadingData })
  }
  
  return (
    <LoadingContext.Provider
      value={{
        ...loadingState,
        setLoading
      }}
    >
      {children}
    </LoadingContext.Provider>
  )
}