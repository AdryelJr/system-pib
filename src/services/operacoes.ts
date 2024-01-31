import { signOut } from "firebase/auth";
import { auth } from "./firebase";


export async function handleSignOut() {
    signOut(auth).then(() => {
    }).catch((error) => {
        console.error(error)
    });
}


// -----------------------------------------------------------------------------


