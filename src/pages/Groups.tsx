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
    id: string,
    name: string,
    members: string[]
}

const db = getFirestore();

const Groups: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>(JSON.parse(window.localStorage.getItem("userGroups") || "[]"));
  const ctx = useContext(AuthContext);

  const fetchGroups = async () => {
    console.log("fetchGroups");
    if (groups.length === 0) {
      const groupQuery = query(collection(db, "groups"), where("members", "array-contains", `${ctx?.userId}`));
      const docs = await getDocs(groupQuery);

      const groupsImIn:Group[] = [];
      docs.forEach(doc => {
        const group = { id: doc.id, members: doc.data().members, name: doc.data().name };
        groupsImIn.push(group);
        appendToCache("userGroups", group);
      });

      setGroups(groupsImIn);
      window.localStorage.setItem("lastCachedUserGroups", `${Date.now()}`);
    } else {
      const lastCachedUserGroups: number = JSON.parse(window.localStorage.getItem("lastCachedUserGroups") || "0");
      const groupQuery = query(collection(db, "groups"), where("members", "array-contains", `${ctx?.userId}`), where("lastUpdated", ">", lastCachedUserGroups));
      const docs = await getDocs(groupQuery);

      const groupsImIn:Group[] = [];
      docs.forEach(doc => {
        groupsImIn.push({ id: doc.id, members: doc.data().members, name: doc.data().name });
      });

      setGroups(groups.concat(groupsImIn));
      groupsImIn.forEach(group => {
        appendToCache("userGroups", group);
      });
      window.localStorage.setItem("lastCachedUserGroups", `${Date.now()}`);
    }
  };

  useEffect(() => {
    if (ctx?.loggedIn) fetchGroups();
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
