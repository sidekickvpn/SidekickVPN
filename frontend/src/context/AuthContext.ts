import React from 'react';

export interface UserRegister {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
}

export interface AuthContextState {
  isAuthenticated: boolean;
  user: User | null;
  loginUser: (userData: UserLogin) => void;
  logoutUser: () => void;
  setCurrentUser: () => void;
}

const AuthContext = React.createContext<AuthContextState>({
  isAuthenticated: false,
  user: null,
  loginUser: () => {},
  logoutUser: () => {},
  setCurrentUser: () => {}
});

export default AuthContext;
