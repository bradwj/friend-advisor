import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonItem,
  IonLabel,
  IonButton,
  IonTextarea, IonInput, IonButtons, IonBackButton, IonProgressBar
} from "@ionic/react";
import React, { useContext, useEffect, useState } from "react";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { AuthContext } from "../Auth";
import { RouteComponentProps, useHistory } from "react-router";
// import { fetchEvents } from "./Home";
import RelativeDate from "../components/RelativeDate";
import { fetchWithAuth } from "../lib/fetchWithAuth";

interface Event {
  datetime: any,
  description: string,
  location: string,
  name: string,
  id: string,
  groupId: string,
  archived: boolean | undefined
}

const db = getFirestore();

export const fetchEvent = async (eventId: any, auth: any) => {
  console.log("fetchEvent");
  const events = JSON.parse(window.localStorage.getItem("userEvents") || "[]");
  const event = events.find((event: any) => event.id === eventId);

  return new Promise<Event>((resolve, reject) => {
    if (event) {
      resolve(event);
    } else {
      reject(new Error("Event not found!"));
    }
  });
};

const EventPage: React.FC<RouteComponentProps> = ({ match }) => {
  const [event, setEvent] = useState<Event>();
  const [editing, setEditing] = useState<boolean>(false);
  const ctx = useContext(AuthContext);
  const [eventName, setEventName] = useState<string>();
  const [eventArchived, setEventArchived] = useState<boolean | undefined>();
  const [eventDesc, setEventDesc] = useState<string>();
  const [eventLocation, setEventLocation] = useState<string>();
  const [eventDate, setEventDate] = useState<string>();
  const history = useHistory();

  // @ts-ignore
  const id = match.params.id;

  console.log(event);

  useEffect(() => {
    if (ctx?.loggedIn) {
      fetchEvent(id, ctx).then(data => {
        setEventName(data.name);
        setEventDate(data.datetime);
        setEventDesc(data.description);
        setEventLocation(data.location);
        setEventArchived(data.archived);

        setEvent(data);
      }, reason => {
        console.log(reason);
        history.push("/home");
      });
    }
  }, [ctx]);

  function getDefaultVal () {
    console.log(event?.datetime);
    let now = event && event.datetime && event.datetime.toDate();
    if (!now) now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, -1);
  }

  async function archiveEvent () {
    await fetchWithAuth(ctx, `events/edit?id=${event?.groupId}&eventId=${event?.id}&archived=true`, {
      method: "PATCH"
    });

    setEventArchived(true);
  }

  async function unArchiveEvent () {
    await fetchWithAuth(ctx, `events/edit?id=${event?.groupId}&eventId=${event?.id}&archived=false`, {
      method: "PATCH"
    });

    setEventArchived(false);
  }

  async function saveEvent () {
    await setDoc(doc(db, "events", id), {
      name: eventName,
      description: eventDesc,
      datetime: eventDate,
      location: eventLocation,
      lastUpdated: Date.now()
    }, { merge: true });
    setEditing(false);
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home"/>
          </IonButtons>
          <IonTitle>Event Info</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {event
          ? (editing
              ? <>
                <IonItem>
                  <IonLabel>Name</IonLabel>
                  <IonInput value={eventName} onIonChange={e => setEventName(e.detail.value!)}/>
                </IonItem>
                <IonItem>
                  <IonLabel>Date</IonLabel>
                  <IonInput type="datetime-local" value={getDefaultVal()}
                            onIonChange={e => setEventDate(e.detail.value!)}/>
                </IonItem>
                <IonItem>
                  <IonLabel>Description</IonLabel>
                  <IonTextarea value={eventDesc} onIonChange={e => setEventDesc(e.detail.value!)}/>
                </IonItem>
                <IonItem>
                  <IonLabel>Location</IonLabel>
                  <IonTextarea value={eventLocation} onIonChange={e => setEventLocation(e.detail.value!)}/>
                </IonItem>
              </>
              : <>
                <h1>{event?.name}</h1>
                <h3>{event && <RelativeDate date={new Date((event.datetime.seconds || event.datetime._seconds) * 1000)}/>}</h3>
                <p>{event?.description || ""}</p>
                {event?.location && <><h3>Location</h3>
                  <p>{event?.location || ""}</p></>}
              </>)
          : <IonProgressBar type="indeterminate"/>
        }

        {editing
          ? <><IonButton size="default" color="secondary" onClick={() => setEditing(false)}>Cancel</IonButton>
            <IonButton size="default" color="success" onClick={saveEvent}>Save</IonButton> </>
          : <><IonButton
          size="default" href={"groups/" + event?.groupId}>Group</IonButton> <IonButton size="default" color="secondary"
                                                                                        onClick={() => setEditing(true)}>Edit</IonButton> </>}
        {eventArchived ? <IonButton size="default" color="success" onClick={unArchiveEvent}>Unarchive</IonButton> : <IonButton size="default" color="danger" onClick={archiveEvent}>Archive</IonButton>}
      </IonContent>
    </IonPage>
  );
};

export default EventPage;
