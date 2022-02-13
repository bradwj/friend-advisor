import { IonContent, IonPage, IonButton, IonItem, IonLabel, IonInput, IonToast } from '@ionic/react';
import { addDoc, getFirestore, getDoc, doc, updateDoc, arrayUnion } from "firebase/firestore";
import './JoinGroup.css';
import { AuthContext } from "../Auth";
import { useContext, useState } from "react";

const JoinGroup: React.FC = () => {
    const [code, setGroupCode] = useState<string>();
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
                    members: arrayUnion(auth?.userId)
                });
                setNotification("You have joined the group successfully!");
                setNotify(true);
            }
        } else {
            setNotification("Group not found!");
            setNotify(true);
        }
    }

  return (
    <IonPage>
        <IonContent fullscreen>
            <IonItem>
                <IonLabel>Group Code</IonLabel>
                <IonInput value={code} onIonChange={e => setGroupCode(e.detail.value!)}/>
            </IonItem>
            <IonButton onClick={tryCode} expand="full" color="secondary">Join</IonButton>
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

export default JoinGroup;
