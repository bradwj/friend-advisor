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
import {ellipse, square, triangle} from 'ionicons/icons';
import AddFriend from './pages/AddFriend';
import Home from './pages/Home';
import Tab3 from './pages/Tab3';

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
                        <Route exact path="/addfriend">
                            <AddFriend/>
                        </Route>
                        <Route exact path="/home">
                            <Home/>
                        </Route>
                        <Route path="/tab3">
                            <Tab3/>
                        </Route>
                        <Route path="/create-event">
                            <CreateEvent/>
                        </Route>
                        <Route exact path="/">
                            <Redirect to="/home"/>
                        </Route>
                    </IonRouterOutlet>
                    <IonTabBar slot="top">
                        <IonTabButton tab="addfriend" href="/addfriend">
                            <IonIcon icon={triangle}/>
                            <IonLabel>Add Friend</IonLabel>
                        </IonTabButton>
                        <IonTabButton tab="home" href="/home">
                            <IonIcon icon={ellipse}/>
                            <IonLabel>Home</IonLabel>
                        </IonTabButton>
                        <IonTabButton tab="tab3" href="/tab3">
                            <IonIcon icon={square}/>
                            <IonLabel>Tab 3</IonLabel>
                        </IonTabButton>
                    </IonTabBar>
                </IonTabs>
            </IonReactRouter>
        </AuthContext.Provider>
    </IonApp>;
};

export default App;
