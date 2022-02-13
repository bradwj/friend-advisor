import {Redirect, Route} from 'react-router-dom';
import {
    IonApp,
    IonIcon,
    IonLabel,
    IonRouterOutlet,
    IonTabBar,
    IonTabButton,
    IonTabs,
    setupIonicReact
} from '@ionic/react';
import {useAuthInit, AuthContext} from "./Auth";
import {IonReactRouter} from '@ionic/react-router';
import {calendarNumberOutline, ellipse, peopleCircleOutline, personCircleOutline, square, squareOutline, triangle, triangleOutline} from 'ionicons/icons';
import Home from './pages/Home';
import SignIn from './pages/SignIn';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';


/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import CreateEvent from "./pages/CreateEvent";
import Profile from './pages/Profile';
import JoinGroup from './pages/JoinGroup';
import Group from "./pages/Group";
import Groups from "./pages/Groups";

setupIonicReact();

const App: React.FC = () => {
    const {auth} = useAuthInit();
    if (auth) {
        console.log("logged in", auth);
    }


    return <IonApp>
        <AuthContext.Provider value={auth}>
            <IonReactRouter>
                <IonTabs>
                    <IonRouterOutlet>
                        <Route exact path="/profile">
                            <Profile />
                        </Route>
                        <Route exact path="/joingroup">
                            <JoinGroup />
                        </Route>
                        <Route exact path="/signin">
                            <SignIn />
                        </Route>
                        <Route exact path="/home">
                            <Home/>
                        </Route>
                        <Route path="/create-event">
                            <CreateEvent/>
                        </Route>
                        <Route path="/groups/:id" component={Group}></Route>
                        <Route path="/groups" exact component={Groups}></Route>
                        <Route exact path="/">
                            <Redirect to="/signin"/>
                        </Route>
                    </IonRouterOutlet>
                    { auth?.loggedIn ?
                    <IonTabBar slot="bottom">
                        <IonTabButton tab="events" href="/home">
                            <IonIcon icon={calendarNumberOutline}/>
                            <IonLabel>Events</IonLabel>
                        </IonTabButton>
                        <IonTabButton tab="groups" href="/groups">
                            <IonIcon icon={peopleCircleOutline}/>
                            <IonLabel>Groups</IonLabel>
                        </IonTabButton>
                        <IonTabButton tab="profile" href="/profile">
                            <IonIcon icon={personCircleOutline}/>
                            <IonLabel>Profile</IonLabel>
                        </IonTabButton>
                    </IonTabBar>
                    : <IonTabBar></IonTabBar>}
                </IonTabs>
            </IonReactRouter>
        </AuthContext.Provider>
    </IonApp>;
};

export default App;
