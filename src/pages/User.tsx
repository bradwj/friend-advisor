import {
  IonAvatar,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonToolbar
} from "@ionic/react";
import { RouteComponentProps, useHistory } from "react-router";
import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../Auth";
import { arrowBack } from "ionicons/icons";
import { Group } from "./Group";
import { where, collection, getFirestore, query, getDocs } from "firebase/firestore";

export interface User {
    userId: string,
    name: string,
    likes: string,
    dislikes: string,
    phone: number,
    dob: string,
    lastUpdated: number
}

const db = getFirestore();

const fetchUserInGroup = async (id: string) => {
  console.log("fetchUser");
  const currentGroup: Group = JSON.parse(window.localStorage.getItem("currentGroup") || "{}");
  const userIndex = currentGroup.members.findIndex(user => user.userId === id);
  const userEntry = currentGroup.members[userIndex];
  const lastCachedCurrentGroup = JSON.parse(window.localStorage.getItem("lastCachedCurrentGroup") || "0");
  console.log(lastCachedCurrentGroup);

  if (!userEntry) return Promise.reject(new Error("user not found"));
  const userQuery = query(collection(db, "users"), where("userId", "==", id), where("lastUpdated", ">", userEntry.lastUpdated));
  const userDoc = await getDocs(userQuery);
  if (!userDoc.empty) {
    console.log("user returned from db");
    const { name, likes, dislikes, dob, phone, userId, lastUpdated } = userDoc.docs[0].data();
    currentGroup.members[userIndex] = { name, likes, dislikes, dob, phone, userId, lastUpdated };
    window.localStorage.setItem("currentGroup", JSON.stringify(currentGroup));
    return Promise.resolve({ name, likes, dislikes, dob, phone, userId, lastUpdated });
  }

  console.log("user returned from cache");
  const { name, likes, dislikes, dob, phone, userId, lastUpdated } = userEntry;
  return Promise.resolve({ name, likes, dislikes, dob, phone, userId, lastUpdated });
};

const UserPage: React.FC<RouteComponentProps> = ({ match }) => {
  const [user, setUser] = useState<User>();
  const history = useHistory();
  const ctx = useContext(AuthContext);

  // @ts-ignore
  const id = match.params.id;

  useEffect(() => {
    if (ctx?.loggedIn) {
      fetchUserInGroup(id).then(result => {
        setUser(result);
      }, reason => {
        console.log(reason);
      });
    }
  }, [ctx]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons>
            <IonButtons slot="start">
              <IonButton onClick={() => history.goBack()} size="large"><IonIcon size="large" icon={arrowBack}></IonIcon></IonButton>
            </IonButtons>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent hidden={user === undefined} fullscreen>
        <div className="center">
          <IonAvatar slot="start">
            <img src={`https://picsum.photos/seed/${user?.userId}/200/200`} />
          </IonAvatar>
          <h1>{user?.name}</h1>
          <p>Likes {user?.likes}</p>
          <p>Dislikes {user?.dislikes}</p>
          <p>{user?.phone}</p>
          <p>{user?.dob}</p>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default UserPage;
