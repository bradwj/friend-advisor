import {
    IonAvatar,
    IonButton, IonChip, IonCol,
    IonContent, IonGrid,
    IonHeader,
    IonItem,
    IonLabel,
    IonPage, IonRow,
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
    members: string[]
}

const db = getFirestore();

const Group: React.FC<RouteComponentProps> = ({match}) => {
    const [group, setGroup] = useState<Group>();
    const ctx = useContext(AuthContext);

    const fetchGroup = useCallback(async () => {
        const groupDoc = await getDoc(doc(db, "groups", id));

        if(groupDoc.exists()){
            const {members, name} = groupDoc.data() as Group;
            setGroup({id: groupDoc.id, name, members});
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
                <IonGrid>
                    <IonRow>
                    {group?.members.map(member =>
                        <IonCol key={member}> <IonAvatar>
                            <img src={`https://picsum.photos/seed/${member}/200/200`} />
                        </IonAvatar>
                        </IonCol>)}
                    </IonRow>
                </IonGrid>
            </IonContent>
        </IonPage>
    );
};

export default Group;
