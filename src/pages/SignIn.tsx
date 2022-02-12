import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton } from '@ionic/react';
import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import ExploreContainer from '../components/ExploreContainer';
import './Home.css';

const Home: React.FC = () => {
    const signIn = async () => {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(getAuth(), provider);
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
