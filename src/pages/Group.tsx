import {
  IonAvatar,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
  IonModal
} from "@ionic/react";
import "./Group.css";
import { RouteComponentProps } from "react-router";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Auth";
import { collection, doc, getDoc, getDocs, getFirestore, setDoc } from "firebase/firestore";
import { personAddOutline } from "ionicons/icons";
import QRCode from "react-qr-code";
import { useHistory } from "react-router-dom";
import { deleteFromCache } from "../cache_manager";

interface Group {
    id: string,
    name: string,
    members: { id: string; name: any; }[]
}

const db = getFirestore();

const GroupPage: React.FC<RouteComponentProps> = ({ match }) => {
  const [group, setGroup] = useState<Group>();
  const ctx = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  const history = useHistory();

  // @ts-ignore
  const id = match.params.id;

  const fetchGroup = async () => {
    console.log("fetchGroup");
    const groupDoc = await getDoc(doc(db, "groups", id));

    const users: { id: string; name: any; }[] = [];

    const usersDocs = await getDocs(collection(db, "users"));
    usersDocs.forEach(user => {
      users.push({ id: user.id, name: user.data().name });
    });

    if (groupDoc.exists()) {
      const { members, name } = groupDoc.data();
      setGroup({ id: groupDoc.id, name, members: users.filter(user => members.includes(user.id)) });
    }
  };

  useEffect(() => {
    if (ctx?.loggedIn) fetchGroup();
  }, [ctx]);

  async function leaveGroup () {
    const groupDoc = await getDoc(doc(db, "groups", id));

    const members = groupDoc?.data()?.members;

    if (members) {
      const index = members.indexOf(ctx?.userId);
      if (index > -1 && ctx?.userId) {
        members.splice(index, 1); // 2nd parameter means remove one item only
      }

      await setDoc(doc(db, "groups", id), { members }, { merge: true });
      deleteFromCache("userGroups", { id: id });
    }

    history.push("/groups");
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Group Profile</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => setShowModal(true)} size="large"><IonIcon size="large" icon={personAddOutline}></IonIcon></IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <h1 className="padded">{group?.name}</h1>
        <h2 className="padded">Group Members</h2>
        <IonList>
          {group?.members.map(member => <IonItem button href={"users/" + member.id} key={member.id}>
            <IonLabel>
              <h2>{member.name}</h2>
            </IonLabel>
            <IonAvatar slot="start">
              <img src={`https://picsum.photos/seed/${member.id}/200/200`} />
            </IonAvatar>
          </IonItem>)}
        </IonList>
        <h2 className="padded">Group ID</h2>
        <p className="padded">{group?.id}</p>
        <IonButton className="padded" color="danger" onClick={leaveGroup}>Leave Group</IonButton>
        <IonModal className="inf" isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
          <div className="qr"><QRCode value={new URL("/joingroup?id=" + group?.id, window.location.origin).href} /></div>
          <IonButton slot="bottom" onClick={() => setShowModal(false)}>Close</IonButton>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default GroupPage;
