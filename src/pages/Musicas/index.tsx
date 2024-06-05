import { useNavigate } from 'react-router-dom';
import './style.scss';
import { useUser } from '../../context/AuthContext';
import { useEffect, useState } from 'react';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';

export function Musicas() {
    const navigate = useNavigate();
    const { user } = useUser();

    function handleHome() {
        navigate('/home');
    }

    const [music, setMusic] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [newMusic, setNewMusic] = useState({ name: '', artist: '' });
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        const fetchMusic = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'musicas'));
                const musicData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setMusic(musicData);
            } catch (error) {
                console.log('Erro fetching music', error);
            } finally {
                setLoading(false);
            }
        };
        fetchMusic();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewMusic(prevState => ({ ...prevState, [name]: value }));
    };

    const handleAddMusic = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const docRef = await addDoc(collection(db, 'musicas'), newMusic);
            setMusic(prevMusic => [...prevMusic, { id: docRef.id, ...newMusic }]);
            setNewMusic({ name: '', artist: '' }); // Limpar o formulário
            setModalOpen(false); // Fechar o modal após adicionar a música
        } catch (error) {
            console.error('Erro adding music: ', error);
        }
    };

    const openModal = () => {
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    if (loading) {
        return <div>Carregando...</div>;
    }

    return (
        <div className='container-music'>
            <div className='content-music'>
                <header>
                    <svg onClick={handleHome} width={50} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M6 12H18M6 12L11 7M6 12L11 17" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                </header>
                <h2>Músicas</h2>
                <div className='div-form'>
                    {/* Conteúdo adicional pode ser adicionado aqui */}
                </div>
                <main>
                    <ul>
                        {music.map(musicItem => (
                            <li key={musicItem.id}>{musicItem.name} - {musicItem.artist}</li>
                        ))}
                    </ul>
                </main>
                {(user && user.uid === "Qu3xbobOndcykGPCNXMmoGWeXBC2") && (
                    <button className="btn-add-music" onClick={openModal}>Add Music</button>
                )}
            </div>
            {modalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={closeModal}>&times;</span>
                        <h2>Adicionar Música</h2>
                        <form onSubmit={handleAddMusic}>
                            <input
                                type="text"
                                name="name"
                                value={newMusic.name}
                                onChange={handleInputChange}
                                placeholder="Nome da Música"
                                required
                            />
                            <input
                                type="text"
                                name="artist"
                                value={newMusic.artist}
                                onChange={handleInputChange}
                                placeholder="Artista"
                                required
                            />
                            <button type="submit">Adicionar Música</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}