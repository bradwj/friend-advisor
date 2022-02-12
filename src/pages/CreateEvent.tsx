import {
    IonContent,
    IonHeader,
    IonItem,
    IonLabel,
    IonPage,
    IonTitle,
    IonToolbar,
    IonInput,
    IonTextarea
} from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './CreateEvent.css';
import MapPicker from 'react-google-map-picker'
import { AuthContext } from "../Auth";
import {SetStateAction, useContext, useState} from "react";

const DefaultLocation = { lat: 35.2058936, lng: -97.4479024};
const DefaultZoom = 10;



const Home: React.FC = () => {
    const [eventName, setEventName] = useState<string>();
    const [eventDesc, setEventDesc] = useState<string>();
    const [eventDate, setEventDate] = useState<string>();

    const [defaultLocation, setDefaultLocation] = useState(DefaultLocation);

    const [location, setLocation] = useState(defaultLocation);
    const [zoom, setZoom] = useState(DefaultZoom);

    function handleChangeLocation(lat: any, lng: any) {
        setLocation({lat: lat, lng: lng});
    }

    function handleChangeZoom(newZoom: number){
        setZoom(newZoom);
    }

    function handleResetLocation(){
        setDefaultLocation({ ... DefaultLocation});
        setZoom(DefaultZoom);
    }


    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Create Event</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">Home</IonTitle>
                    </IonToolbar>
                </IonHeader>          {JSON.stringify(useContext(AuthContext))}
                <IonItem>
                    <IonLabel>Name</IonLabel>
                    <IonInput value={eventName} onIonChange={e => setEventName(e.detail.value!)}/>
                </IonItem>
                <IonItem>
                    <IonLabel>Description</IonLabel>
                    {/*<IonInput value={eventDesc} onIonChange={e => setEventDesc(e.detail.value!)}/>*/}
                    <IonTextarea value={eventDesc} onIonChange={e => setEventDesc(e.detail.value!)}/>
                </IonItem>
                <IonItem>
                    <IonLabel>Date</IonLabel>
                    <IonInput type="datetime-local" value={eventDate} onIonChange={e => setEventDate(e.detail.value!)}/>
                </IonItem>
                {/*<button onClick={handleResetLocation}>Reset Location</button>*/}
                {/*<label>Latitute:</label><input type='text' value={location.lat} disabled/>
                <label>Longitute:</label><input type='text' value={location.lng} disabled/>
                <label>Zoom:</label><input type='text' value={zoom} disabled/>*/}

                <MapPicker defaultLocation={defaultLocation}
                           zoom={zoom}
                           style={{height:'700px'}}
                           onChangeLocation={handleChangeLocation}
                           onChangeZoom={handleChangeZoom}
                               apiKey='AIzaSyCE1vNf10CzWmZ3WGSLMr3wRF3WggzR8QA'/>
            </IonContent>
        </IonPage>
    );
};

export default Home;
