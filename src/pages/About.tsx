import {
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar, IonBackButton, IonCard, IonCardHeader, /* IonCardContent,  */IonCardSubtitle, IonCardTitle
} from "@ionic/react";
import "./Group.css";
import React from "react";

const AboutPage: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" />
          </IonButtons>
          <IonTitle>About</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <h1>About FriendAdvisor</h1>
        <p>Planning events with friends just got easier! With just a few taps, you can create an event, invite friends, and share updates. Plus, you get reminders through notifications on your phone, so you never forget an important event again! Say goodbye to forgetting your significant other&lsquo;s anniversary or your mother&lsquo;s birthday.</p>
        <p>We know that life can get busy, so we make it easy for you to stay on top of your plans. Plus, our app is available through both your internet browser or as an app on your mobile device. No more excuses!</p>
        <p>Whether you&lsquo;re planning a birthday party, a weekend getaway, or just a night out, FriendAdvisor makes it easy for you and your friends to stay connected.</p>
        <p>FriendAdvisor was a project originally created at a <a target="_blank" href="https://devpost.com/software/friendadvisor" rel="noreferrer">hackathon</a>, but we&lsquo;ve decided to continue developing it.</p>
        <IonCard target="_blank" href="https://www.linkedin.com/in/alexis-kaufman-b27774118/">
          <IonCardHeader>
            <IonCardSubtitle>Developer & Founder</IonCardSubtitle>
            <IonCardTitle>Alexis Kaufman</IonCardTitle>
          </IonCardHeader>
        </IonCard>
        <IonCard target="_blank" href="https://www.linkedin.com/in/max-hogan-ba9650223/">
          <IonCardHeader>
            <IonCardSubtitle>Developer & Founder</IonCardSubtitle>
            <IonCardTitle>Max Hogan</IonCardTitle>
          </IonCardHeader>
        </IonCard>
        <IonCard target="_blank" href="https://www.linkedin.com/in/adam-szumski/">
          <IonCardHeader>
            <IonCardSubtitle>Developer & Founder</IonCardSubtitle>
            <IonCardTitle>Adam Szumski</IonCardTitle>
          </IonCardHeader>
        </IonCard>
        <IonCard target="_blank" href="https://www.linkedin.com/in/bradwj/">
          <IonCardHeader>
            <IonCardSubtitle>Developer & Founder</IonCardSubtitle>
            <IonCardTitle>Bradley Johnson</IonCardTitle>
          </IonCardHeader>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default AboutPage;
