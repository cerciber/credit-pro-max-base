import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import Cookies from 'js-cookie';
import { API_ROUTES } from '../config/routes';
import { api } from '../lib/api';
import { STATICS_CONFIG } from '../config/statics';
import { VerifyOutputResponse } from '@/src/modules/auth/schemas/verify-output-schema';
import { AuthOutputResponse } from '@/src/modules/auth/schemas/auth-output-schema';
import { UserCredentials } from '@/src/modules/auth/schemas/user-credentials-schema';
import { UserPayload } from '@/src/modules/auth/schemas/user-schema';
import { AppError } from '@/src/config/app-error';
import { VerifyInputBody } from '@/src/modules/auth/schemas/verify-input-schema';

interface AuthContextType {
  user: UserPayload | null;
  token: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new AppError<undefined>(
      'useAuth must be used within an AuthProvider',
      undefined
    );
  }
  return context;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserPayload | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const getTokenToVerify = (): string => {
    const token = Cookies.get(STATICS_CONFIG.cookies.authToken);
    if (!token) {
      throw new AppError<undefined>('Token not found', undefined);
    }
    return token;
  };

  const setTokenAndUser = (token: string, user: UserPayload): void => {
    setUser(user);
    setToken(token);
    Cookies.set(STATICS_CONFIG.cookies.authToken, token, {
      expires: 1,
    });
  };

  const removeTokenAndUser = (): void => {
    Cookies.remove(STATICS_CONFIG.cookies.authToken);
    setUser(null);
    setToken(null);
  };

  const getTokenFromUrlParam = (): string | null => {
    if (typeof window === 'undefined') return null;
    const url = new URL(window.location.href);
    return url.searchParams.get('token');
  };

  const removeTokenParamFromUrl = (): void => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    if (!url.searchParams.has('token')) return;
    url.searchParams.delete('token');
    window.history.replaceState(
      {},
      '',
      `${url.pathname}${url.search}${url.hash}`
    );
  };

  const apiAuthVerify = async (
    token?: string
  ): Promise<VerifyOutputResponse> => {
    return await api.post<VerifyInputBody, VerifyOutputResponse>(
      API_ROUTES.auth.verify,
      {},
      token
        ? {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        : undefined
    );
  };

  const verifyToken = useCallback(async (): Promise<void> => {
    try {
      const tokenFromUrlParam = getTokenFromUrlParam();
      const tokenToVerify = tokenFromUrlParam ?? getTokenToVerify();
      const result = await apiAuthVerify(tokenToVerify);
      setTokenAndUser(tokenToVerify, result.data.user);
      if (tokenFromUrlParam) {
        removeTokenParamFromUrl();
      }
    } catch {
      removeTokenAndUser();
    }
    setIsLoading(false);
  }, []);

  const apiAuthLogin = async (
    username: string,
    password: string
  ): Promise<AuthOutputResponse> => {
    return await api.post<UserCredentials, AuthOutputResponse>(
      API_ROUTES.auth.login,
      { username, password }
    );
  };

  const login = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    try {
      const result = await apiAuthLogin(username, password);
      const verifyResult = await apiAuthVerify(result.data.token);
      setTokenAndUser(result.data.token, verifyResult.data.user);
      return true;
    } catch {
      return false;
    }
  };

  const logout = (): void => {
    setUser(null);
    setToken(null);
    Cookies.remove(STATICS_CONFIG.cookies.authToken);
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    isLoading,
  };

  useEffect(() => {
    verifyToken();
  }, [verifyToken]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
