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
    IonButton,
    useIonViewWillEnter,
    useIonViewDidEnter
} from '@ionic/react';
import './Profile.css';
import { AuthContext } from "../Auth";
import { SetStateAction, useContext, useState, useEffect } from "react";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { getAuth, signOut } from "firebase/auth";
import { useHistory } from "react-router-dom";

const Profile: React.FC = () => {
    const [name, setProfileName] = useState<string>();
    const [phone, setProfilePhone] = useState<string>();
    const [likes, setProfileLikes] = useState<string>();
    const [dislikes, setProfileDislikes] = useState<string>();
    const [dob, setProfileDOB] = useState<string>();

    const db = getFirestore();
    const auth = useContext(AuthContext);
    const history = useHistory();

    useEffect(() => {
        getDoc(doc(db, "users", `${auth?.userId}`))
            .then(userEntry => {
                if (userEntry.exists()) {
                    const { name, phone, likes, dislikes, dob } = userEntry.data();
                    setProfileName(name);
                    setProfilePhone(phone);
                    setProfileLikes(likes);
                    setProfileDislikes(dislikes);
                    setProfileDOB(dob);
                } else {
                    console.log(auth?.userId);
                }
            })
            .catch(error => {
                console.log(error);
            })
        
    }, [auth]);

    const saveProfile = async () => {
        await setDoc(doc(db, "users", `${auth?.userId}`), {
            name,
            phone,
            likes,
            dislikes,
            dob
        });
    }

    const logout = async () => {
        await signOut(getAuth());
        history.push('/signin');
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
                    <IonLabel>Phone</IonLabel>
                    <IonInput type="tel" value={phone} onIonChange={e => setProfilePhone(e.detail.value!)}/>
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
                    <IonInput type="date" value={dob} onIonChange={e => setProfileDOB(e.detail.value!)}/>
                </IonItem>
                <IonButton onClick={saveProfile} expand="full" color="secondary">Save</IonButton>
                <IonButton onClick={logout} expand="full" color="primary">Logout</IonButton>
            </IonContent>
        </IonPage>
    );
};

export default Profile;
