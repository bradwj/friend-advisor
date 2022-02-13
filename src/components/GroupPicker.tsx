import './ExploreContainer.css';
import {IonSelect, IonSelectOption, withIonLifeCycle} from "@ionic/react";
import {Component, SetStateAction, useCallback, useContext, useEffect, useState} from "react";
import {AuthContext} from "../Auth";
import {collection, getDocs, getFirestore} from "firebase/firestore";
import {onAuthStateChanged} from "firebase/auth";

interface ContainerProps {
}

interface Group {
    id: string,
    name: string
}

interface State {
    groups: Group[]
}

// const auth = useContext(AuthContext);
const db = getFirestore();

interface PickerProps {
    onPickGroup: Function;
}

const GroupPicker: React.FC<PickerProps> = ({onPickGroup}) => {
    const [groups, setGroups] = useState<Group[]>();
    const ctx = useContext(AuthContext);

    const fetchGroups = useCallback(async () => {
        const docs = await getDocs(collection(db, "groups"))
        const val: Group[] = [];
        docs.forEach(doc => {
            if(doc.data().members.includes(ctx?.userId)) {
                val.push({id: doc.id, name: doc.data().name})
            }
        });
        setGroups(val);
    }, [ctx?.userData, groups]) // if userId changes, useEffect will run again
                 // if you want to run only once, just leave array empty []

    useEffect(() => {
        fetchGroups()
    }, [fetchGroups, groups]);

    if (ctx?.loggedIn) {
        return (
            <IonSelect okText="Confirm" cancelText="Dismiss" onIonChange={e=>onPickGroup(e.detail.value!)}>
                {groups?.map((group: Group) => (<IonSelectOption value={group.id} key={group.id}>{group.name}</IonSelectOption>))}
            </IonSelect>
        );
    } else {
        return (<IonSelect></IonSelect>)
    }
}

export default GroupPicker;
