import { useNavigate } from 'react-router-dom';
import './style.scss';
import { useUser } from '../../context/AuthContext';
import { useEffect, useState } from 'react';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db, storage } from '../../services/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export function Musicas() {
    const navigate = useNavigate();
    const { user } = useUser();

    function handleHome() {
        navigate('/home');
    }

    const [music, setMusic] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [newMusic, setNewMusic] = useState({ name: '', artist: '', category: 'louvor', imageURL: '' });
    const [modalOpen, setModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewMusic(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCategory(e.target.value);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleAddMusic = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            setUploading(true);
            let imageURL = '';
            if (imageFile) {
                const storageRef = ref(storage, `imagesMusic/${imageFile.name}`);
                await uploadBytes(storageRef, imageFile);
                imageURL = await getDownloadURL(storageRef);
            }
            const docRef = await addDoc(collection(db, 'musicas'), { ...newMusic, imageURL });
            setMusic(prevMusic => [...prevMusic, { id: docRef.id, ...newMusic, imageURL }]);
            setNewMusic({ name: '', artist: '', category: 'louvor', imageURL: '' });
            setImageFile(null);
            setModalOpen(false);
        } catch (error) {
            console.error('Erro adding music: ', error);
        } finally {
            setUploading(false);
        }
    };

    const openModal = () => {
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    const filteredMusic = music.filter(musicItem => {
        const matchesSearch = musicItem.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === '' || musicItem.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

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
                            onChange={handleSearchChange}
                            placeholder="Pesquisa"
                        />
                        <select
                            name="category"
                            value={selectedCategory}
                            onChange={handleCategoryChange}
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

                {loading ? (
                    <div>Carregando...</div>
                ) : (
                    <main>
                        <ul>
                            {filteredMusic.map(musicItem => (
                                <li key={musicItem.id}>{musicItem.name} - {musicItem.artist} ({musicItem.category})</li>
                            ))}
                        </ul>
                    </main>
                )}

                {user && user.uid === "Qu3xbobOndcykGPCNXMmoGWeXBC2" && (
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
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                required
                            />
                            {uploading && <p>Carregando imagem...</p>}
                            <button type="submit">Adicionar Música</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
