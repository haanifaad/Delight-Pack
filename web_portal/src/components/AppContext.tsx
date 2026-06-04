"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { app, auth, db, storage } from "../firebase/config";
import { onAuthStateChanged, User } from "firebase/auth";

interface AppContextType {
  user: User | null;
  loading: boolean;
  app: typeof app;
  auth: typeof auth;
  db: typeof db;
  storage: typeof storage;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <AppContext.Provider value={{ user, loading, app, auth, db, storage }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
