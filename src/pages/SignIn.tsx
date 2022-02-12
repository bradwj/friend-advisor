import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton } from '@ionic/react';
import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { addDoc, getFirestore, collection, getDocs, onSnapshot, getDoc, doc } from "firebase/firestore";
import ExploreContainer from '../components/ExploreContainer';
import './Home.css';
import { AuthContext } from "../Auth";
import { useContext } from "react";
import { useHistory } from "react-router-dom";

const Home: React.FC = () => {
    const auth = useContext(AuthContext);
    const db = getFirestore();
    const history = useHistory();
    const signIn = async () => {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(getAuth(), provider);
        const userEntry = await getDoc(doc(db, "users", `${auth?.userId}`));
        if (userEntry.exists()) {
            history.push('/home');
        } else {
            history.push('/profile');
        }
    }

  return (
    <IonPage>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Home</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonButton onClick={signIn} expand="full" color="secondary">Sign In</IonButton>
        <ExploreContainer name="Home page" />
      </IonContent>
    </IonPage>
  );
};

export default Home;
