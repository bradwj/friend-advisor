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
  IonToast,
  IonButtons,
  IonIcon
} from "@ionic/react";
import { AuthContext } from "../Auth";
import { exitOutline, saveOutline } from "ionicons/icons";
import React, { useContext, useState, useEffect } from "react";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { getAuth, signOut } from "firebase/auth";
import { fetchWithAuth } from "../lib/fetchWithAuth";
import { useHistory } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

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
  const [phone, setProfilePhone] = useState<any>(profile.phone || "1");
  const [likes, setProfileLikes] = useState<string>(profile.likes);
  const [dislikes, setProfileDislikes] = useState<string>(profile.dislikes);
  const [dob, setProfileDOB] = useState<string>(profile.dob);

  const [notification, setNotification] = useState<string>();
  const [notify, setNotify] = useState<boolean>(false);
  const [notifStyle, setNotifStyle] = useState<string>("");

  const ctx = useContext(AuthContext);
  const history = useHistory();

  const saveProfile = async () => {
    console.log({
      name,
      phone,
      likes,
      dislikes,
      dob,
      userId: ctx?.userId,
      lastUpdated: Date.now()
    });
    try {
      await fetchWithAuth(ctx, `profile/create?name=${name}&phone=${phone}&likes=${likes}&dislikes=${dislikes}&dob=${dob}`, {
        method: "POST"
      });
      setNotifStyle("success");
      setNotification("Your profile was updated successfully!");
    } catch (err) {
      console.error(err);
      setNotifStyle("danger");
      setNotification("Sorry, your profile could not be saved. :(");
    }
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
          <IonButtons slot="end">
            <IonButton onClick={logout} size="large">Logout
              <IonIcon size="large" slot="end" icon={exitOutline} color="danger" /></IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonItem>
          <IonLabel><b>Name</b></IonLabel>
          <IonInput value={name} onIonChange={e => setProfileName(e.detail.value!)}/>
        </IonItem>
        <IonItem>
          <IonLabel><b>Phone</b></IonLabel>
          <PhoneInput disableDropdown={true} country={"US"} value={phone} onChange={setProfilePhone}/>
        </IonItem>
        <IonItem>
          <IonLabel><b>Likes</b></IonLabel>
          <IonInput value={likes} onIonChange={e => setProfileLikes(e.detail.value!)}/>
        </IonItem>
        <IonItem>
          <IonLabel><b>Dislikes</b></IonLabel>
          <IonInput value={dislikes} onIonChange={e => setProfileDislikes(e.detail.value!)}/>
        </IonItem>
        <IonItem>
          <IonLabel><b>Date of Birth</b></IonLabel>
          <IonInput type="date" value={dob} onIonChange={e => setProfileDOB(e.detail.value!)}/>
        </IonItem>

        <small>User ID: {ctx?.userId}</small>

        <div className="center-horizontal">
          <IonButton onClick={saveProfile} size="large" style={{ width: "75px", height: "75px" }} shape="round" color="success">
            <IonIcon size="large" icon={saveOutline} />
          </IonButton>
        </div>
        <IonToast
                isOpen={notify}
                onDidDismiss={() => { setNotify(false); }}
                message={notification}
                duration={1000}
                position="bottom"
                color={notifStyle}
                />
      </IonContent>
    </IonPage>
  );
};

export default Profile;
