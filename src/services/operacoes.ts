import { createUserWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import { auth } from "./firebase";


type UserTypeCreate = {
    name: string,
    email: string,
    password: string,
    photoURL?: string,
    displayName?: string
}

export async function createUser(newUser: UserTypeCreate) {
    createUserWithEmailAndPassword(auth, newUser.email, newUser.password)
        .then(async (userCredential) => {
            const user = userCredential.user;
            await updateProfile(user, {
                displayName: newUser.name,
            });
            alert('New user created');
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            switch (errorCode) {
                case 'auth/weak-password':
                    alert('A senha é muito fraca. Escolha uma senha mais forte.');
                    break;
                case 'auth/email-already-in-use':
                    alert('O endereço de e-mail já está sendo usado por outra conta.');
                    break;
                case 'auth/invalid-email':
                    alert('O endereço de e-mail é inválido.');
                    break;
                default:
                    console.error(errorMessage);
            }
        });
}


// -----------------------------------------------------------------------------


export async function handleSignOut() {
    signOut(auth).then(() => {
    }).catch((error) => {
        console.error(error)
    });
}


// -----------------------------------------------------------------------------


