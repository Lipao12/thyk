import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

//const provider = new GoogleAuthProvider();

// Call this function when the user clicks on the Google login button
export async function googleLogin() {
  const provider = new GoogleAuthProvider();
  if (auth) {
    console.log("Teste")
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      name: user.displayName,
      photoURL: user.photoURL,
      createdAt: new Date(),
    });
    //return signInWithRedirect(auth, provider);
  } else {
    console.log("Firebase auth not initialized, using mock authentication");
    
    // Mock Google login for development without Firebase credentials
    /*localStorage.setItem('thyk_user', JSON.stringify({
      id: 1,
      name: "Google User",
      email: "google@example.com",
      isLoggedIn: true,
      provider: "google"
    }));*/
    
    
    // Return a promise to mimic the async behavior of signInWithRedirect
    return Promise.resolve();
  }
}