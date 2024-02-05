import { updateProfile, User } from "firebase/auth";
import { auth } from "../../services/firebase";

export function Profile() {
    const newPhotoURL: string = 'https://pics.craiyon.com/2023-06-27/287f2a60c2e74386b5a89c517eb527dc.webp';
    const newName: string = 'Adryel Santos';

    function handleSubmit() {
        const currentUser: User | null = auth.currentUser;

        if (currentUser) {
            updateProfile(currentUser, {
                photoURL: newPhotoURL,
                displayName: newName
            })
                .then(() => {
                    console.log('Atualização do perfil bem-sucedida');
                })
                .catch((error: Error) => {
                    console.error('Erro ao atualizar perfil:', error.message);
                });
        } else {
            console.error('Usuário não autenticado');
        }
    }

    return (
        <div>
            <h1>Olá, perfil</h1>

            <button onClick={handleSubmit}>
                Clique
            </button>
        </div>
    );
}
