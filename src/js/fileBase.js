// Firebase App (the core Firebase SDK) is always required and must be listed first
import firebase from 'firebase/app';
import 'firebase/firestore';
// import 'firebase/auth';

// import { doc, getDoc } from 'firebase/firestore';

// TODO: Replace the following with your app's Firebase project configuration
// For Firebase JavaScript SDK v7.20.0 and later, `measurementId` is an optional field
const firebaseConfig = {
  apiKey: 'AIzaSyBEb1huf_meo1LJ-mMkHS6QuTVDhqJ5x3I',
  authDomain: 'filmoteka-9136d.firebaseapp.com',
  databaseURL:
    'https://filmoteka-9136d-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'filmoteka-9136d',
  storageBucket: 'filmoteka-9136d.appspot.com',
  messagingSenderId: '904812622933',
  appId: '1:904812622933:web:c5ae777769ec7ec58490dc',
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // if already initialized, use that one
}

const movieId = 'iteamMovie';
const moviesCollection = 'queue';

const db = firebase.firestore();

const user = firebase.auth().currentUser;

if (user) {
  // User is signed in, see docs for a list of available properties
  // https://firebase.google.com/docs/reference/js/firebase.User
  // ...
  console.log(user);
} else {
  // No user is signed in.
  console.log('No found');
}

// function fireBaseLibrary() {
//   firebase.auth().onAuthStateChanged(user => {
//     if (user) {
//       const uid = user.uid;
//       const docRef = db.collection(moviesCollection).doc(uid);
//     } else {
//       console.log('User is signed out');
//     }
//   });
// }

//add
function addMovieToLibrary(moviesCollection, movieId) {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      const uid = user.uid;
      const docRef = db.collection(moviesCollection).doc(uid);
      docRef
        .get()
        .then(doc => {
          if (doc.exists) {
            docRef
              .update({
                movieId: firebase.firestore.FieldValue.arrayUnion(movieId),
              })
              .then(function () {
                console.log('Document written.');
              })
              .catch(error => {
                console.error('Error adding document: ', error);
              });
          } else {
            docRef
              .set({
                movieId: firebase.firestore.FieldValue.arrayUnion(movieId),
              })
              .then(function () {
                console.log('Document written.');
              })
              .catch(error => {
                console.error('Error adding document: ', error);
              });
            console.log('Create new document!');
          }
        })
        .catch(error => {
          console.log('Error getting document:', error);
        });
    } else {
      console.log('User is signed out');
    }
  });
}
// get
function getMovieFromLibrary(moviesCollection) {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      const uid = user.uid;
      const docRef = db.collection(moviesCollection).doc(uid);
      docRef
        .get()
        .then(doc => {
          if (doc.exists) {
            const watchedMovies = doc.data().movieId;
            console.log('Document data:', watchedMovies);
          } else {
            // doc.data() will be undefined in this case
            console.log('No such document!');
          }
        })
        .catch(error => {
          console.log('Error getting document:', error);
        });
    } else {
      console.log('User is signed out');
    }
  });
}
// delete
function deleteMovieFromLibrary(moviesCollection, movieId) {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      const uid = user.uid;
      const docRef = db.collection(moviesCollection).doc(uid);
      docRef
        .get()
        .then(doc => {
          if (doc.exists) {
            docRef
              .update({
                movieId: firebase.firestore.FieldValue.arrayRemove(movieId),
              })
              .then(function () {
                console.log('Document delete.');
              })
              .catch(error => {
                console.error('Error delete document: ', error);
              });
          } else {
            // doc.data() will be undefined in this case
            console.log('No such document!');
          }
        })
        .catch(error => {
          console.log('Error getting document:', error);
        });
    } else {
      console.log('User is signed out');
    }
  });
}

export { addMovieToLibrary, getMovieFromLibrary, deleteMovieFromLibrary };