import {
  IonAvatar,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonToolbar
} from "@ionic/react";
import { RouteComponentProps, useHistory } from "react-router";
import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../Auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { arrowBack } from "ionicons/icons";
import "./User.css";

interface User {
    id: string,
    name: string,
    likes: string,
    dislikes: string,
    phone: number,
    dob: string
}

const db = getFirestore();

const UserPage: React.FC<RouteComponentProps> = ({ match }) => {
  const [user, setUser] = useState<User>();
  const history = useHistory();
  const ctx = useContext(AuthContext);

  // @ts-ignore
  const id = match.params.id;

  const fetchUser = async (id: string) => {
    console.log("fetchUser");
    const userEntry = await getDoc(doc(db, "users", `${id}`));
    if (userEntry.exists()) {
      const { name, likes, dislikes, dob, phone } = userEntry.data();
      setUser({ name, likes, dislikes, dob, phone, id: userEntry.id });
    } else {
      history.goBack();
    }
  };

  useEffect(() => {
    if (ctx?.loggedIn) fetchUser(id);
  }, [ctx]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons>
            <IonButtons slot="start">
              <IonButton onClick={() => history.goBack()} size="large"><IonIcon size="large" icon={arrowBack}></IonIcon></IonButton>
            </IonButtons>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent hidden={user === undefined} fullscreen>
        <div className="center">
          <IonAvatar slot="start">
            <img src={`https://picsum.photos/seed/${user?.id}/200/200`} />
          </IonAvatar>
          <h1>{user?.name}</h1>
          <p>Likes {user?.likes}</p>
          <p>Dislikes {user?.dislikes}</p>
          <p>{user?.phone}</p>
          <p>{user?.dob}</p>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default UserPage;
