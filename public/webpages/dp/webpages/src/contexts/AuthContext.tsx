import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  type User,
} from 'firebase/auth';
import { auth } from '@/src/lib/firebase';
import { getAuthErrorMessage } from '@/src/lib/authErrors';

export interface AuthContextValue {
  user: User | null;
  loading: boolean;
  isEmailVerified: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
  refreshUser: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const refreshUser = useCallback(async (): Promise<boolean> => {
    if (!auth.currentUser) {
      return false;
    }
    await auth.currentUser.reload();
    setUser(auth.currentUser);
    return auth.currentUser.emailVerified;
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (error) {
      throw new Error(getAuthErrorMessage(error));
    }
  }, []);

  const signUp = useCallback(
    async (email: string, password: string, displayName: string) => {
      try {
        const credential = await createUserWithEmailAndPassword(
          auth,
          email.trim(),
          password,
        );
        await updateProfile(credential.user, {
          displayName: displayName.trim(),
        });
        await sendEmailVerification(credential.user);
      } catch (error) {
        throw new Error(getAuthErrorMessage(error));
      }
    },
    [],
  );

  const signOut = useCallback(async () => {
    await firebaseSignOut(auth);
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email.trim(), {
        url: `${window.location.origin}/login`,
        handleCodeInApp: false,
      });
    } catch (error) {
      throw new Error(getAuthErrorMessage(error));
    }
  }, []);

  const resendVerificationEmail = useCallback(async () => {
    if (!auth.currentUser) {
      throw new Error('You must be signed in to resend a verification email.');
    }
    try {
      await sendEmailVerification(auth.currentUser);
    } catch (error) {
      throw new Error(getAuthErrorMessage(error));
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      isEmailVerified: Boolean(user?.emailVerified),
      signIn,
      signUp,
      signOut,
      resetPassword,
      resendVerificationEmail,
      refreshUser,
    }),
    [
      user,
      loading,
      signIn,
      signUp,
      signOut,
      resetPassword,
      resendVerificationEmail,
      refreshUser,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
