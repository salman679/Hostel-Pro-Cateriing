import { useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import PropTypes from "prop-types";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { Auth } from "../firebase/firebase.config";
import { useAxiosPublic } from "../Hooks/useAxiosPublic";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const axiosPublic = useAxiosPublic();

  const provider = new GoogleAuthProvider();

  function createUser(email, password) {
    setLoading(true);
    return createUserWithEmailAndPassword(Auth, email, password);
  }

  function updateUser(user) {
    setLoading(true);
    return updateProfile(Auth.currentUser, {
      displayName: user.name,
      photoURL: user.photo,
    });
  }

  function login(user) {
    setLoading(true);
    return signInWithEmailAndPassword(Auth, user.email, user.password);
  }

  function logOut() {
    setLoading(true);
    return signOut(Auth);
  }

  function signInWithGoogle() {
    setLoading(true);
    return signInWithPopup(Auth, provider);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(Auth, (currentUser) => {
      if (currentUser) {
        setLoading(true);
        const user = {
          email: currentUser.email,
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL,
        };

        axiosPublic
          .post("/jwt", user, {
            withCredentials: true,
          })
          .then((res) => {
            localStorage.setItem("accessToken", res.data.token);

            setUser(currentUser);
            setLoading(false);
          })
          .catch((error) => {
            console.error("Error adding user:", error);
          });
      } else {
        localStorage.removeItem("accessToken");

        axiosPublic.post("/logout");
        setUser(null);
        setLoading(false);
      }
    });
    return () => {
      unsubscribe();
    };
  }, [axiosPublic]);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        setLoading,
        createUser,
        updateUser,
        login,
        logOut,
        signInWithGoogle,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node,
};
