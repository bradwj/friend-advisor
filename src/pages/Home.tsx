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
  IonIcon, IonFabButton, IonFab
} from "@ionic/react";
import React, { useContext, useEffect, useState } from "react";
import { collection, getDocs, getFirestore, deleteDoc, doc, query, where } from "firebase/firestore";
import { AuthContext } from "../Auth";
import { useHistory } from "react-router";
import { appendToCache } from "../cache_manager";
import { fetchGroups } from "./Groups";
import RelativeDate from "../components/RelativeDate";
import { add } from "ionicons/icons";

interface Event{
    datetime: any,
    description: string,
    lat: number,
    long: number,
    name: string,
    id: string,
    groupId: string
}

// noinspection JSUnusedLocalSymbols
interface Group { // eslint-disable-line no-unused-vars
  id: string,
  name: string,
  members: string[]
}

export const fetchEvents = async (userId: any) => {
  console.log("fetchEvents");
  const lastCachedUserEvents: number = JSON.parse(window.localStorage.getItem("lastCachedUserEvents") || "0");
  const groupsImIn = await fetchGroups(userId);
  const groupIds = groupsImIn.map(group => group.id);

  const eventPromises = [];
  for (const group of groupsImIn) {
    eventPromises.push(getDocs(query(collection(db, "events"), where("groupId", "==", group.id), where("lastUpdated", ">", lastCachedUserEvents))));
  }

  const snapshots = await Promise.all(eventPromises);
  snapshots.forEach(snap => {
    snap.forEach(doc => {
      if (groupIds.includes(doc.data().groupId)) {
        const { datetime, description, lat, long, name, groupId } = doc.data();
        const event = { datetime, description, lat, long, name, id: doc.id, groupId };
        appendToCache("userEvents", event);
      }
    });
  });

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
      fetchEvents(ctx.userId).then(userEvents => {
        setEvents(userEvents);
      });
    }
  }, [ctx]);

  async function removeEvent (id:string) {
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
        <IonList>
          {events?.sort((a, b) => a.datetime.seconds - b.datetime.seconds).map(event => (
            <IonCard button href={"events/" + event.id} key={event.id}>
              <IonCardHeader>
                <IonCardTitle>{event.name}</IonCardTitle>
                <IonCardSubtitle>
                  <RelativeDate date={new Date(event.datetime.seconds * 1000)}/>
                </IonCardSubtitle>
              </IonCardHeader>
              <IonCardContent>
                <p>{event.description || ""}</p>
                <br />
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
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default Home;
