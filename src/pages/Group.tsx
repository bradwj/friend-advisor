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
  IonModal, IonInput, IonToast, IonBackButton
} from "@ionic/react";
import "./Group.css";
import { RouteComponentProps } from "react-router";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { personAddOutline } from "ionicons/icons";
import QRCode from "react-qr-code";
import { useHistory } from "react-router-dom";
import { appendToCache, deleteFromCache } from "../cache_manager";
import { fetchWithAuth } from "../lib/fetchWithAuth";
import { User } from "./User";

export interface Group {
    id: string,
    name: string,
    members: any[],
    lastUpdated: number,
    joinId: string
}

const db = getFirestore();

export const fetchGroup = async (groupId: any, auth: any) => {
  /*
  endpoint: GET /groups?id=...&?lastUpdated=...      rec.params.id      rec.query.lastUpdated
  return group and most recent users data
  store users data in cachedUsers
  fetch users from cache belonging to that group
  on users page get user from cache
  */
  console.log("fetchGroup");
  const lastCachedUsers = JSON.parse(window.localStorage.getItem("lastCachedUsers") || "0");

  const req = await fetchWithAuth(auth, `groups?id=${groupId}&lastUpdated=${lastCachedUsers}`, {
    method: "GET"
  });

  const resp:{ group: Group; recentUsers: User[]; message?: string; } = await req.json();

  if (resp.message) return Promise.reject(new Error(resp.message));
  resp.recentUsers.forEach((user: any) => {
    appendToCache("cachedUsers", user);
  });

  const cachedUsers: User[] = JSON.parse(window.localStorage.getItem("cachedUsers") || "[]");
  console.log(resp.recentUsers);
  for (let i = 0; i < resp.group.members.length; i++) {
    const user = cachedUsers.find(user => user.userId === resp.group.members[i]);
    if (user) resp.group.members[i] = { name: user.name, userId: user.userId };
  }

  window.localStorage.setItem("lastCachedUsers", `${Date.now()}`);
  return Promise.resolve(resp.group);
};

const GroupPage: React.FC<RouteComponentProps> = ({ match }) => {
  const [group, setGroup] = useState<Group>();
  const [copyClipboardOpen, setCopyClipboardOpen] = useState(false);
  const [canDeleteGroup, setCanDeleteGroup] = useState(false);
  const ctx = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteGroupModal, setShowDeleteGroupModal] = useState(false);
  const history = useHistory();

  // @ts-ignore
  const id = match.params.id;

  useEffect(() => {
    if (ctx?.loggedIn) {
      fetchGroup(id, ctx).then(returnedGroup => {
        setGroup(returnedGroup);
      });
    }
  }, [ctx]);

  async function leaveGroup () {
    await fetchWithAuth(ctx, `groups/leave?id=${id}`, {
      method: "PATCH"
    });

    deleteFromCache("userGroups", { id });

    history.push("/groups");
  }

  async function deleteGroup () {
    await fetchWithAuth(ctx, `groups/delete?id=${group?.id}`, {
      method: "DELETE"
    });

    history.push("/groups");
  }

  async function copyToClipboard (string: string | undefined) {
    if (string) {
      await navigator.clipboard.writeText(string);
    }

    setCopyClipboardOpen(true);
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/groups/" />
          </IonButtons>
          <IonTitle>Group Profile</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => setShowModal(true)} size="large"><IonIcon size="large" icon={personAddOutline}/></IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <h1>{group?.name}</h1>
        <h2>Group Members</h2>
        <IonList>
          {group?.members.map(member => <IonItem button href={"users/" + member.userId} key={member.userId}>
            <IonLabel>
              <h2>{member.name}</h2>
            </IonLabel>
            <IonAvatar slot="start">
              <img alt="User profile image" src={`https://picsum.photos/seed/${member.userId}/200/200`} />
            </IonAvatar>
          </IonItem>)}
        </IonList>
        <h2>Group Join Code</h2>
        <p className="copyToClipboard" onClick={() => copyToClipboard(group?.joinId)}>{group?.joinId}</p>
        <IonButton color="danger" onClick={leaveGroup}>Leave Group</IonButton>
        <IonButton color="danger" onClick={() => {
          setShowDeleteGroupModal(true);
          setCanDeleteGroup(false);
        }}>Delete Group</IonButton>

        <IonModal className="inf" isOpen={showModal} onDidDismiss={() => setShowModal(false)}>          <div className="qr center"><QRCode value={new URL("/joingroup?id=" + group?.id, window.location.origin).href} /></div>
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

        <IonToast
          isOpen={copyClipboardOpen}
          onDidDismiss={() => { setCopyClipboardOpen(false); }}
          message="Copied group join code to clipboard."
          duration={1000}
          position="bottom"
        />
      </IonContent>
    </IonPage>
  );
};

export default GroupPage;
