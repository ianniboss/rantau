import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async (u) => {
    if (!u) return setProfile(null);
    const snap = await getDoc(doc(db, 'users', u.uid));
    setProfile(snap.exists() ? { id: snap.id, ...snap.data() } : null);
  }, []);

  useEffect(
    () =>
      onAuthStateChanged(auth, async (u) => {
        setUser(u);
        try {
          await loadProfile(u);
        } catch (e) {
          console.error('Profile load failed', e);
        }
        setLoading(false);
      }),
    [loadProfile],
  );

  const signup = useCallback(async ({ email, password, name, university, city, yearOfStudy, course }) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: name });
    const data = {
      uid: cred.user.uid, email, name, university, city, yearOfStudy: Number(yearOfStudy), course,
      joinedDate: serverTimestamp(), savedEvents: [], role: 'user', socialLinks: {},
    };
    await setDoc(doc(db, 'users', cred.user.uid), data, { merge: true });
    setProfile({ id: cred.user.uid, ...data });
    return cred.user;
  }, []);

  const login = useCallback((email, password) => signInWithEmailAndPassword(auth, email, password), []);
  const logout = useCallback(() => signOut(auth), []);

  const value = useMemo(
    () => ({
      user, profile, loading, signup, login, logout,
      isAdmin: profile?.role === 'admin',
      authorInfo: user ? { uid: user.uid, name: profile?.name || user.displayName || 'Student' } : null,
      refreshProfile: () => loadProfile(user),
    }),
    [user, profile, loading, signup, login, logout, loadProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
