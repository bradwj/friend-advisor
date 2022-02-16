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
import { collection, getDocs, getFirestore } from "firebase/firestore";

interface Group {
    id: string,
    name: string,
    members: string[]
}

const db = getFirestore();

const Groups: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>();
  const ctx = useContext(AuthContext);

  const fetchGroups = async () => {
    console.log("fetchGroups");
    const docs = await getDocs(collection(db, "groups"));

    const groupsImIn:Group[] = [];
    docs.forEach(doc => {
      if (doc.data()?.members?.includes(ctx?.userId)) {
        groupsImIn.push({ id: doc.id, members: doc.data().members, name: doc.data().name });
      }
    });

    setGroups(groupsImIn);
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
