import React, { useRef, useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import './App.css';

import logo from './logo192.png';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';


import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  // your config
  apiKey: "AIzaSyCkhRupu9UEiCIAmU-mkzHD7nSxtvSO1_w",
  authDomain: "hacktx2020-fd108.firebaseapp.com",
  databaseURL: "https://hacktx2020-fd108.firebaseio.com",
  projectId: "hacktx2020-fd108",
  storageBucket: "hacktx2020-fd108.appspot.com",
  messagingSenderId: "592100453172",
  appId: "1:592100453172:web:f619ee417c1bc9c0901361",
  measurementId: "G-LRQH2JVW1D"

})

const auth = firebase.auth();
const firestore = firebase.firestore();
const analytics = firebase.analytics();

const useStyles = makeStyles({
  root: {
    minWidth: 275,

  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
    paddingLeft: 100,
    alignItems: 'flex-end'
  },
  pos: {
    marginBottom: 12,
  },
});


function App() {

  const [user] = useAuthState(auth);
  const [showChat, setShowChat] = useState(false);

  return (
    <div className="App">
      <header>
        <h1>Clutch!</h1>  
        <SignOut />
      </header>

      <section>
        <div styles="flex-direction:column">
          {user ? <IndexPage /> : <SignIn />}
        </div>
        
      </section>

    </div>
  );
}

function SignIn() {

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <>
      
        <div className="SignIn">
          <section>
            <img src = {logo}
            alt="Clutch"
            width="200px"
            className="center"
            style={{ alignSelf: 'center' }}
            />
            <button variant="primary" className="sign-in" onClick={signInWithGoogle}>Sign in with Google</button>

            <span style={{color:"white", textAlignVertical: "bottom"}}>Clutch, Inc</span>
          </section>
        </div>        
    </>
  )

}

function SignOut() {
  return auth.currentUser && (
    <button className="sign-out" onClick={() => auth.signOut()}>Sign Out</button>
  )
}


function IndexPage() {
  const classes = useStyles();
  const bull = <span className={classes.bullet}>•</span>;

  return (<>
           <Card className={classes.root}>
      <CardActions>
        <Button size="small">Shreyas Sood</Button>

        <Typography className={classes.title} color="textSecondary" gutterBottom >
          Food from Jester Cafeteria to Kins Dorms
        </Typography>
      </CardActions>
    </Card>

    <Card className={classes.root}>
      <CardActions>
        <Button size="small">Tom Smith</Button>
        <Typography className={classes.title} color="textSecondary" gutterBottom>
          Pasta from Rio Mart to 21 Rio apt.
        </Typography>
      </CardActions>
    </Card>

    <Card className={classes.root}>
      <CardActions>
        <Button size="small">Patrick Collison</Button>
        <Typography className={classes.title} color="textSecondary" gutterBottom>
          Advil form CVS to Quarters Nueces Apt.
        </Typography>
      </CardActions>
    </Card>

    <Card className={classes.root}>
      <CardActions>
        <Button size="small">Anant Bharadwaj</Button>
        <Typography className={classes.title} color="textSecondary" gutterBottom>
          Indian grocery for Riya from Patel Brothers
        </Typography>
      </CardActions>
    </Card>

    <Card className={classes.root}>
      <CardActions>
        <Button size="small">Mia Kat</Button>
        <Typography className={classes.title} color="textSecondary" gutterBottom>
          Wie Wie from Chaina Town for Jing Yuan
        </Typography>
      </CardActions>
    </Card>

    <Card className={classes.root}>
      <CardActions>
        <Button size="small">Shreya Kinhekar</Button>
        
        <Typography className={classes.title} color="textSecondary" gutterBottom>
          Word of the Day
        </Typography>
      </CardActions>
    </Card>

    <Card className={classes.root}>
      <CardActions>
        <Button size="small">Brandan Hale</Button>
        <Typography className={classes.title} color="textSecondary" gutterBottom>
          Masks for Imam
        </Typography>
      </CardActions>
    </Card>

    <Card className={classes.root}>
      <CardActions>
        <Button size="small">Laura Jaine</Button>
        <Typography className={classes.title} color="textSecondary" gutterBottom>
          i20 prints for Mariam
        </Typography>
      </CardActions>
    </Card>

    <Card className={classes.root}>
      <CardActions>
        <Button size="small">David Kim</Button>
        <Typography className={classes.title} color="textSecondary" gutterBottom>
          Detergent for Jammie
        </Typography>
      </CardActions>
    </Card>

    
  </>);
}


function ChatRoom() {
  const dummy = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, { idField: 'id' });

  const [formValue, setFormValue] = useState('');


  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }

  return (<>
    <main>

      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

      <span ref={dummy}></span>

    </main>

    <form onSubmit={sendMessage}>

      <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="say something nice" />

      <button type="submit" disabled={!formValue}>🕊️</button>

    </form>
  </>)
}


function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (<>
    <div className={`message ${messageClass}`}>
      <img src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} />
      <p>{text}</p>
    </div>
  </>)
}



export default App;
