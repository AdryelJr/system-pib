import './style.scss'
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../services/firebase";

export function MusicaItemPage() {
    const { id } = useParams();
    const [musicItem, setMusicItem] = useState<any | null>(null);

    useEffect(() => {
        const fetchMusicItem = async () => {
            try {
                const musicDocRef = doc(db, `musicas/${id}`);
                const musicDocSnapshot = await getDoc(musicDocRef);
                if (musicDocSnapshot.exists()) {
                    setMusicItem({ id: musicDocSnapshot.id, ...musicDocSnapshot.data() });
                } else {
                    console.log('Documento da música não encontrado.');
                }
            } catch (error) {
                console.log('Erro ao buscar dados da música:', error);
            }
        };
        fetchMusicItem();
    }, [id]);

    return (
        <div className="container-musicItemPage">
            <div className="content-musicItemPage">
                {musicItem ? (
                    <>
                        <header>
                            <div>
                                <h2>{musicItem.name}</h2>
                                <h4>{musicItem.artist}</h4>
                            </div>
                            <p>Categoria: {musicItem.category}</p>
                        </header>
                        <div className='main-img'>
                            <img src={musicItem.imageUrl} alt="Cifra da música" />
                        </div>
                    </>
                ) : (
                    <p>Carregando...</p>
                )}
            </div>
        </div>
    );
}
