import { IonContent, IonPage, IonButton, IonFooter, IonIcon } from "@ionic/react";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, getDoc, doc } from "firebase/firestore";
import { AuthContext } from "../Auth";
import React, { useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { personOutline } from "ionicons/icons";

const SignIn: React.FC = () => {
  const ctx = useContext(AuthContext);
  const db = getFirestore();
  const history = useHistory();

  const signIn = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(getAuth(), provider);
  };

  // What the hell idk how this works
  // Do not touch
  const checkUser = async () => {
    console.log("checkUser");
    const userEntry = await getDoc(doc(db, "users", `${ctx?.userId}`));
    if (userEntry.exists()) {
      history.push("/home");
    } else {
      history.push("/profile");
    }
  };

  useEffect(() => {
    if (ctx?.loggedIn) checkUser();
  }, [ctx]);

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="center">
          <div><IonIcon size="large" icon={personOutline}></IonIcon></div>
          <div><IonButton onClick={signIn} expand="block">Sign In</IonButton></div>
        </div>
      </IonContent>
      <IonFooter>
      </IonFooter>
    </IonPage>
  );
};

export default SignIn;
