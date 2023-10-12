// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js"; // Corrected import URL
import {
  getDatabase,
  ref,
  set,
  onValue, // Import onValue to listen for changes
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js"; // Corrected import URL

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  databaseURL: "https://signup-form-e42b1-default-rtdb.firebaseio.com" // Add this line

};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth();

// Sign-up Function
window.signup = function (e) {
  e.preventDefault();

  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // User signed up
      const user = userCredential.user;
      console.log("Signed up as: " + user.email);

      // Store user data in the Realtime Database
      const userRef = ref(db, "rules/" + user.uid); // Assuming a "users" node in the database
      set(userRef, {
        email: user.email,
        // Other user data you want to store
      });
    })
    .catch((error) => {
      // Handle sign-up error
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Sign-up error: " + errorMessage);
    });
};

// Function to display user data from the Realtime Database
function displayUserData() {
  const user = auth.currentUser; // Get the currently signed-in user
  if (user) {
    const userRef = ref(db, "users/" + user.uid);
    onValue(userRef, (snapshot) => {
      const userData = snapshot.val();
      // Update your application's UI with userData
      console.log("User data from the database:", userData);
    });
  } else {
    console.log("No user is signed in.");
  }
}

// Call displayUserData() to display user data when needed
