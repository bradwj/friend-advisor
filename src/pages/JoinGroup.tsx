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
import "./JoinGroup.css";
import { AuthContext } from "../Auth";
import React, { useContext, useState } from "react";
import { useLocation, useHistory } from "react-router";
import { fetchWithAuth } from "../lib/fetchWithAuth";

const JoinGroup: React.FC = () => {
  const history = useHistory();

  const id: any = new URLSearchParams(useLocation().search).get("id");

  const [code, setGroupCode] = useState<string>(id);
  const [notification, setNotification] = useState<string>();
  const [notify, setNotify] = useState<boolean>(false);

  const auth = useContext(AuthContext);

  const tryCode = async () => {
    const req = await fetchWithAuth(auth, `groups/join?joinId=${code}`, {
      method: "PATCH"
    });

    const resp = await req.json() as {message: string, joined: boolean};

    setNotification(resp.message);
    setNotify(true);

    if (resp.joined) {
      history.push("/groups");
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
        You can also join a group by scanning a group&rsquo;s QR code.
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
