import { getAuth, onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../services/firebase';
import { useNavigate } from 'react-router-dom';

type UserTypeCreate = {
    name: string,
    email: string,
    password: string,
    photoURL?: string,
    displayName?: string
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
        });
        return () => unsubscribe();
    }, []);


    async function signIn(userLogin: UserTypeSignIn) {
        signInWithEmailAndPassword(auth, userLogin.email, userLogin.password)
            .then((userCredential) => {
                const user = userCredential.user;
                setUser(user)
                if (user) {
                    navigate('/home');
                }
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode)
                console.log(errorMessage)
            });
    }

    return (
        <AuthContext.Provider value={{ user, signIn, authChecked }}>
            {props.children}
        </AuthContext.Provider>
    );
}

export function useUser() {
    const context = useContext(AuthContext);
    return context;
}