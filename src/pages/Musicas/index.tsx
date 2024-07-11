import "./style.scss";
import eyeSvg from "../../assets/svg/eye.svg";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/AuthContext';
import { useEffect } from 'react';
import { addDoc, collection, getDocs } from 'firebase/firestore';

import { database, db } from "../../services/firebase";
import { ref, onValue, update, get } from "firebase/database";


type Dia = {
    id: string;
    data: string;
    horario: string;
    tipoCulto: string;
    musicasAdicionadas?: { name: string; artist: string }[];
};

type DadosDoFirebase = Record<string, Dia>;

export function Musicas() {
    const navigate = useNavigate();
    const { user } = useUser();

    function handleHome() {
        navigate('/home');
    }

    const [music, setMusic] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [newMusic, setNewMusic] = useState({ name: '', artist: '', category: 'Louvor', cifra: '' });
    const [modalOpen, setModalOpen] = useState(false);
    const [modalOpenMusic, setModalOpenMusic] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedMusicName, setSelectedMusicName] = useState('');
    const [selectedMusicArtist, setSelectedMusicArtist] = useState('');
    const [selectedDiaId, setSelectedDiaId] = useState<string | null>(null);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        setNewMusic(prevState => ({
            ...prevState,
            [name]: value
        }));
    };
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            const docRef = await addDoc(collection(db, 'musicas'), {
                artist: newMusic.artist,
                name: newMusic.name,
                category: newMusic.category,
                cifra: newMusic.cifra
            });

            console.log('Música adicionada com ID: ', docRef.id);

            // Limpar o formulário e fechar o modal
            setNewMusic({ name: '', artist: '', category: '', cifra: '' });
            setModalOpen(false);
        } catch (error) {
            console.error('Erro ao adicionar música: ', error);
        }
    };

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



    const openModal = () => {
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setModalOpenMusic(false);
    };

    // ---- MODAL ADD MUSIC --------------------------------------------------------------------------------------------

    const openModalMusic = (musicName: string, artist: string) => {
        setSelectedMusicName(musicName);
        setSelectedMusicArtist(artist);
        setModalOpenMusic(true);
    }

    const handleEyeClick = (musicId: string) => {
        window.open(`/musicItem/${musicId}`, '_blank');
    };


    // DADOS DOS DIAS --------------------------------------------------------------------------------------------------

    const [data, setData] = useState<DadosDoFirebase>({});

    useEffect(() => {
        const diasRef = ref(database, 'dias/');
        onValue(diasRef, (snapshot) => {
            const dadosDoFirebase = snapshot.val();
            if (dadosDoFirebase) {
                const dadosArray = Object.entries<Dia>(dadosDoFirebase);
                const dadosInvertidosArray = dadosArray.reverse();
                const dadosInvertidos: DadosDoFirebase = dadosInvertidosArray.reduce((acc, [key, value]) => {
                    acc[key] = value;
                    return acc;
                }, {} as DadosDoFirebase);
                setData(dadosInvertidos);
            } else {
                setData({});
            }
        });
    }, []);

    const handleDiaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedDiaId(e.target.value);
    };


    // ADICIONANDO MÚSICA AO DIA SELECIONADO NO "RÁDIO" ----------------------------------------------------------------

    const handleAddMusicSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (selectedDiaId) {
            try {
                const diaRef = ref(database, `dias/${selectedDiaId}/musicasAdicionadas`);
                const existingMusicasSnapshot = await get(diaRef);
                const existingMusicas = existingMusicasSnapshot.val() || [];
                const updatedMusicas = [...existingMusicas, { name: selectedMusicName, artist: selectedMusicArtist }];
                await update(ref(database, `dias/${selectedDiaId}`), { musicasAdicionadas: updatedMusicas });
                closeModal();
            } catch (error) {
                console.error('Erro ao adicionar música:', error);
            }
        }
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
                            <option value="Louvor">Louvor</option>
                            <option value="Alegre">Alegre</option>
                            <option value="Rápida">Rápida</option>
                            <option value="Lenta">Lenta</option>
                            <option value="Adoração">Adoração</option>
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
                                        {(user && user.uid == "Qu3xbobOndcykGPCNXMmoGWeXBC2" || user && user.uid == "Ge7RBqSFOcd9LxLul0y5A7gcjUh1" || user && user.uid == "xmylsFPyRAMezVJuOiEtY5qzHC43") && (
                                            <button className="button-add-music-dia" onClick={() => openModalMusic(musicItem.name, musicItem.artist)}>
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
                {(user && user.uid == "Qu3xbobOndcykGPCNXMmoGWeXBC2" || user && user.uid == "Ge7RBqSFOcd9LxLul0y5A7gcjUh1" || user && user.uid == "xmylsFPyRAMezVJuOiEtY5qzHC43") && (
                    <button className="btn-add-music" onClick={openModal}>Adicionar Música</button>
                )}
            </div>
            {modalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={closeModal}>&times;</span>
                        <h2>Adicionar Música</h2>
                        <form onSubmit={handleSubmit}>
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
                                <option value="Louvor">Louvor</option>
                                <option value="Alegre">Alegre</option>
                                <option value="Rápida">Rápida</option>
                                <option value="Lenta">Lenta</option>
                                <option value="Adoração">Adoração</option>
                            </select>

                            <textarea
                                name="cifra"
                                value={newMusic.cifra}
                                onChange={handleInputChange}
                                placeholder="Cifra da Música"
                                id="cifra"
                                cols={30}
                                rows={10}>
                            </textarea>
                            <button type="submit" >Adicionar Música</button>
                        </form>
                    </div>
                </div>
            )}

            {modalOpenMusic && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={closeModal}>&times;</span>
                        <h2>Adicionar Música</h2>
                        <p>{selectedMusicName} - {selectedMusicArtist}</p>
                        <br />
                        <h2>A qual evento adicionar?</h2>
                        <form className="form-rapidos" onSubmit={handleAddMusicSubmit}>
                            <div className="div-form-rapio">
                                {Object.entries(data).map(([key, dia]) => (
                                    <label key={key}>
                                        <input
                                            type="radio"
                                            name="dia"
                                            value={key}
                                            checked={selectedDiaId === key}
                                            onChange={handleDiaChange}
                                        />
                                        <span>{dia.data} - {dia.horario} - {dia.tipoCulto}</span>
                                    </label>
                                ))}
                            </div>
                            <br />
                            <button type="submit">Adicionar Música</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
