import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonRouterLink } from '@ionic/react';
import './Home.css';
import {useCallback, useContext, useEffect, useState} from "react";
import {collection, getDocs, getFirestore} from "firebase/firestore";
import {AuthContext} from "../Auth";

interface Event{
    datetime: any,
    description: string,
    lat: number,
    long: number,
    name: string,
    id: string,
    groupId: string
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
                const {datetime, description, lat, long, name, groupId, id} = event.data();
                events.push({datetime, description, lat, long, name, id, groupId });
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
          <IonTitle>Events</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Home</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonList>
          {events?.map(event => (
            <IonItem key={event.id}>
              <IonLabel>
                <h1>{event.name}</h1>
                <h3>{new Date(event.datetime.seconds * 1000).toDateString()}</h3>
                <p>{event.description}</p>
                <IonRouterLink href={'groups/'+event.groupId}>Group</IonRouterLink>
              </IonLabel>
            </IonItem>
          ))}
        </IonList>
        
      </IonContent>
    </IonPage>
  );
};

export default Home;
