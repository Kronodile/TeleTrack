// frontend/TeleTrack/src/contexts/ApiContext.jsx
import { createContext, useContext } from 'react';
import * as services from '../services/api';

const ApiContext = createContext(null);

export function ApiProvider({ children }) {
  return (
    <ApiContext.Provider value={services}>
      {children}
    </ApiContext.Provider>
  );
}

export const useApi = () => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
};