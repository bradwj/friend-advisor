import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Home.css';
import {useCallback, useContext, useEffect, useState} from "react";
import {collection, getDocs, getFirestore} from "firebase/firestore";
import {AuthContext} from "../Auth";

interface Event{
    datetime: Date,
    description: string,
    lat: number,
    long: number,
    name: string,
}

interface GroupWithEvents {
    id: string,
    name: string,
    events: Event[]
}

const db = getFirestore();

const Home: React.FC = () => {
    const [events, setEvents] = useState<Event[]>()
    const ctx = useContext(AuthContext);

    const fetchGroups = useCallback(async () => {
        const docs = await getDocs(collection(db, "groups"))
        const val: GroupWithEvents[] = [];

        const groupsImIn:string[] = [];
        docs.forEach(doc => {
            if(doc.data().members.includes(ctx?.userId)) {
                groupsImIn.push(doc.id);
            }
        });

        const events:Event[] = [];

        const eventsDocs = await getDocs(collection(db, "events"))

        eventsDocs.forEach(event => {
            if(groupsImIn.includes(event.data().groupId)){
                const {datetime, description, lat, long, name} = event.data();
                events.push({datetime, description, lat, long, name});
            }
        });

        setEvents(events);
    }, [ctx?.userData]) // if userId changes, useEffect will run again
    // if you want to run only once, just leave array empty []

    useEffect(() => {
        fetchGroups()
    }, [fetchGroups]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Home</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Home</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ExploreContainer name="Home page" />
      </IonContent>
    </IonPage>
  );
};

export default Home;
