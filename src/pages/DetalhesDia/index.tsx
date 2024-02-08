import './style.scss'
import { FormEvent, useEffect, useState } from "react";
import LoadingSpinner from "../../componentes/loadingComponent";
import { useLocation, useNavigate } from 'react-router-dom';
import { get, onValue, push, ref, remove, set } from 'firebase/database';
import { database } from '../../services/firebase';
import { useUser } from '../../context/AuthContext';


interface Confirmado {
    userId: string;
    avatar?: string;
    confirmacao: boolean;
}

type Lov = {
    id: string;
    texto: string;
    userVoted: any;
    criador: any;
}

type DadosDoFirbase = Record<string, Lov>;

export function DetalhesDia() {
    const { user } = useUser();
    const userID = user?.uid ?? 'false';
    const userAvatar = user?.photoURL ?? 'sem';
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

    const location = useLocation();
    const informacoesDia = location.state?.informacoesDia || {};
    const { id, data, horario, tipoCulto, diaSemanaFormatado } = informacoesDia || {};

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    }, []);

    function handleHome() {
        navigate('/home')
    }


    async function handleExcluirLouvor(louvorId: string) {
        try {
            const louvorRef = ref(database, `dias/${id}/louvores/${louvorId}`);
            await remove(louvorRef);
            setLouvores((prevLouvores) => {
                const updatedLouvores = { ...prevLouvores };
                delete updatedLouvores[louvorId];
                return updatedLouvores;
            });
            console.log('Louvor excluído com sucesso!');
        } catch (error) {
            console.error('Erro ao excluir o louvor:', error);
        }
    }

    async function handleExcluirAviso(avisoId: string) {
        try {
            const avisoRef = ref(database, `dias/${id}/avisos/${avisoId}`);
            await remove(avisoRef);
            console.log('Aviso excluído com sucesso!');
            // Atualizar o estado dos avisos após a exclusão
            const novosAvisos = { ...avisos };
            delete novosAvisos[avisoId];
            setAvisos(novosAvisos);
        } catch (error) {
            console.error('Erro ao excluir o aviso:', error);
        }
    }





    // CONFIRMAÇÕES ============================================================
    const [confirmacaoConcluida, setConfirmacaoConcluida] = useState(Boolean);
    const [mudou, setMudou] = useState(true);

    useEffect(() => {
        const confirmRef = ref(database, `dias/${id}/infoUser/${userID}`);
        onValue(confirmRef, (snapshot) => {
            const dadosConfirm = snapshot.val();
            if (dadosConfirm && dadosConfirm.confirmacao !== undefined) {
                setConfirmacaoConcluida(dadosConfirm.confirmacao);
            }
        });

    }, [id, userID, userAvatar, confirmacaoConcluida, mudou]);


    async function handleConfirmSim() {
        const confirRef = ref(database, `dias/${id}/infoUser/${userID}`)
        const dadosConfirm = {
            avatar: userAvatar,
            confirmacao: true
        }
        await set(confirRef, dadosConfirm)
        console.log('User Confirmado')
        setMudou(!mudou)
    }

    async function handleConfirmNao() {
        const confirRef = ref(database, `dias/${id}/infoUser/${userID}`)
        const dadosConfirm = {
            avatar: userAvatar,
            confirmacao: false
        }
        await set(confirRef, dadosConfirm)
        console.log('User Confirmado como NÃO')
        setMudou(!mudou)
    }

    const [userId, setUserId] = useState('');

    useEffect(() => {
        if (user) {
            setUserId(userID);
        }
        console.log(userId)
    }, [user]);






    // AVISOS ==================================================================
    const [avisos, setAvisos] = useState<any>({});
    const [newAviso, setNewAviso] = useState<any>('')

    async function handleAvisos(event: FormEvent) {
        event.preventDefault();

        if (newAviso.trim() !== "") {
            const avisosRef = ref(database, `dias/${id}/avisos`);
            const novoAviso = push(avisosRef);
            const avisoCriado = {
                criador: userId,
                texto: newAviso
            }
            await set(novoAviso, avisoCriado);
            setNewAviso('')
        }
    }

    useEffect(() => {
        const avisosRef = ref(database, `dias/${id}/avisos`);
        onValue(avisosRef, (snapshot) => {
            const dadosDoFirebase = snapshot.val();
            setAvisos(dadosDoFirebase || {});
        });
    }, [id])




    // CONFIRMADOS IMG =========================================================
    const [confirmados, setConfirmados] = useState<Confirmado[]>([]);

    useEffect(() => {
        const confirmRef = ref(database, `dias/${id}/infoUser`);
        onValue(confirmRef, (snapshot) => {
            const dadosConfirmados: Record<string, Confirmado> = snapshot.val();
            const confirmadosArray = Object.values(dadosConfirmados || {}).filter((user) => user.confirmacao);
            setConfirmados(confirmadosArray);
        });
    }, [id, userID, userAvatar]);




    // LOUVORES ================================================================
    const [louvores, setLouvores] = useState<DadosDoFirbase>({});

    useEffect(() => {
        const louvorRef = ref(database, `dias/${id}/louvores`);
        onValue(louvorRef, (snapshot) => {
            const dadosLouvores = snapshot.val();
            setLouvores(dadosLouvores);
        });
    }, []);







    // SUGESTAO ================================================================
    const [novaSugestao, setNovaSugestao] = useState('');
    const [sugestoesBanco, setSugestoesBanco] = useState<any>({});

    async function handleSugestao(event: FormEvent) {
        event.preventDefault();

        if (novaSugestao.trim() !== "") {
            const sugestaoRef = ref(database, `dias/${id}/sugestoes`);
            const novaSugestaoRef = push(sugestaoRef);

            await set(novaSugestaoRef, { texto: novaSugestao });
            setNovaSugestao('')
        }
    }

    useEffect(() => {
        const sugestaoRef = ref(database, `dias/${id}/sugestoes`);
        onValue(sugestaoRef, (snapshot) => {
            const dadosDoFirebase = snapshot.val();
            setSugestoesBanco(dadosDoFirebase || {});
        });
    }, [id])





    // VOTAÇÃO =================================================================
    async function handleVotacao(sugestaoId: any, isChecked: boolean) {
        const votosRef = ref(database, `dias/${id}/sugestoes/${sugestaoId}/texto`);
        if (isChecked) {
            console.log(sugestaoId)
            onValue(votosRef, (snapshot) => {
                const sugestaoName = snapshot.val();
                if (!sugestaoName.moved) {
                    movendoMusica(sugestaoId)
                }
            });
        }
    }

    async function movendoMusica(sugestaoId: any) {
        const sugestaoRef = ref(database, `dias/${id}/sugestoes/${sugestaoId}`);
        const sugestaoSnapshot = await get(sugestaoRef);
        const sugestaoData = sugestaoSnapshot.val();
        if (sugestaoData) {
            const louvoresRef = ref(database, `dias/${id}/louvores`);
            const novaLouvorRef = push(louvoresRef);
            const votando = {
                texto: sugestaoData.texto,
                criador: userId,
                votos: {
                    [userID]: true
                }
            }
            await set(novaLouvorRef, votando);

            await remove(sugestaoRef);
        }
    }



    // -------------------------------------------------------------------------
    async function handleVotacaoLouvores(louvorId: any, isChecked: boolean) {
        const louvorRef = ref(database, `dias/${id}/louvores/${louvorId}/votos/${userID}`);

        if (isChecked) {
            await set(louvorRef, true);
        } else {
            await set(louvorRef, null);
        }
    }

    useEffect(() => {
        const louvorRef = ref(database, `dias/${id}/louvores`);
        onValue(louvorRef, (snapshot) => {
            const louvoresData: Record<string, any> = snapshot.val();
            const louvoresWithUserVote = Object.keys(louvoresData).reduce((acc, louvorId) => {
                const userVotedRef = ref(database, `dias/${id}/louvores/${louvorId}/votos/${userID}`);
                onValue(userVotedRef, (userVoteSnapshot) => {
                    const userVoted = !!userVoteSnapshot.val();
                    acc[louvorId] = { ...louvoresData[louvorId], userVoted };
                    setLouvores({ ...louvoresData, [louvorId]: { ...louvoresData[louvorId], userVoted } });
                });
                return acc;

            }, {} as Record<string, any>);
            setLouvores(louvoresWithUserVote);
        });

    }, [id, userID]);


    const [numeroVotos, setNumeroVotos] = useState<any>();
    useEffect(() => {
        const louvorRef = ref(database, `dias/${id}/louvores`);
        onValue(louvorRef, (snapshot) => {
            const louvoresData: Record<string, any> = snapshot.val();
            const louvoresWithVoteCount: Record<string, number> = {};

            Object.keys(louvoresData).forEach((louvorId) => {
                const votosRef = ref(database, `dias/${id}/louvores/${louvorId}/votos`);
                onValue(votosRef, (votosSnapshot) => {
                    const votosData: Record<string, any> = votosSnapshot.val() || {};
                    const votosLength = Object.keys(votosData).length;
                    louvoresWithVoteCount[louvorId] = votosLength;
                    setNumeroVotos(louvoresWithVoteCount)
                });
            });
        });
    }, [id]);


    return (
        <div className="container-detalhesDia">
            {isLoading && <LoadingSpinner />}

            <div className='content-detals'>
                <header>
                    <svg onClick={handleHome} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M6 12H18M6 12L11 7M6 12L11 17" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                    <h2>Escala</h2>
                </header>

                <main>
                    <div className='div-informations'>
                        <div className='div-tipoHorario'>
                            <h3>{tipoCulto}</h3>
                        </div>
                        <div className='child-informations'>
                            <span>{diaSemanaFormatado} &nbsp; <strong>{horario}</strong></span>
                            <span>
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M3 9H21M7 3V5M17 3V5M7 13H17V17H7V13ZM6.2 21H17.8C18.9201 21 19.4802 21 19.908 20.782C20.2843 20.5903 20.5903 20.2843 20.782 19.908C21 19.4802 21 18.9201 21 17.8V8.2C21 7.07989 21 6.51984 20.782 6.09202C20.5903 5.71569 20.2843 5.40973 19.908 5.21799C19.4802 5 18.9201 5 17.8 5H6.2C5.0799 5 4.51984 5 4.09202 5.21799C3.71569 5.40973 3.40973 5.71569 3.21799 6.09202C3 6.51984 3 7.07989 3 8.2V17.8C3 18.9201 3 19.4802 3.21799 19.908C3.40973 20.2843 3.71569 20.5903 4.09202 20.782C4.51984 21 5.07989 21 6.2 21Z" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                                &nbsp;<p>{data}</p>
                            </span>
                        </div>
                        <div className={`div-confirmation ${confirmacaoConcluida ? 'confirmacao-concluida' : ''}`}>
                            <p>Confirmar Presença</p>
                            <button className='btn1' onClick={handleConfirmNao}>Não</button>
                            <button className='btn2' onClick={handleConfirmSim}>Sim</button>
                        </div>
                    </div>

                    <div className='div-avisos'>
                        <div className='svg'>
                            <svg height="25px" width="25px" version="1.1" id="_x32_" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xmlSpace="preserve" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <style type="text/css"> </style> <g> <path d="M256.007,357.113c-16.784,0-30.411,13.613-30.411,30.397c0,16.791,13.627,30.405,30.411,30.405 s30.397-13.614,30.397-30.405C286.405,370.726,272.792,357.113,256.007,357.113z"></path> <path d="M505.097,407.119L300.769,53.209c-9.203-15.944-26.356-25.847-44.777-25.847 c-18.407,0-35.544,9.904-44.747,25.847L6.902,407.104c-9.203,15.943-9.203,35.751,0,51.694c9.204,15.943,26.356,25.84,44.763,25.84 h408.67c18.406,0,35.559-9.897,44.762-25.84C514.301,442.855,514.301,423.047,505.097,407.119z M464.465,432.405 c-2.95,5.103-8.444,8.266-14.35,8.266H61.878c-5.892,0-11.394-3.163-14.329-8.281c-2.964-5.11-2.979-11.445-0.014-16.548 l194.122-336.24c2.943-5.103,8.436-8.274,14.35-8.274c5.9,0,11.386,3.171,14.336,8.282l194.122,336.226 C467.415,420.945,467.415,427.295,464.465,432.405z"></path> <path d="M256.007,152.719c-16.784,0-30.411,13.613-30.411,30.405l11.68,137.487c0,10.346,8.378,18.724,18.731,18.724 c10.338,0,18.731-8.378,18.731-18.724l11.666-137.487C286.405,166.331,272.792,152.719,256.007,152.719z"></path> </g> </g></svg>
                            <p> Avisos</p>
                            <form onSubmit={handleAvisos}>
                                <input
                                    type="text"
                                    onChange={(e) => (setNewAviso(e.target.value))}
                                    value={newAviso}
                                />
                                <button type='submit'>
                                    Enviar
                                </button>
                            </form>
                        </div>
                        <div className='content-avisos'>
                            <ul>
                                {Object.keys(avisos).map((avisoId): any => {
                                    const avisoLista = avisos[avisoId];
                                    const isCreator = avisoLista.criador === userId;
                                    return (
                                        <li key={avisoId} className="aviso-item">
                                            {avisoLista.texto}
                                            {isCreator && (
                                                <button onClick={() => handleExcluirAviso(avisoId)}>X</button>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>

                    <div className='div-confirmados'>
                        <p>Confirmados</p>
                        <div className='content-confirmados'>
                            {confirmados.map((confirmado) => (
                                <div key={confirmado.userId} className='confirmado-item'>
                                    {confirmado.avatar ? (
                                        <img src={confirmado.avatar} alt={`Avatar de ${confirmado.userId}`} />
                                    ) : (
                                        <img src="https://cdn-icons-png.flaticon.com/512/3106/3106921.png" alt="Avatar padrão" />
                                    )}
                                    <p>{confirmado.userId}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className='div-louvores'>
                        <p>Louvores</p>
                        <div className='content-louvores'>
                            <ul>
                                <div>
                                    {louvores && Object.keys(louvores).length > 0 ? (
                                        Object.keys(louvores).map((louvorId: any) => {
                                            const louvorLista = louvores[louvorId];
                                            const votos = numeroVotos[louvorId];
                                            const isCreator = louvorLista.criador === userId;
                                            return (
                                                <li key={louvorId} id={louvorId}>
                                                    {votos} {louvorLista.texto}
                                                    {isCreator && (
                                                        <button onClick={() => handleExcluirLouvor(louvorId)}>Excluir</button> // Botão de exclusão aparece apenas se o usuário for o criador
                                                    )}
                                                    <input
                                                        type="checkbox"
                                                        checked={louvorLista.userVoted}
                                                        onChange={(e) => handleVotacaoLouvores(louvorId, e.target.checked)}
                                                    />
                                                </li>
                                            );
                                        })
                                    ) : (
                                        <p>Nenhuma música adicionada</p>
                                    )}
                                </div>
                            </ul>
                        </div>
                    </div>

                    <div className='div-sugestao'>
                        <div className='div-sugestao-input'>
                            <p>Sugestão</p>
                            <form onSubmit={handleSugestao}>
                                <input
                                    type="text"
                                    onChange={(e) => (setNovaSugestao(e.target.value))}
                                    value={novaSugestao}
                                />
                                <button type='submit'>
                                    Enviar
                                </button>
                            </form>
                        </div>
                        <div className='content-sugestao'>
                            <ul>
                                {Object.keys(sugestoesBanco).map((sugestaoId) => {
                                    const sugestaoLista = sugestoesBanco[sugestaoId];
                                    return (
                                        <li
                                            key={sugestaoId}>{sugestaoLista.texto}
                                            <input
                                                type="checkbox"
                                                onChange={(e) => handleVotacao(sugestaoId, e.target.checked)}
                                            />
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                    </div>
                </main>
            </div >
        </div >
    );
};
