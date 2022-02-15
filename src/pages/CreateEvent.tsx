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
  IonModal,
  IonRadioGroup,
  IonRadio
} from "@ionic/react";
import "./CreateEvent.css";
import MapPicker from "react-google-map-picker";
import { AuthContext } from "../Auth";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router";
import { collection, getDocs, getFirestore } from "firebase/firestore";

const DefaultLocation = { lat: 35.2058936, lng: -97.4479024 };
const DefaultZoom = 10;
const db = getFirestore();

interface Group {
    id: string,
    name: string
}

const Home: React.FC = () => {
  const ctx = useContext(AuthContext);
  const [eventName, setEventName] = useState<string>();
  const [eventDesc, setEventDesc] = useState<string>();
  const [eventDate, setEventDate] = useState<string>();
  const [groupId, setGroupId] = useState<string>();
  const [groups, setGroups] = useState<Group[]>();
  const [showModal, setShowModal] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(false);

  // const [defaultLocation, setDefaultLocation] = useState(DefaultLocation);

  const [location, setLocation] = useState(DefaultLocation);
  const [zoom, setZoom] = useState(DefaultZoom);

  const history = useHistory();

  const fetchGroups = useCallback(async () => {
    const docs = await getDocs(collection(db, "groups"));
    const val: Group[] = [];
    docs.forEach(doc => {
      if (doc.data().members.includes(ctx?.userId)) {
        val.push({ id: doc.id, name: doc.data().name });
      }
    });
    console.log("values", val);
    setGroups(val);
  }, [ctx?.userData]); // if userId changes, useEffect will run again
  // if you want to run only once, just leave array empty []

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups, ctx?.userData]);

  function handleChangeLocation (lat: any, lng: any) {
    setLocationEnabled(true);
    setLocation({ lat: lat, lng: lng });
  }

  function handleChangeZoom (newZoom: number) {
    setZoom(newZoom);
  }

  // function handleResetLocation () {
  //   setDefaultLocation({ ...DefaultLocation });
  //   setZoom(DefaultZoom);
  // }

  async function submit () {
    const basePath = process.env.NODE_ENV === "development" ? "http://localhost:5001/friend-advisor/us-central1/app" : "https://us-central1-friend-advisor.cloudfunctions.net/app";
    if (locationEnabled) {
      await fetch(`${basePath}/events/create?groupId=${groupId}&datetime=${eventDate && new Date(eventDate).toISOString()}&name=${eventName}&description=${eventDesc}&lat=${location.lat}&long=${location.lng}`, {
        method: "POST"
      });
    } else {
      await fetch(`${basePath}/events/create?groupId=${groupId}&datetime=${eventDate && new Date(eventDate).toISOString()}&name=${eventName}&description=${eventDesc}`, {
        method: "POST"
      });
    }

    history.push("/home");
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Create Event</IonTitle>
        </IonToolbar>
      </IonHeader>
        <IonContent fullscreen>
          <IonItem>
            <IonLabel>Name</IonLabel>
            <IonInput value={eventName} onIonChange={e => setEventName(e.detail.value!)}/>
          </IonItem>
          <IonItem>
            <IonLabel>Group</IonLabel>
            <IonRadioGroup value={groupId} onIonChange={e => setGroupId(e.detail.value)}>
              {/* <IonListHeader>
                  <IonLabel>Group</IonLabel>
              </IonListHeader> */}
              {groups?.map((group: Group) => (
              <IonItem key={group.id}>
                <IonLabel>{group.name}</IonLabel>
                <IonRadio slot="start" value={group.id} />
              </IonItem>)
              )}
            </IonRadioGroup>
            {/* <IonSelect okText="Confirm" cancelText="Dismiss" onIonChange={e=>setGroupId(e.detail.value!)}>
                {groups?.map((group: Group) => (<IonSelectOption value={group.id} key={group.id}>{group.name}</IonSelectOption>))}
            </IonSelect> */}
          </IonItem>
          <IonItem>
            <IonLabel>Description</IonLabel>
            {/* <IonInput value={eventDesc} onIonChange={e => setEventDesc(e.detail.value!)}/> */}
            <IonTextarea value={eventDesc} onIonChange={e => setEventDesc(e.detail.value!)}/>
          </IonItem>
          <IonItem>
            <IonLabel>Date</IonLabel>
            <IonInput type="datetime-local" value={eventDate} onIonChange={e => setEventDate(e.detail.value!)}/>
          </IonItem>
            {/* <button onClick={handleResetLocation}>Reset Location</button> */}
          {locationEnabled
            ? <IonItem>
                Location: {location.lat}, {location.lng}
                <IonButton color="secondary" onClick={() => setShowModal(true)}>Edit Location</IonButton>
                <IonButton color="danger" onClick={() => setLocationEnabled(false)}>Remove</IonButton>
              </IonItem>
            : <IonItem>
                <IonButton onClick={() => setShowModal(true)}>Pick Location</IonButton>
              </IonItem>}
            <IonModal isOpen={showModal} onDidDismiss={() => {
              setShowModal(false);
              setLocationEnabled(true);
            }}>
              <MapPicker defaultLocation={location}
                          zoom={zoom}
                          style={{ height: "700px" }}
                          onChangeLocation={handleChangeLocation}
                          onChangeZoom={handleChangeZoom}
                          apiKey="AIzaSyCE1vNf10CzWmZ3WGSLMr3wRF3WggzR8QA"/>
              <IonButton onClick={() => {
                setShowModal(false);
                setLocationEnabled(true);
              }}>
                Close
              </IonButton>
            </IonModal>
            <IonButton disabled={!eventName || !eventDate || !groupId} onClick={submit} expand="block" color="primary">Create Event</IonButton>
        </IonContent>
    </IonPage>
  );
};

export default Home;
