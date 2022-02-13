import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonButton, IonModal,  } from '@ionic/react';
import './Home.css';
import {useCallback, useContext, useEffect, useState} from "react";
import {collection, getDocs, getFirestore} from "firebase/firestore";
import {AuthContext} from "../Auth";
import MapPicker from 'react-google-map-picker';

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
    const [showModal, setShowModal] = useState(false);

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
          {events?.map(event => (
            <IonItem key={event.id}>
              <IonLabel>
                <h1>{event.name}</h1>
                <h3>{new Date(event.datetime.seconds * 1000).toDateString()}</h3>
                <p>{event.description}</p>
                <IonButton href={'groups/'+event.groupId}>Group</IonButton>
                <IonButton onClick={() => setShowModal(true)}>Location</IonButton>
                    <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
                        <MapPicker defaultLocation={{lat: event.lat, lng: event.long}}
                                   zoom={10}
                                   style={{height:'700px'}}
                                   apiKey='AIzaSyCE1vNf10CzWmZ3WGSLMr3wRF3WggzR8QA'/>
                        <IonButton onClick={() => setShowModal(false)}>Close</IonButton>
                    </IonModal>
              </IonLabel>
            </IonItem>
          ))}
        </IonList>

      </IonContent>
    </IonPage>
  );
};

export default Home;
