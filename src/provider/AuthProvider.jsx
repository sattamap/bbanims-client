import { createContext, useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { app } from "../firebase/firebase.config";

export const AuthContext = createContext(null);
const auth = getAuth(app);

const AuthProvider = ({children}) => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);


    const createUser = (email, password) =>{
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password);
    };


    const signIn = (email, password)=>{
        setLoading(true);
        return signInWithEmailAndPassword(auth,email,password);
    };




    const updateUserProfile =(name, photo)=>{
      return updateProfile(auth.currentUser, {
          displayName: name, photoURL: photo
        });
  };



    useEffect(() => {
        const unSubscribe = onAuthStateChanged(auth, (currentUser) => {
          console.log("user in auth state", currentUser);
          if (currentUser) {
            setUser(currentUser);
          }
          setLoading(false);
        });
    
        return () => {
          unSubscribe();
        };
      }, []);


    const authInfo = {
        loading,
        createUser,
        signIn,
        user,
        updateUserProfile,
    };

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};


AuthProvider.propTypes = {
    children: PropTypes.node,
  };
  

export default AuthProvider;