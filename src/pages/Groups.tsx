import {
  IonAvatar,
  IonButton,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar
} from "@ionic/react";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Auth";
import { collection, getFirestore, query, where, getDocs } from "firebase/firestore";
import { appendToCache } from "../cache_manager";

interface Group {
  joinId: string;
    id: string,
    name: string,
    members: string[],
    lastUpdated: number
}

const db = getFirestore();

export const fetchGroups = async (userId: any) => {
  console.log("fetchGroups");
  const lastCachedUserGroups: number = JSON.parse(window.localStorage.getItem("lastCachedUserGroups") || "0");
  const groupQuery = query(collection(db, "groups"), where("members", "array-contains", `${userId}`), where("lastUpdated", ">", lastCachedUserGroups));

  const docs = await getDocs(groupQuery);

  docs.forEach(doc => {
    const group: Group = { id: doc.id, members: doc.data().members, name: doc.data().name, lastUpdated: doc.data().lastUpdated, joinId: doc.data().joinId };
    appendToCache("userGroups", group);
  });

  window.localStorage.setItem("lastCachedUserGroups", `${Date.now()}`);
  return new Promise<Array<Group>>(resolve => resolve(JSON.parse(window.localStorage.getItem("userGroups") || "[]")));
};

const Groups: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>(JSON.parse(window.localStorage.getItem("userGroups") || "[]"));
  const ctx = useContext(AuthContext);

  useEffect(() => {
    if (ctx?.loggedIn) {
      fetchGroups(ctx.userId).then(groupsImIn => {
        setGroups(groupsImIn);
      });
    };
  }, [ctx]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>My Groups</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonList>
          {groups?.map(group => (
            <IonItem button href={"groups/" + group.id} key={group.id}>
              <IonLabel>
                <h2>{group.name}</h2>
              </IonLabel>
              <IonAvatar slot="start">
                <img src={`https://picsum.photos/seed/${group.id}/200/200`} />
              </IonAvatar>
            </IonItem>
          ))}
        </IonList>
        <IonButton expand="block" href="/joingroup">Join Group</IonButton>
        <IonButton expand="block" href="/creategroup">Create Group</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Groups;
