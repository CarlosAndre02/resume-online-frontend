import {
  useState, createContext, ReactNode, useEffect,
} from 'react';
import axios from '../services/axios';

type User = {
  id: number;
  username: string;
  token: string;
}

type AuthContextProviderProps = {
  children: ReactNode;
}

type AuthContextType = {
  user: User | null
  logInUser: (userPayload: User) => void
  logOutUser: () => void
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userPayloadJson = localStorage.getItem('user');
    if (userPayloadJson) {
      const userPayload = JSON.parse(userPayloadJson);
      setUser(userPayload);
      axios.defaults.headers.common.Authorization = `Bearer ${userPayload.token}`;
    }
  }, []);

  const logInUser = (userPayload: User) => {
    localStorage.setItem('user', JSON.stringify(userPayload));
    axios.defaults.headers.common.Authorization = `Bearer ${userPayload.token}`;
    setUser(userPayload);
  };

  const logOutUser = () => {
    localStorage.removeItem('user');
    axios.defaults.headers.common.Authorization = '';
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, logInUser, logOutUser }}>
      { children }
    </AuthContext.Provider>
  );
}
