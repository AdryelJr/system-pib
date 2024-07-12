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
    const [autorMusica, setAutorMusica] = useState<string>('');
    const [categoryMusica, setCategoryMusica] = useState<string>('');
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
                setAutorMusica(musicData.artist);
                setCategoryMusica(musicData.category);
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
                    <div>
                        <h2>Músicas do dia: {informacoesDia.data}</h2>
                    </div>
                    <div>
                        {listaMusicas.length > 0 ? (
                            <ol>
                                {listaMusicas.map((musica, index) => (
                                    <li key={index} onClick={() => handleApareca(musica.name, musica.artist)}>
                                        {musica.name} - {musica.artist}
                                    </li>
                                ))}
                            </ol>
                        ) : (
                            <div>Nenhuma música adicionada.</div>
                        )}
                    </div>
                </header>

                <main>
                    {nomeMusica && (
                        <>
                            <div className='div-main-cifra'>
                                <div className='div-main-dentro'>
                                    <h2>{nomeMusica}</h2>
                                    <h4>{autorMusica}</h4>
                                </div>
                                <span>Categoria: {categoryMusica}</span>
                            </div>
                            <div className='cifra'>
                                <pre>{cifraMusica}</pre>
                                {cifraMusica.split('\n').map((line, index) => (
                                    <div key={index}>{line}</div>
                                ))}
                            </div>
                        </>
                    )}
                    {!nomeMusica && (
                        <div>Escolha uma música.</div>
                    )}
                </main>
            </div>
        </div>
    );
}
