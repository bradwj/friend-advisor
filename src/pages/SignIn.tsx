import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonFooter, IonIcon } from '@ionic/react';
import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { addDoc, getFirestore, collection, getDocs, onSnapshot, getDoc, doc } from "firebase/firestore";
import './SignIn.css';
import { AuthContext } from "../Auth";
import { useCallback, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { personOutline } from 'ionicons/icons';

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
        <div className='center'>
          <div><IonIcon size='large' icon={personOutline}></IonIcon></div>
          <div><IonButton onClick={signIn} expand="block">Sign In</IonButton></div>
        </div>
      </IonContent>
      <IonFooter>
      </IonFooter>
    </IonPage>
  );
};

export default SignIn;
