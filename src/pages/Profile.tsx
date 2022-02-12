import {
    IonContent,
    IonHeader,
    IonItem,
    IonLabel,
    IonPage,
    IonTitle,
    IonToolbar,
    IonInput,
    IonTextarea,
    IonButton
} from '@ionic/react';
import './Profile.css';
import { AuthContext } from "../Auth";
import { SetStateAction, useContext, useState } from "react";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const Profile: React.FC = () => {
    const [name, setProfileName] = useState<string>();
    const [likes, setProfileLikes] = useState<string>();
    const [dislikes, setProfileDislikes] = useState<string>();
    const [dob, setProfileDOB] = useState<string>();

    const auth = useContext(AuthContext);
    const db = getFirestore();

    const saveProfile = async () => {
        console.log(dob);
        await setDoc(doc(db, "users", `${auth?.userId}`), {
            name,
            likes,
            dislikes,
            dob
        });
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Profile</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonItem>
                    <IonLabel>Name</IonLabel>
                    <IonInput value={name} onIonChange={e => setProfileName(e.detail.value!)}/>
                </IonItem>
                <IonItem>
                    <IonLabel>Likes</IonLabel>
                    <IonInput value={likes} onIonChange={e => setProfileLikes(e.detail.value!)}/>
                </IonItem>
                <IonItem>
                    <IonLabel>Dislikes</IonLabel>
                    <IonInput value={dislikes} onIonChange={e => setProfileDislikes(e.detail.value!)}/>
                </IonItem>
                <IonItem>
                    <IonLabel>Date of Birth</IonLabel>
                    <IonInput value={dob} onIonChange={e => setProfileDOB(e.detail.value!)}/>
                </IonItem>
                <IonButton onClick={saveProfile} expand="full" color="secondary">Save</IonButton>
            </IonContent>
        </IonPage>
    );
};

export default Profile;
