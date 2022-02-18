import React, { useContext, useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAxgTHlwSLzetgn94Jvl7y2xiA3laksGZQ",
  authDomain: "friend-advisor.firebaseapp.com",
  projectId: "friend-advisor",
  storageBucket: "friend-advisor.appspot.com",
  messagingSenderId: "185902434794",
  appId: "1:185902434794:web:3da752eef78e811e360a93",
  measurementId: "G-FKZR4YRXR0"
};

// Initialize Firebase
initializeApp(firebaseConfig);

export interface Auth {
    loggedIn: Boolean;
    userId?: string;
    userData?:any;
}
interface AuthInit {
    loading: boolean;
    auth?: Auth;
}

export const AuthContext = React.createContext<Auth|undefined>({ loggedIn: false });

export function useAuth (): Auth |undefined {
  console.log("auth used");
  return useContext(AuthContext);
}

export function useAuthInit (): AuthInit {
  const [authInit, setAuthInit] = useState<AuthInit>({ loading: true });
  useEffect(() => {
    return onAuthStateChanged(getAuth(), (firebaseUser: any) => {
      const auth = firebaseUser
        ? { loggedIn: true, userId: firebaseUser.uid, userData: firebaseUser }
        : { loggedIn: false };
      setAuthInit({ loading: false, auth });
    });
  }, []);
  return authInit;
}
