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
import { getFirestore, doc, setDoc, collection, query, where, getDocs } from "firebase/firestore";
import { getAuth, signOut } from "firebase/auth";
import { useHistory } from "react-router-dom";

const db = getFirestore();

const fetchProfile = async (userId: any) => {
  console.log("fetchProfile");
  const lastCachedProfile: number = JSON.parse(window.localStorage.getItem("lastCachedProfile") || "0");

  const profileQuery = query(collection(db, "users"), where("userId", "==", userId), where("lastUpdated", ">", lastCachedProfile));
  const profileDoc = await getDocs(profileQuery);

  window.localStorage.setItem("lastCachedProfile", `${Date.now()}`);
  if (!profileDoc.empty) {
    console.log("fetched Profile from db");
    window.localStorage.setItem("cachedProfile", JSON.stringify(profileDoc.docs[0].data()));
    return Promise.resolve(profileDoc.docs[0].data());
  } else {
    console.log("fetched Profile from cache");
    return Promise.resolve(JSON.parse(window.localStorage.getItem("cachedProfile") || "{}"));
  }
};

const Profile: React.FC = () => {
  const profile = JSON.parse(window.localStorage.getItem("cachedProfile") || "{}");
  const [name, setProfileName] = useState<string>(profile.name);
  const [phone, setProfilePhone] = useState<string>(profile.phone);
  const [likes, setProfileLikes] = useState<string>(profile.likes);
  const [dislikes, setProfileDislikes] = useState<string>(profile.dislikes);
  const [dob, setProfileDOB] = useState<string>(profile.dob);

  const [notification, setNotification] = useState<string>();
  const [notify, setNotify] = useState<boolean>(false);
  // eslint-disable-next-line no-unused-vars
  const [loadAttempt, setLoadAttempt] = useState<boolean>(false);

  const ctx = useContext(AuthContext);
  const history = useHistory();

  const saveProfile = async () => {
    await setDoc(doc(db, "users", `${ctx?.userId}`), {
      name,
      phone,
      likes,
      dislikes,
      dob,
      userId: ctx?.userId,
      lastUpdated: Date.now()
    });
    setNotification("Your profile was updated successfully!");
    setNotify(true);
  };

  const logout = async () => {
    await signOut(getAuth());
    window.localStorage.clear();
    history.push("/signin");
  };

  useEffect(() => {
    if (ctx?.loggedIn) {
      fetchProfile(ctx.userId).then(result => {
        const { name, phone, likes, dislikes, dob } = result;
        setProfileName(name);
        setProfilePhone(phone);
        setProfileLikes(likes);
        setProfileDislikes(dislikes);
        setProfileDOB(dob);
        setLoadAttempt(true);
      }, reason => {
        console.log(reason);
      });
    }
  }, [ctx]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Profile</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
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
