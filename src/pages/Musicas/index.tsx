import "./style.scss";
import eyeSvg from "../../assets/svg/eye.svg";
import { ChangeEvent, FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/AuthContext';
import { useEffect } from 'react';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";

export function Musicas() {
    const navigate = useNavigate();
    const { user } = useUser();

    function handleHome() {
        navigate('/home');
    }

    const [music, setMusic] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [newMusic, setNewMusic] = useState({ name: '', artist: '', category: 'louvor' });
    const [modalOpen, setModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [uploading, setUploading] = useState(false);

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

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewMusic(prevState => ({ ...prevState, [name]: value }));
    };

    const handleAddMusic = async () => {
        try {
            setUploading(true);
            const fileInput = document.getElementById('fileInput') as HTMLInputElement;
            let imageUrl = '';
            if (fileInput && fileInput.files && fileInput.files.length > 0) {
                const file = fileInput.files[0];
                const storage = getStorage();
                const storageRef = ref(storage, `imageMusic/${file.name}`);
                const uploadTask = uploadBytesResumable(storageRef, file);
                const snapshot = await uploadTask;
                imageUrl = await getDownloadURL(snapshot.ref);
            }
            const docRef = await addDoc(collection(db, 'musicas'), { ...newMusic, imageUrl });
            setMusic(prevMusic => [...prevMusic, { id: docRef.id, ...newMusic, imageUrl }]);
            setNewMusic({ name: '', artist: '', category: 'louvor' });
            setModalOpen(false);
        } catch (error) {
            console.error('Erro ao adicionar música: ', error);
        } finally {
            setUploading(false);
        }
    };

    const handleUpload = async (file: File) => {
        if (file) {
            try {
                const storage = getStorage();
                const storageRef = ref(storage, `imageMusic/${newMusic.name}`);
                await uploadBytesResumable(storageRef, file);
                console.log("Arquivo enviado com sucesso!")
            } catch (error) {
                console.error('Erro ao enviar imagem: ', error);
            }
        }
    };

    const handleAddMusicButtonClick = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const fileInput = document.getElementById('fileInput') as HTMLInputElement;
            if (fileInput && fileInput.files && fileInput.files.length > 0) {
                await handleUpload(fileInput.files[0]);
            }
            handleAddMusic()
        } catch (error) {
            console.error('Erro ao adicionar música: ', error);
        }
    };

    const openModal = () => {
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    const handleEyeClick = (musicId: string) => {
        window.open(`/musicItem/${musicId}`, '_blank');
    };

    return (
        <div className='container-music'>
            <div className='content-music'>
                <header>
                    <svg onClick={handleHome} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                        <g id="SVGRepo_iconCarrier">
                            <path d="M6 12H18M6 12L11 7M6 12L11 17" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                        </g>
                    </svg>
                    <h2>Músicas</h2>
                </header>

                <div className='div-form'>
                    <form>
                        <input
                            type="text"
                            name="searchTerm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Pesquisa"
                        />
                        <select
                            name="category"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            <option value="">Todas as categorias</option>
                            <option value="louvor">Louvor</option>
                            <option value="alegre">Alegre</option>
                            <option value="rapida">Rápida</option>
                            <option value="lenta">Lenta</option>
                            <option value="adoracao">Adoração</option>
                        </select>


                    </form>
                </div>
                <main>
                    {loading ? (
                        <div>Carregando...</div>
                    ) : (
                        <ul>
                            {music
                                .filter(musicItem => {
                                    if (!searchTerm && !selectedCategory) return true;
                                    if (searchTerm && !selectedCategory) {
                                        return musicItem.name.toLowerCase().includes(searchTerm.toLowerCase());
                                    }
                                    if (!searchTerm && selectedCategory) {
                                        return musicItem.category === selectedCategory;
                                    }
                                    return (
                                        musicItem.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
                                        musicItem.category === selectedCategory
                                    );
                                })
                                .map(musicItem => (
                                    <div key={musicItem.id} className="div-music-item">
                                        <li >{musicItem.name} - {musicItem.artist} ({musicItem.category})</li>
                                        {(user && user.uid == "Qu3xbobOndcykGPCNXMmoGWeXBC2") && (
                                            <button className="button-add-music-dia">
                                                add
                                            </button>
                                        )}
                                        <img
                                            src={eyeSvg} alt="eye"
                                            onClick={(() => handleEyeClick(musicItem.id))}
                                        />
                                    </div>
                                ))}
                        </ul>
                    )}
                </main>
                {(user && user.uid === "Qu3xbobOndcykGPCNXMmoGWeXBC2") && (
                    <button className="btn-add-music" onClick={openModal}>Adicionar Música</button>
                )}
            </div>
            {modalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={closeModal}>&times;</span>
                        <h2>Adicionar Música</h2>
                        <form onSubmit={handleAddMusicButtonClick}>
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
                            <select
                                name="category"
                                value={newMusic.category}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="louvor">Louvor</option>
                                <option value="alegre">Alegre</option>
                                <option value="rapida">Rápida</option>
                                <option value="lenta">Lenta</option>
                                <option value="adoracao">Adoração</option>
                            </select>
                            <input
                                id="fileInput"
                                type="file"
                            />
                            {uploading ? (
                                <>
                                    <span>Carregando...</span>
                                    <button className="btn-loading" type="submit" disabled>
                                        <div className="loader"></div>
                                    </button>
                                </>
                            ) : (
                                <button type="submit" >Adicionar Música</button>
                            )}
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
