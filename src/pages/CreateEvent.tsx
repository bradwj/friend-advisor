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
  IonRadioGroup,
  IonRadio
} from "@ionic/react";
import { AuthContext } from "../Auth";
import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router";
import { Group } from "./Group";
import { fetchGroups } from "./Groups";
import { fetchWithAuth } from "../lib/fetchWithAuth";

const Home: React.FC = () => {
  const ctx = useContext(AuthContext);
  const [eventName, setEventName] = useState<string>();
  const [eventDesc, setEventDesc] = useState<string>();
  const [eventLocation, setEventLocation] = useState<string>();
  const [eventDate, setEventDate] = useState<string>();
  const [groupId, setGroupId] = useState<string>();
  const [groups, setGroups] = useState<Group[]>();

  const history = useHistory();

  useEffect(() => {
    if (ctx?.loggedIn) {
      fetchGroups(ctx).then(result => {
        setGroups(result);
      });
    }
  }, [ctx]);

  async function submit () {
    await fetchWithAuth(ctx, `events/create?id=${groupId}&datetime=${eventDate && new Date(eventDate).toISOString()}&name=${eventName}${eventDesc ? `&description=${eventDesc}` : ""}&location=${eventLocation || ""}`, {
      method: "POST"
    });

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
            {groups?.map((group: Group) => (
              <IonItem key={group.id}>
                <IonLabel>{group.name}</IonLabel>
                <IonRadio slot="start" value={group.id} />
              </IonItem>)
            )}
          </IonRadioGroup>
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
        <IonItem>
          <IonLabel>Location</IonLabel>
          <IonTextarea value={eventLocation} onIonChange={e => setEventLocation(e.detail.value!)}/>
        </IonItem>
        <IonButton disabled={!eventName || !eventDate || !groupId} onClick={submit} expand="block" color="primary">Create Event</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Home;
