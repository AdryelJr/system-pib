import { useLocation } from 'react-router-dom';
import './style.scss';
import { useEffect, useState } from 'react';
import { onValue, ref } from 'firebase/database';
import { collection, getDocs, query } from 'firebase/firestore'; // Importe os métodos corretamente
import { db, database } from '../../services/firebase';
import { where } from 'firebase/firestore';

interface Musica {
    artist: string;
    name: string;
    category: string;
    cifra: string;
}

export function MusicaTheDay() {
    const location = useLocation();
    const { informacoesDia } = location.state || {};
    const [listaMusicas, setListaMusicas] = useState<Musica[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [nomeMusica, setNomeMusica] = useState<string>('');
    const [cifraMusica, setCifraMusica] = useState<string>('');

    useEffect(() => {
        if (!informacoesDia || !informacoesDia.id) {
            setError("Informações do dia não fornecidas");
            setLoading(false);
            return;
        }

        const musicsTheDayRef = ref(database, `dias/${informacoesDia.id}/musicasAdicionadas`);
        const unsubscribe = onValue(
            musicsTheDayRef,
            (snapshot) => {
                const dadosFirebase = snapshot.val();
                if (dadosFirebase) {
                    setListaMusicas(Object.values(dadosFirebase));
                } else {
                    setListaMusicas([]);
                }
                setLoading(false);
            },
            (error) => {
                setError(error.message || "Erro ao carregar dados");
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [informacoesDia]);


    async function handleApareca(nameMusic: string, artistMusic: string) {
        try {
            const querySnapshot = await getDocs(
                query(collection(db, 'musicas'),
                    where('name', '==', nameMusic),
                    where('artist', '==', artistMusic)
                )
            );
            if (!querySnapshot.empty) {
                const doc = querySnapshot.docs[0];
                const musicData = doc.data() as Musica;
                setNomeMusica(musicData.name);
                setCifraMusica(musicData.cifra);
            }
        } catch (error) {
            console.error('Erro ao buscar música:', error);
        }
    }

    if (loading) {
        return <div className="container-musicTheDay">Carregando...</div>;
    }

    if (error) {
        return <div className="container-musicTheDay">Erro ao carregar dados: {error}</div>;
    }

    return (
        <div className="container-musicTheDay">
            <div className="content-musicTheDay">
                <header>
                    <div className='div-p-musicas'>
                        {listaMusicas.length > 0 ? (
                            <>
                                {listaMusicas.map((musica, index) => (
                                    <span key={index} onClick={() => handleApareca(musica.name, musica.artist)}>
                                        {musica.name} - {musica.artist}
                                    </span>
                                ))}
                            </>
                        ) : (
                            <div className='div-texto-nenhuma-musica'>Nenhuma música adicionada.</div>
                        )}
                    </div>
                </header>

                <main>
                    {nomeMusica && (
                        <>
                            <div className='cifra-container'>
                                <div className='div-main-cifra'>
                                    <div className='div-main-dentro'>
                                        <h3>{nomeMusica}</h3>
                                        <div className='div-autorecategoria'>
                                        </div>
                                    </div>
                                </div>

                                <pre className='cifra'>
                                    {cifraMusica.split('\n').map((linha, index) => (
                                        <span key={index}>
                                            {linha.split(/([\[\(\{\'\"\"][^\]\)\}\'\"\"]*[\]\)\}\'\"\"])/).map((item, index) => {
                                                if (item.startsWith('"') || item.startsWith("'")) {
                                                    return (
                                                        <span key={index} className="acord">
                                                            <span className="invisible-quotes">{item.charAt(0)}</span>
                                                            {item.slice(1, -1)}
                                                            <span className="invisible-quotes">{item.charAt(item.length - 1)}</span>
                                                        </span>
                                                    );
                                                } else if (/[\[\](){}]/.test(item)) {
                                                    return <span key={index} className="colored-brackets">{item}</span>;
                                                } else {
                                                    return <span key={index}>{item}</span>;
                                                }
                                            })}
                                            <br />
                                        </span>
                                    ))}

                                </pre>
                            </div>
                        </>
                    )}
                    {!nomeMusica && (
                        <div className='div-texto-nenhuma-musica'>Escolha uma música.</div>
                    )}
                </main>

            </div>
        </div>
    );
}
