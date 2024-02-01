import { ptBR } from 'date-fns/locale';
import { format } from 'date-fns';
import './style.scss';
import { Link } from 'react-router-dom';

export const InfoDia = ({ id, data, horario, tipoCulto }: any) => {
    const [dia, mes, ano] = data.split('/');
    const mesesAbreviados = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
    const nomeDoMes = mesesAbreviados[parseInt(mes, 10) - 1];
    const dataObj = new Date(`${mes}-${dia}-${ano}`);
    const nomeDia = capitalize(format(dataObj, 'EEEE', { locale: ptBR }));

    const informacoesDia = {
        data: data,
        horario: horario,
        tipoCulto: tipoCulto
    }

    return (
        <Link to={{ pathname: `/detalhes/${id}`, state: { informacoesDia } } as any} className="content-infoDia">
            <div className="div-colum">
                <span className="dia-culto">{dia}</span>
                <span className="mes-culto">{nomeDoMes}</span>
                <span className="barrinha">|</span>
            </div>
            <div className="div-row-content">
                <span>{nomeDia}</span>
                <div className="row-content">
                    <p>{tipoCulto}</p>
                    <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="confirmados" />
                    <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="confirmados" />
                    <p>{horario}</p>
                </div>
            </div>
        </Link>
    );
};

const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};
