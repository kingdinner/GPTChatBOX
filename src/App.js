import './App.css';
import React, { useState, lazy, Suspense } from 'react';
import axios from 'axios';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

import { useAuthState } from  'react-firebase-hooks/auth'

firebase.initializeApp({
  apiKey: "AIzaSyDmsUhSF3LN_M-evUVKxGGw7LGQohbHENc",
  authDomain: "chatgpt-df919.firebaseapp.com",
  projectId: "chatgpt-df919",
  storageBucket: "chatgpt-df919.appspot.com",
  messagingSenderId: "654576320086",
  appId: "1:654576320086:web:f52ba474e52fe7144345f7",
  measurementId: "G-1PTN97REGD"
})

const auth = firebase.auth()

function App() {

  const [user] = useAuthState(auth)

  return (
    <div className="App">
      <header className="App-header">
      <h1>Ask your question to Mr Karlo</h1>
      <p><SignOut /> </p>
        </header>

        <section>
          {user ? <ChatRoom /> : <SignIn />}
        </section>
    </div>
  );
}

const SignIn = () => {

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider()
    auth.signInWithPopup(provider)
  }

  return (
    <>
    <button className="sign-in" onClick={signInWithGoogle}>Sign in with Google</button>
    <p>Do not violate the community guidelines or you will be banned for life!</p>
    </>
  )
}

const SignOut = () => {
  return auth.currentUser && (
    <button className="sign-out" onClick={() => auth.signOut()}>Sign Out</button>
  )
}

function ChatRoom() {
  const [response, setResponse] = useState('');
  const [value, setValue] = React.useState("");

  const handleChange = event => {
    setValue(event.target.value);
  };


  const getGPT3Response = async (event) => {
    event.preventDefault();
    console.log(value)
    try {
      const result = await axios.post('https://api.openai.com/v1/engines/text-davinci-002/completions',
        {
          prompt: value,
          max_tokens: 100,
          n: 1,
          stop: "",
          temperature: 0.5
        },
        {
          headers: {
            'Authorization': 'Bearer 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',
            'Content-Type': 'application/json'
          }
        }
      );
      setResponse(result.data.choices[0].text);
      console.log(result.data.choices)
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <div>
      <form onSubmit={(event) => getGPT3Response(event)}>
      <input
        type="text"
        placeholder="Enter prompt here"
        value={value} onChange={handleChange}
      />
       <button type="submit">Submit</button>
      </form>
      <p>{response}</p>
    </div>
  );
  // return (
  // <>
  //   <main>
      
  //     {messages && messages.map(msg => <ChatMessage key={msg} message={msg} />)}

  //     <span ref={dummy}></span>

  //   </main>

  //   <form onSubmit={sendMessage}>

  //     <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="say something nice" />

  //     <button type="submit" disabled={!formValue}>🕊️</button>

  //   </form>
  // </>)
}


// function ChatMessage(props) {
//   const { text, uid, photoURL } = props.message;

//   const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

//   return (<>
//     <div className={`message ${messageClass}`}>
//       <img src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} />
//       <p>{text}</p>
//     </div>
//   </>)
// }

export default App;
