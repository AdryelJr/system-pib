import { useNavigate } from 'react-router-dom';
import './style.scss';

export const InfoDia = ({ id, data, horario, tipoCulto }: any) => {
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
            id:id,
            data: data,
            horario: horario,
            tipoCulto: tipoCulto,
            diaSemanaFormatado: diaSemanaFormatado
        };

        navigate(`/detalhes/${id}`, { state: { informacoesDia } });
    };

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
                    <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="confirmados" />
                    <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="confirmados" />
                    <p>{horario}</p>
                </div>
            </div>
        </div>
    );
};
