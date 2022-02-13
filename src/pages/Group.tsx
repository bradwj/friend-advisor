import {
    IonAvatar,
    IonButton,
    IonContent,
    IonHeader,
    IonItem,
    IonLabel,
    IonList,
    IonPage,
    IonTitle,
    IonToolbar
} from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import {RouteComponentProps} from "react-router";
import {useCallback, useContext, useEffect, useState} from "react";
import {AuthContext} from "../Auth";
import {collection, doc, getDoc, getDocs, getFirestore} from "firebase/firestore";

interface Group {
    id: string,
    name: string,
    members: { id: string; name: any; }[]
}

const db = getFirestore();

const Group: React.FC<RouteComponentProps> = ({match}) => {
    const [group, setGroup] = useState<Group>();
    const ctx = useContext(AuthContext);

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
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">{group?.name}</IonTitle>
                    </IonToolbar>
                </IonHeader>
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
            </IonContent>
        </IonPage>
    );
};

export default Group;
