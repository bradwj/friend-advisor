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
} from '@ionic/react';
import { addDoc, getFirestore, getDoc, doc, updateDoc, arrayUnion } from "firebase/firestore";
import './JoinGroup.css';
import { AuthContext } from "../Auth";
import { useContext, useState } from "react";
import { useLocation, useHistory } from 'react-router';

const CreateGroup: React.FC = () => {
    const history = useHistory();

    const id: any = new URLSearchParams(useLocation().search).get('id');

    const [name, setName] = useState<string>(id);
    const [notification, setNotification] = useState<string>();
    const [notify, setNotify] = useState<boolean>(false);

    const auth = useContext(AuthContext);
    const db = getFirestore();

    const tryCode = async () => {
        const basePath = process.env.NODE_ENV === 'development' ? "http://localhost:5001/friend-advisor/us-central1/app" : "https://us-central1-friend-advisor.cloudfunctions.net/app";
        await fetch(`${basePath}/groups/create?groupId=name=${name}&creatorId=${auth?.userId}`, {
            method: "POST"
        });

        history.push("/groups");
    }

  return (
    <IonPage>
        <IonHeader>
            <IonToolbar>
                <IonTitle>Create Group</IonTitle>
            </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
            <IonItem>
                <IonLabel>Group Name</IonLabel>
                <IonInput value={name} onIonChange={e => setName(e.detail.value!)}/>
            </IonItem>
            <IonButton onClick={tryCode} expand="block" color="success">Create Group</IonButton>
            <IonToast
                isOpen={notify}
                onDidDismiss={() => {setNotify(false)}}
                message={notification}
                duration={1000}
                position="bottom"
            />
        </IonContent>
    </IonPage>
  );
};

export default CreateGroup;
