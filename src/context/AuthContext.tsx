import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../services/firebase';
import { useNavigate } from 'react-router-dom';

type UserTypeCreate = {
    name: string,
    email: string,
    password: string,
    photoURL?: string
}

type UserTypeSignIn = {
    email: string,
    password: string,
}

type UserProviderProps = {
    children: React.ReactNode;
}

type AuthContextType = {
    user: UserTypeCreate;
    signIn: (userLogin: UserTypeSignIn) => void;
    createUser: (newUser: UserTypeCreate) => void;
    authChecked: boolean
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function UserProvider(props: UserProviderProps) {
    const navigate = useNavigate();
    const [user, setUser] = useState<any | null>(null);
    const [authChecked, setAuthChecked] = useState(false);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setAuthChecked(true);
            if (user) {
                navigate('/home');
            }
        });

        return () => unsubscribe();
    }, []);

    async function createUser(newUser: UserTypeCreate) {
        createUserWithEmailAndPassword(auth, newUser.email, newUser.password)
            .then(async (userCredential) => {
                const user = userCredential.user;
                await updateProfile(user, {
                    displayName: newUser.name,
                });
                setUser(user)
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode)
                console.log(errorMessage)
            });
    }


    async function signIn(userLogin: UserTypeSignIn) {
        signInWithEmailAndPassword(auth, userLogin.email, userLogin.password)
            .then((userCredential) => {
                const user = userCredential.user;
                setUser(user)
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode)
                console.log(errorMessage)
            });
    }

    return (
        <AuthContext.Provider value={{ user, signIn, createUser, authChecked }}>
            {props.children}
        </AuthContext.Provider>
    );
}

export function useUser() {
    const context = useContext(AuthContext);
    return context;
}