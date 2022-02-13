import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonButton, IonModal, IonCard, IonCardContent, IonCardTitle, IonCardSubtitle, IonCardHeader,  } from '@ionic/react';
import './Home.css';
import {useCallback, useContext, useEffect, useState} from "react";
import {collection, getDocs, getFirestore, deleteDoc, doc} from "firebase/firestore";
import {AuthContext} from "../Auth";
import {useHistory} from "react-router";

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
    const [events, setEvents] = useState<Event[]>();
    const ctx = useContext(AuthContext);
    const history = useHistory();

    const fetchGroups = useCallback(async () => {
        const docs = await getDocs(collection(db, "groups"));
        const val: GroupWithEvents[] = [];

        const groupsImIn:string[] = [];
        docs.forEach(doc => {
            if(doc.data().members.includes(ctx?.userId)) {
                groupsImIn.push(doc.id);
            }
        });

        const events:Event[] = [];

        const eventsDocs = await getDocs(collection(db, "events"));

        eventsDocs.forEach(event => {
            if(groupsImIn.includes(event.data().groupId)){
                const {datetime, description, lat, long, name, groupId} = event.data();
                events.push({datetime, description, lat, long, name, id: event.id, groupId });
            }
        });

        setEvents(events);
    }, [ctx?.userData]); // if userId changes, useEffect will run again
    // if you want to run only once, just leave array empty []

    useEffect(() => {
        fetchGroups();
    }, [fetchGroups]);

    async function removeEvent(id:string){
        await deleteDoc(doc(db, "events", id));
        await fetchGroups();

        history.push("/events");
    }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Events</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonList>
            <IonButton expand="block" href="/create-event">Create Event</IonButton>
          {events?.sort((a, b) => a.datetime.seconds - b.datetime.seconds).map(event => (
            <IonCard button href={'events/'+event.id} key={event.id}>
                <IonCardHeader>
                  <IonCardTitle>{event.name}</IonCardTitle>
                  <IonCardSubtitle>{new Date(event.datetime.seconds * 1000).toDateString()}</IonCardSubtitle>
                </IonCardHeader>
                <IonCardContent>
                  <p>{event.description}</p>
                  <br />
                  <IonButton size="default" href={'groups/'+event.groupId}>Group</IonButton>
                  <IonButton size="default" color="danger" onClick={() => removeEvent(event.id)}>Remove</IonButton>
                </IonCardContent>
            </IonCard>
          ))}
        </IonList>

      </IonContent>
    </IonPage>
  );
};

export default Home;
