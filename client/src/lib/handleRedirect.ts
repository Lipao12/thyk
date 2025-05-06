import { getRedirectResult, GoogleAuthProvider } from "firebase/auth";
import { auth } from "./firebase";

// Call this function on page load to handle the Firebase redirect result
export async function handleRedirect() {
  if (!auth) {
    console.log("Firebase auth not initialized, using mock authentication");
    return null;
  }
  
  try {
    const result = await getRedirectResult(auth);
    
    if (result) {
      // This gives you a Google Access Token
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;
      
      // The signed-in user info
      const user = result.user;
      
      // Save user info to local storage
      localStorage.setItem('thyk_user', JSON.stringify({
        id: user.uid,
        name: user.displayName,
        email: user.email,
        isLoggedIn: true,
        provider: "google",
        photoURL: user.photoURL,
        token: token
      }));
      
      return user;
    }
    
    return null;
  } catch (error: any) {
    // Handle Errors here
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error("Firebase redirect error:", errorCode, errorMessage);
    
    // The email of the user's account used
    //const email = error.customData?.email;
    
    // The AuthCredential type that was used
    //const credential = GoogleAuthProvider.credentialFromError(error);
    
    return null;
  }
}