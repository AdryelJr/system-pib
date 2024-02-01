import { useParams } from "react-router-dom";
import './style.scss'

export function DetalhesDia() {
    const { id } = useParams();

    return (
        <div className="content-detalhesDia">
            <h1>Detalhes da Programação</h1>
            <p>ID da Programação: {id}</p>
        </div>
    );
};
