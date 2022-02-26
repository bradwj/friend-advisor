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
import { arrowBack } from "ionicons/icons";

export interface User {
    userId: string,
    name: string,
    likes: string,
    dislikes: string,
    phone: number,
    dob: string,
    lastUpdated: number
}

const fetchUserInGroup = async (userId: string) => {
  console.log("fetchUser");
  const cachedUsers: User[] = JSON.parse(window.localStorage.getItem("cachedUsers") || "[]");
  const user = cachedUsers.find(user => user.userId === userId);
  if (user) {
    return Promise.resolve(user);
  } else {
    return Promise.reject(new Error("user not found"));
  }
};

const UserPage: React.FC<RouteComponentProps> = ({ match }) => {
  const [user, setUser] = useState<User>();
  const history = useHistory();
  const ctx = useContext(AuthContext);

  // @ts-ignore
  const id = match.params.id;

  useEffect(() => {
    if (ctx?.loggedIn) {
      fetchUserInGroup(id).then(result => {
        setUser(result);
      }, reason => {
        console.log(reason);
      });
    }
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
            <img src={`https://picsum.photos/seed/${user?.userId}/200/200`} />
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
