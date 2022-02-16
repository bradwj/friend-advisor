import {
  IonContent,
  IonPage,
  IonButton,
  IonItem,
  IonLabel,
  IonInput,
  IonToast,
  IonHeader,
  IonToolbar, IonTitle
} from "@ionic/react";
import { getFirestore, getDoc, doc, updateDoc, arrayUnion } from "firebase/firestore";
import "./JoinGroup.css";
import { AuthContext } from "../Auth";
import React, { useContext, useState } from "react";
import { useLocation, useHistory } from "react-router";

const JoinGroup: React.FC = () => {
  const history = useHistory();

  const id: any = new URLSearchParams(useLocation().search).get("id");

  const [code, setGroupCode] = useState<string>(id);
  const [notification, setNotification] = useState<string>();
  const [notify, setNotify] = useState<boolean>(false);

  const auth = useContext(AuthContext);
  const db = getFirestore();

  const tryCode = async () => {
    const groupEntry = await getDoc(doc(db, "groups", `${code}`));
    if (groupEntry.exists()) {
      const { members } = groupEntry.data();
      const found = members.find((member: string) => member === auth?.userId);
      if (found) {
        setNotification("You are already in the group!");
        setNotify(true);
      } else {
        await updateDoc(doc(db, "groups", `${code}`), {
          members: arrayUnion(auth?.userId),
          lastUpdated: Date.now()
        });
        setNotification("You have joined the group successfully!");
        setNotify(true);

        history.push("/groups");
      }
    } else {
      setNotification("Group not found!");
      setNotify(true);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Join Group</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonItem>
          <IonLabel>Group Code</IonLabel>
          <IonInput value={code} onIonChange={e => setGroupCode(e.detail.value!)}/>
        </IonItem>
        <IonButton onClick={tryCode} expand="block" color="primary">Join</IonButton>
        You can also join a group by scanning a group&#39s QR code.
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

export default JoinGroup;
