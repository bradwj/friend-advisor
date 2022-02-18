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
  IonModal, IonInput
} from "@ionic/react";
import "./Group.css";
import { RouteComponentProps } from "react-router";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Auth";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import { personAddOutline } from "ionicons/icons";
import QRCode from "react-qr-code";
import { useHistory } from "react-router-dom";
import { deleteFromCache } from "../cache_manager";
import { fetchGroups } from "./Groups";
import { fetchWithAuth } from "../lib/fetchWithAuth";

export interface Group {
    id: string,
    name: string,
    members: any[],
    lastUpdated: number
}

const db = getFirestore();

export const fetchGroup = async (groupId: any, userId: any) => {
  console.log("fetchGroup");
  const groups = await fetchGroups(userId);
  const group = groups.find(group => group.id === groupId);
  const currentCachedGroup = JSON.parse(window.localStorage.getItem("currentGroup") || "{}");

  if (!group) return Promise.reject(new Error("Group not found!"));
  if (group.id === currentCachedGroup.id && group.lastUpdated === currentCachedGroup.lastUpdated) {
    window.localStorage.setItem("lastCachedCurrentGroup", `${Date.now()}`);
    return Promise.resolve(currentCachedGroup);
  }

  const returnedGroup: Group = {
    id: group.id,
    name: group.name,
    members: [],
    lastUpdated: group.lastUpdated
  };

  for (const member of group.members) {
    const memberDoc = await getDoc(doc(db, "users", `${member}`));
    returnedGroup.members.push({ ...memberDoc.data() });
  }
  window.localStorage.setItem("currentGroup", JSON.stringify(returnedGroup));
  window.localStorage.setItem("lastCachedCurrentGroup", `${Date.now()}`);

  return Promise.resolve(returnedGroup);
};

const GroupPage: React.FC<RouteComponentProps> = ({ match }) => {
  const [group, setGroup] = useState<Group>();
  const [canDeleteGroup, setCanDeleteGroup] = useState(false);
  const ctx = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteGroupModal, setShowDeleteGroupModal] = useState(false);
  const history = useHistory();

  // @ts-ignore
  const id = match.params.id;

  useEffect(() => {
    if (ctx?.loggedIn) {
      fetchGroup(id, ctx?.userId).then(returnedGroup => {
        setGroup(returnedGroup);
      });
    }
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

  async function deleteGroup () {
    await fetchWithAuth(ctx, "groups/delete", {
      method: "DELETE"
    });

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
          {group?.members.map(member => <IonItem button href={"users/" + member.userId} key={member.userId}>
            <IonLabel>
              <h2>{member.name}</h2>
            </IonLabel>
            <IonAvatar slot="start">
              <img src={`https://picsum.photos/seed/${member.userId}/200/200`} />
            </IonAvatar>
          </IonItem>)}
        </IonList>
        <h2 className="padded">Group ID</h2>
        <p className="padded">{group?.id}</p>
        <IonButton className="padded" color="danger" onClick={leaveGroup}>Leave Group</IonButton>
        <IonButton className="padded" color="danger" onClick={() => setShowDeleteGroupModal(true)}>Delete Group</IonButton>

        <IonModal className="inf" isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
          <div className="qr"><QRCode value={new URL("/joingroup?id=" + group?.id, window.location.origin).href} /></div>
          <IonButton slot="bottom" onClick={() => setShowModal(false)}>Close</IonButton>
        </IonModal>

        <IonModal className="confirmation" isOpen={showDeleteGroupModal} onDidDismiss={() => {
          setShowDeleteGroupModal(false);
        }}>
          <h2>Enter the name of the group to confirm deletion.</h2>
          <IonItem>
            <IonLabel>Group Name</IonLabel>
            <IonInput onIonChange={e => setCanDeleteGroup(e.detail.value === group?.name)}/>
          </IonItem>

          <IonButton disabled={!canDeleteGroup} color="danger" onClick={async () => {
            setShowDeleteGroupModal(false);
            await deleteGroup();
          }}>
            Delete Group
          </IonButton>
          <IonButton onClick={() => {
            setShowDeleteGroupModal(false);
          }}>
            Cancel
          </IonButton>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default GroupPage;
