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
import { appendToCache } from "../cache_manager";
import { fetchWithAuth } from "../lib/fetchWithAuth";

interface Group {
  joinId: string,
  id: string,
  name: string,
  members: string[],
  lastUpdated: number
}

export const fetchGroups = async (auth: any) => {
  console.log("fetchGroups");
  const lastCachedUserGroups: number = JSON.parse(window.localStorage.getItem("lastCachedUserGroups") || "0");

  const req = await fetchWithAuth(auth, `groups/all?lastUpdated=${lastCachedUserGroups}`, {
    method: "GET"
  });

  const resp:{ groups: any[]; message?: string; } = await req.json();

  if (!resp.message) {
    resp.groups.forEach(group => {
      appendToCache("userGroups", group);
    });
  }

  window.localStorage.setItem("lastCachedUserGroups", `${Date.now()}`);
  return new Promise<Array<Group>>(resolve => resolve(JSON.parse(window.localStorage.getItem("userGroups") || "[]")));
};

const Groups: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>(JSON.parse(window.localStorage.getItem("userGroups") || "[]"));
  const ctx = useContext(AuthContext);

  useEffect(() => {
    if (ctx?.loggedIn) {
      fetchGroups(ctx).then(groupsImIn => {
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
