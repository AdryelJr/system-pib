import { useNavigate } from 'react-router-dom';
import './style.scss';
import { useEffect, useState } from 'react';
import { onValue, ref } from 'firebase/database';
import { database } from '../../services/firebase';
import { useUser } from '../../context/AuthContext';

interface Confirmado {
    userId: string;
    avatar?: string;
    confirmacao: boolean;
}

export const InfoDia = ({ id, data, horario, tipoCulto }: any) => {
    const { user } = useUser();
    const userID = user?.uid ?? 'false';
    const userAvatar = user?.photoURL ?? 'sem';
    const navigate = useNavigate();
    const partesData = data.split('/');
    const dataFormatada = new Date(partesData[2], partesData[1] - 1, partesData[0]);
    const formatter = new Intl.DateTimeFormat("pt-BR", {
        weekday: "long",
        month: "short",
        day: "numeric"
    });

    const newData = formatter.format(dataFormatada);
    const partesFormatadas = newData.split(' ');
    const diaSemanaFormatado = partesFormatadas[0].charAt(0).toUpperCase() + partesFormatadas[0].slice(1).replace(',', '');
    const diaFormatado = partesFormatadas[1];
    const mesFormatado = partesFormatadas[3].replace('.', '').toUpperCase();

    const handleDetalhesClick = () => {
        const informacoesDia = {
            id: id,
            data: data,
            horario: horario,
            tipoCulto: tipoCulto,
            diaSemanaFormatado: diaSemanaFormatado
        };

        navigate(`/detalhes/${id}`, { state: { informacoesDia } });
    };

    const [confirmados, setConfirmados] = useState<Confirmado[]>([]);
    const [hasConfirmedUsers, setHasConfirmedUsers] = useState<boolean>(false);

    useEffect(() => {
        const confirmRef = ref(database, `dias/${id}/infoUser`);
        onValue(confirmRef, (snapshot) => {
            const dadosConfirmados: Record<string, Confirmado> = snapshot.val();
            const confirmadosArray = Object.values(dadosConfirmados || {}).filter((user) => user.confirmacao);
            setConfirmados(confirmadosArray);
            setHasConfirmedUsers(confirmadosArray.length > 0);
        });
    }, [id, userID, userAvatar]);

    return (
        <div className="content-infoDia" onClick={handleDetalhesClick}>
            <div className="div-colum">
                <span className="dia-culto">{diaFormatado}</span>
                <span className="mes-culto">{mesFormatado}</span>
                <span className="barrinha">|</span>
            </div>
            <div className="div-row-content">
                <span>{diaSemanaFormatado}</span>
                <div className="row-content">
                    <p>{tipoCulto}</p>
                    {hasConfirmedUsers ? (
                        confirmados.map((confirmado) => (
                            <div key={confirmado.userId} className='confirmado-item'>
                                {confirmado.avatar ? (
                                    <img src={confirmado.avatar} alt={`Avatar de ${confirmado.userId}`} />
                                ) : (
                                    <div />
                                )}
                                <p>{confirmado.userId}</p>
                            </div>
                        ))
                    ) : (
                        <div className='confirmado-item'>
                            <p className='ninguem-confirmardo'>Nenhum confirmado</p>
                        </div>
                    )}
                    <p>{horario}</p>
                </div>
            </div>
        </div>
    );
};
