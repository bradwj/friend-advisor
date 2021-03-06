import {
  IonContent,
  IonPage,
  IonButton,
  IonItem,
  IonLabel,
  IonInput,
  IonToast,
  IonHeader,
  IonToolbar,
  IonTitle
} from "@ionic/react";
import { AuthContext } from "../Auth";
import React, { useContext, useState } from "react";
import { useLocation, useHistory } from "react-router";
import { fetchWithAuth } from "../lib/fetchWithAuth";

const CreateGroup: React.FC = () => {
  const history = useHistory();

  const id: any = new URLSearchParams(useLocation().search).get("id");

  const [name, setName] = useState<string>(id);
  const [description, setDescription] = useState<string>("");
  const [notification, setNotification] = useState<string>();
  const [notify, setNotify] = useState<boolean>(false);

  const auth = useContext(AuthContext);

  const tryCode = async () => {
    await fetchWithAuth(auth, `groups/create?name=${name}&description=${description}`, {
      method: "POST"
    });
    setNotification("Successfully created group!");
    setNotify(true);
    history.push("/groups");
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Create Group</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonItem>
          <IonLabel><b>Group Name</b></IonLabel>
          <IonInput value={name} onIonChange={e => setName(e.detail.value!)}/>
        </IonItem>
        <IonItem>
          <IonLabel><b>Group Description</b></IonLabel>
          <IonInput value={description} onIonChange={e => setDescription(e.detail.value!)}/>
        </IonItem>
        <IonButton onClick={tryCode} expand="block" color="success">Create Group</IonButton>
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

export default CreateGroup;
