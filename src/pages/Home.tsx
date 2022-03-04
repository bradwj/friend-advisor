import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardTitle,
  IonCardSubtitle,
  IonCardHeader,
  IonIcon, IonFabButton, IonFab, IonProgressBar
} from "@ionic/react";
import React, { useContext, useEffect, useState } from "react";
import { getFirestore, deleteDoc, doc } from "firebase/firestore";
import { AuthContext } from "../Auth";
import { useHistory } from "react-router";
import { appendToCache } from "../cache_manager";
import RelativeDate from "../components/RelativeDate";
import { fetchWithAuth } from "../lib/fetchWithAuth";
import { add, locationOutline } from "ionicons/icons";

interface Event {
  datetime: any,
  description: string,
  location: string,
  name: string,
  id: string,
  groupId: string,
  groupName: string
}

// noinspection JSUnusedLocalSymbols
interface Group { // eslint-disable-line no-unused-vars
  id: string,
  name: string,
  members: string[]
}

export const fetchEvents = async (auth: any) => {
  console.log("fetchEvents");
  const lastCachedUserEvents: number = JSON.parse(window.localStorage.getItem("lastCachedUserEvents") || "0");

  const req = await fetchWithAuth(auth, `events/all?lastUpdated=${lastCachedUserEvents}`, {
    method: "GET"
  });

  const resp:{ events: any[]; message?: string; } = await req.json();

  if (!resp.message) {
    resp.events.forEach(event => {
      appendToCache("userEvents", event);
    });
  } else console.log(resp.message);

  window.localStorage.setItem("lastCachedUserEvents", `${Date.now()}`);
  return new Promise<Array<Event>>(resolve => resolve(JSON.parse(window.localStorage.getItem("userEvents") || "[]")));
};

const db = getFirestore();

const Home: React.FC = () => {
  const [events, setEvents] = useState<Event[]>(JSON.parse(window.localStorage.getItem("userEvents") || "[]"));
  const ctx = useContext(AuthContext);
  const history = useHistory();

  useEffect(() => {
    if (ctx?.loggedIn) {
      fetchEvents(ctx).then(userEvents => {
        setEvents(userEvents);
      });
    }
  }, [ctx]);

  async function removeEvent (id: string) {
    console.log("removing event");

    await deleteDoc(doc(db, "events", id));

    history.push("/home");
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Events</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {events
          ? <>
            <IonList>
              {events?.sort((a, b) => (a.datetime.seconds || a.datetime._seconds) - (b.datetime.seconds || b.datetime._seconds)).map(event => (
                <IonCard button href={"events/" + event.id} key={event.id}>
                  <IonCardHeader>
                    <IonCardTitle>{event.name}</IonCardTitle>
                    <IonCardSubtitle>
                      {event.groupName} &bull; <RelativeDate date={new Date((event.datetime.seconds || event.datetime._seconds) * 1000)}/>
                    </IonCardSubtitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <p>{event.description || ""}</p>
                    {event.location && <p><IonIcon icon={locationOutline}/> {event.location}</p>}
                    <br/>
                    <IonButton size="default" href={"groups/" + event.groupId}>Group</IonButton>
                    <IonButton size="default" color="danger" onClick={async (e) => {
                      e.preventDefault(); // cancel link of outer card element
                      await removeEvent(event.id);
                    }}>Remove</IonButton>
                  </IonCardContent>
                </IonCard>
              ))}
            </IonList>
            <IonFab vertical="bottom" horizontal="center" slot="fixed">
              <IonFabButton href="/create-event">
                <IonIcon icon={add}/>
              </IonFabButton>
            </IonFab>
          </>
          : <IonProgressBar type="indeterminate"/>
        }
      </IonContent>
    </IonPage>
  );
};

export default Home;
