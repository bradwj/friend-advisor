import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonList,
    IonItem,
    IonLabel,
    IonButton,
    IonModal,
    IonTextarea, IonInput,
} from '@ionic/react';
import './Home.css';
import {useCallback, useContext, useEffect, useState} from "react";
import {collection, getDocs, getFirestore, deleteDoc, doc, getDoc, setDoc} from "firebase/firestore";
import {AuthContext} from "../Auth";
import MapPicker from 'react-google-map-picker';
import {RouteComponentProps} from "react-router";

interface Event{
    datetime: any,
    description: string,
    lat: number,
    long: number,
    name: string,
    id: string,
    groupId: string
}

const db = getFirestore();

const Event: React.FC<RouteComponentProps> = ({match}) => {
    const [event, setEvent] = useState<Event>()
    const [editing, setEditing] = useState<boolean>(false);
    const ctx = useContext(AuthContext);
    const [showModal, setShowModal] = useState(false);
    const [eventName, setEventName] = useState<string>();
    const [eventDesc, setEventDesc] = useState<string>();
    const [eventDate, setEventDate] = useState<string>();
    const [location, setLocation] = useState<{lat: number, long: number}>();

    // @ts-ignore
    const id = match.params.id;

    const fetchEvent = useCallback(async () => {
        const event = await getDoc(doc(db, "events", id));
        const data = event.data() as Event;

        setEventName(data.name);
        setEventDate(data.datetime);
        setEventDesc(data.description);
        setLocation({lat: data.lat, long: data.long});

        setEvent(data);
    }, [ctx?.userData]); // if userId changes, useEffect will run again
    // if you want to run only once, just leave array empty []

    useEffect(() => {
        fetchEvent();
    }, [fetchEvent]);

    function getDefaultVal(){
        let now = event?.datetime && event?.datetime.toDate();
        if(!now) now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        return now.toISOString().slice(0, -1);
    }

    async function removeEvent(){
        await deleteDoc(doc(db, "events", id));
    }

    async function saveEvent(){
        if(location?.lat){
            await setDoc(doc(db, "events", id), {name: eventName, description: eventDesc, datetime: eventDate, lat: location?.lat, long: location?.long}, {merge: true});
        }else {
            await setDoc(doc(db, "events", id), {
                name: eventName,
                description: eventDesc,
                datetime: eventDate,
            }, {merge: true});
        }
        setEditing(false);
    }

    function handleChangeLocation(lat:number, long:number){
        console.log("setting location");
        setLocation({lat, long});
    }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Event Info</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
          {editing ? <>
              <IonItem>
                  <IonLabel>Name</IonLabel>
                  <IonInput value={eventName} onIonChange={e => setEventName(e.detail.value!)}/>
              </IonItem>
                  <IonItem>
                      <IonLabel>Date</IonLabel>
                      <IonInput type="datetime-local" value={getDefaultVal()} onIonChange={e => setEventDate(e.detail.value!)}/>
                  </IonItem>
              <IonItem>
                  <IonLabel>Description</IonLabel>
                  {/*<IonInput value={eventDesc} onIonChange={e => setEventDesc(e.detail.value!)}/>*/}
                  <IonTextarea value={eventDesc} onIonChange={e => setEventDesc(e.detail.value!)}/>
              </IonItem>
              </>
              : <>
                 <h1>{event?.name}</h1>
              <h3>{event && new Date(event.datetime.seconds * 1000).toDateString()}</h3>
              <p>{event?.description}</p>
              </>
          }

          {editing ? <>
          {location && location.lat && location.long ? <IonItem>
              Location: {location.lat}, {location.long}
              <IonButton color="secondary" onClick={() => setShowModal(true)}>Edit Location</IonButton>
              <IonButton color="danger" onClick={() => setLocation(undefined)}>Remove</IonButton>
          </IonItem>: <IonItem>
              <IonButton onClick={() => setShowModal(true)}>Pick Location</IonButton>
          </IonItem>
          }
                  <IonModal isOpen={showModal} onDidDismiss={() => {
                      setShowModal(false);
                  }}>
          <MapPicker defaultLocation={{ lat: location?.lat || 35.2058936, lng: location?.long || -97.4479024}}
                     zoom={10}
                     style={{height:'700px'}}
                     onChangeLocation={handleChangeLocation}
                     apiKey='AIzaSyCE1vNf10CzWmZ3WGSLMr3wRF3WggzR8QA'/>
          <IonButton onClick={() => {
                setLocation({ lat: location?.lat || 35.2058936, long: location?.long || -97.4479024});
              setShowModal(false);
          }}>Close</IonButton>
          </IonModal>
          </>
              : (location && (location.lat && location.long) ?
                  <>
                  {<MapPicker defaultLocation={{lat: location.lat, lng: location.long}}
                                 zoom={10}
                                 style={{height: '700px'}}
                                 onChangeLocation={()=>{}}
                                 apiKey='AIzaSyCE1vNf10CzWmZ3WGSLMr3wRF3WggzR8QA'/>}
                  </> : <IonItem><i>No location defined.</i></IonItem>)
          }

              {/*{editing &&  : <IonItem>
                      <IonButton onClick={() => setShowModal(true)}>Pick Location</IonButton>
                  </IonItem>}</>}*/}


          {editing ? <><IonButton size="default" color="secondary" onClick={() => setEditing(false)}>Cancel</IonButton> <IonButton size="default" color="success" onClick={saveEvent}>Save</IonButton> </> : <><IonButton size="default" href={'groups/'+event?.groupId}>Group</IonButton>  <IonButton size="default" color="secondary" onClick={() => setEditing(true)}>Edit</IonButton> </>}
        <IonButton size="default" color="danger" onClick={removeEvent}>Remove</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Event;
