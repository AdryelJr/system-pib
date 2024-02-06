import { useNavigate } from 'react-router-dom';
import './style.scss';
import { FormEvent, useEffect, useState } from 'react';
import LoadingSpinner from '../../componentes/loadingComponent';
import { useUser } from '../../context/AuthContext';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import { auth } from '../../services/firebase';

export function Profile() {
    const defaultProfilePhotoURL = 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [userPhotoURL, setUserPhotoURL] = useState('');
    const { user } = useUser();

    const userName = user?.displayName ?? 'Name';
    const userId = user?.uid;

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    }, []);

    useEffect(() => {
        if (!userId) return;
        // Função para obter a foto de perfil do usuário
        async function fetchUserProfilePhoto() {
            try {
                const storage = getStorage(); // Obtenha a instância do storage
                const storageRef = ref(storage, `${userId}/profile_photo`); // Crie uma referência ao arquivo de foto de perfil do usuário
                const url = await getDownloadURL(storageRef); // Obtenha a URL de download da foto de perfil

                setUserPhotoURL(url); // Atualize o estado com a URL da foto de perfil
            } catch (error) {
                console.error('Erro ao obter a foto de perfil:', error);
                setUserPhotoURL(defaultProfilePhotoURL);
            }
        }
        fetchUserProfilePhoto();
    }, [userId]);

    function handleHome() {
        navigate('/home');
    }

    async function handleUpload(event: FormEvent<HTMLInputElement>) {
        const file = event.currentTarget.files?.[0];

        if (file) {
            try {
                const storage = getStorage(); // Obtenha a instância do storage corretamente
                const storageRef = ref(storage, `${userId}/profile_photo`); // Crie uma referência ao arquivo de foto de perfil do usuário com o ID do usuário
                await uploadBytesResumable(storageRef, file); // Faça o upload do arquivo

                console.log('Arquivo enviado com sucesso.');

                const url = await getDownloadURL(storageRef);
                setUserPhotoURL(url);
                const currentUser = auth.currentUser;
                if (currentUser) {
                    await updateProfile(currentUser, {
                        photoURL: url
                    });
                    console.log('Atualização da foto de perfil bem-sucedida');
                } else {
                    console.error('Usuário não autenticado.');
                }
            } catch (error) {
                console.error('Erro ao enviar arquivo:', error);
            }
        }
    }

    return (
        <div className="container-profile">
            {isLoading && <LoadingSpinner />}

            <div className='content-profile'>
                <header>
                    <svg onClick={handleHome} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M6 12H18M6 12L11 7M6 12L11 17" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                </header>
                <div className='div-bg'>
                </div>
                <main>
                    <div className='div-img'>
                        <img src={userPhotoURL || defaultProfilePhotoURL} alt={userName} />
                        <input type="file" onChange={handleUpload} />
                    </div>
                    <h2>{userName}</h2>
                </main>
            </div>
        </div>
    );
};
