import {
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonPage,
  IonTitle,
  IonToolbar,
  IonInput,
  IonButton,
  IonToast
} from "@ionic/react";
import "./Profile.css";
import { AuthContext } from "../Auth";
import React, { useContext, useState, useEffect } from "react";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { getAuth, signOut } from "firebase/auth";
import { useHistory } from "react-router-dom";

const Profile: React.FC = () => {
  const [name, setProfileName] = useState<string>();
  const [phone, setProfilePhone] = useState<string>();
  const [likes, setProfileLikes] = useState<string>();
  const [dislikes, setProfileDislikes] = useState<string>();
  const [dob, setProfileDOB] = useState<string>();

  const [notification, setNotification] = useState<string>();
  const [notify, setNotify] = useState<boolean>(false);
  const [loadAttempt, setLoadAttempt] = useState<boolean>(false);

  const db = getFirestore();
  const ctx = useContext(AuthContext);
  const history = useHistory();

  const fetchProfile = async () => {
    console.log("fetchProfile");
    getDoc(doc(db, "users", `${ctx?.userId}`))
      .then(userEntry => {
        if (userEntry.exists()) {
          const { name, phone, likes, dislikes, dob } = userEntry.data();
          setProfileName(name);
          setProfilePhone(phone);
          setProfileLikes(likes);
          setProfileDislikes(dislikes);
          setProfileDOB(dob);
        } else {
          console.log(ctx?.userId);
        }
        setLoadAttempt(true);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const saveProfile = async () => {
    await setDoc(doc(db, "users", `${ctx?.userId}`), {
      name,
      phone,
      likes,
      dislikes,
      dob
    });
    setNotification("Your profile was updated successfully!");
    setNotify(true);
  };

  const logout = async () => {
    await signOut(getAuth());
    history.push("/signin");
  };

  useEffect(() => {
    if (ctx?.loggedIn) fetchProfile();
  }, [ctx]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Profile</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent hidden={!loadAttempt} fullscreen>
        <IonItem>
          <IonLabel>Name</IonLabel>
          <IonInput value={name} onIonChange={e => setProfileName(e.detail.value!)}/>
        </IonItem>
        <IonItem>
          <IonLabel>Phone</IonLabel>
          <IonInput type="tel" value={phone} onIonChange={e => setProfilePhone(e.detail.value!)}/>
        </IonItem>
        <IonItem>
          <IonLabel>Likes</IonLabel>
          <IonInput value={likes} onIonChange={e => setProfileLikes(e.detail.value!)}/>
        </IonItem>
        <IonItem>
          <IonLabel>Dislikes</IonLabel>
          <IonInput value={dislikes} onIonChange={e => setProfileDislikes(e.detail.value!)}/>
        </IonItem>
        <IonItem>
          <IonLabel>Date of Birth</IonLabel>
          <IonInput type="date" value={dob} onIonChange={e => setProfileDOB(e.detail.value!)}/>
        </IonItem>
        <IonButton onClick={saveProfile} expand="block" color="secondary">Save</IonButton>
        <IonButton onClick={logout} expand="block" color="primary">Logout</IonButton>
        <IonToast
                isOpen={notify}
                onDidDismiss={() => { setNotify(false); }}
                message={notification}
                duration={1000}
                position="bottom"
                />
      </IonContent>
    </IonPage>
  );
};

export default Profile;
