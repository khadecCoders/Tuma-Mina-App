import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.4/firebase-app.js";
import { getDatabase, set, ref, update, onValue, push } from "https://www.gstatic.com/firebasejs/9.9.4/firebase-database.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL, uploadBytesResumable  } from "https://www.gstatic.com/firebasejs/9.9.4/firebase-storage.js";
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signOut  } from "https://www.gstatic.com/firebasejs/9.9.4/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyBdeM24jxnOiujDbudFqzCB4eMigMhYNGs",
    authDomain: "tumamina-e39e7.firebaseapp.com",
    databaseURL: "https://tumamina-e39e7-default-rtdb.firebaseio.com",
    projectId: "tumamina-e39e7",
    storageBucket: "tumamina-e39e7.appspot.com",
    messagingSenderId: "174519128936",
    appId: "1:174519128936:web:dafd01409927bb693dbcdd"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);
const storage = getStorage(app);

onAuthStateChanged(auth, (user) => {
    if (user) {
        onValue(ref(database, '/users'), (snapshot) => {
            const data = snapshot.val();
            console.log(data);
        })
    }
});