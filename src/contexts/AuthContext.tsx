/** AuthContext — sessão do usuário. O RootNavigator troca Auth ↔ App a partir daqui. */
import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { User } from '../types';
import * as auth from '../services/authService';

export interface AuthContextValue {
  user: User | null;
  /** true enquanto a sessão salva ainda está sendo restaurada. */
  restoring: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [restoring, setRestoring] = useState(true);

  useEffect(() => {
    auth
      .getSession()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setRestoring(false));
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    setUser(await auth.signIn(email, password));
  }, []);

  const signUp = useCallback(async (name: string, email: string, password: string) => {
    setUser(await auth.signUp(name, email, password));
  }, []);

  const signOut = useCallback(async () => {
    await auth.signOut();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, restoring, signIn, signUp, signOut }),
    [user, restoring, signIn, signUp, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
