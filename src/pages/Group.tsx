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
} from '@ionic/react';
import './Group.css';
import {RouteComponentProps} from "react-router";
import {useCallback, useContext, useEffect, useState} from "react";
import {AuthContext} from "../Auth";
import {collection, doc, getDoc, getDocs, getFirestore} from "firebase/firestore";
import { personAddOutline } from 'ionicons/icons';
import QRCode from "react-qr-code";

interface Group {
    id: string,
    name: string,
    members: { id: string; name: any; }[]
}

const db = getFirestore();

const Group: React.FC<RouteComponentProps> = ({match}) => {
    const [group, setGroup] = useState<Group>();
    const ctx = useContext(AuthContext);
    const [showModal, setShowModal] = useState(false);

    const fetchGroup = useCallback(async () => {
        const groupDoc = await getDoc(doc(db, "groups", id));
        console.log(id);

        const users: { id: string; name: any; }[] = [];

        const usersDocs = await getDocs(collection(db, "users"));
        usersDocs.forEach(user => {
            users.push({id: user.id, name: user.data().name})
        });

        if(groupDoc.exists()){
            const {members, name} = groupDoc.data();
            setGroup({id: groupDoc.id, name, members: users.filter(user => members.includes(user.id))});
        }
    }, [ctx?.userData]) // if userId changes, useEffect will run again
    // if you want to run only once, just leave array empty []

    useEffect(() => {
        fetchGroup()
    }, [fetchGroup]);

    // @ts-ignore
    const id = match.params.id;

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>{group?.name}</IonTitle>
                    <IonButtons slot='end'>
                        <IonButton onClick={() => setShowModal(true)} size='large'><IonIcon size='large' icon={personAddOutline}></IonIcon></IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <h1>{group?.name}</h1>
                <h2>Group Members</h2>
                <IonList>
                {group?.members.map(member => <IonItem key={member.id}>
                    <IonLabel>
                        <h2>{member.name}</h2>
                    </IonLabel>
                    <IonAvatar slot="start">
                        <img src={`https://picsum.photos/seed/${member.id}/200/200`} />
                    </IonAvatar>
                </IonItem>)}
                </IonList>
                <IonModal className='inf' isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
                    <div className='qr'><QRCode value={new URL("/joingroup?id="+group?.id, window.location.origin).href} /></div>
                    <IonButton slot='bottom' onClick={() => setShowModal(false)}>Close</IonButton>
                </IonModal>
            </IonContent>
        </IonPage>
    );
};

export default Group;
