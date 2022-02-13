import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton } from '@ionic/react';
import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { addDoc, getFirestore, collection, getDocs, onSnapshot, getDoc, doc } from "firebase/firestore";
import './Home.css';
import { AuthContext } from "../Auth";
import { useCallback, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";

const SignIn: React.FC = () => {
    const auth = useContext(AuthContext);
    const db = getFirestore();
    const history = useHistory();

    const signIn = async () => {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(getAuth(), provider);
    }

    // What the hell idk how this works
    // Do not touch 
    const checkUser = useCallback(async () => {
        if (auth?.loggedIn) {
            const userEntry = await getDoc(doc(db, "users", `${auth?.userId}`));
            if (userEntry.exists()) {
                history.push('/home');
            } else {
                history.push('/profile');
            }
        }
    }, [auth?.userId]);

    useEffect(() => {
        checkUser()
    }, [checkUser]);

  return (
    <IonPage>
      <IonContent fullscreen>
        <IonButton onClick={signIn} expand="full" color="secondary">Sign In</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default SignIn;
