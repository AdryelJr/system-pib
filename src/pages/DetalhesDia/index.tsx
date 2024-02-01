import { useParams } from "react-router-dom";
import './style.scss'
import { useEffect, useState } from "react";
import LoadingSpinner from "../../componentes/loadingComponent";

export function DetalhesDia() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    }, []);
    const { id } = useParams();

    return (
        <div className="content-detalhesDia">
            {isLoading && <LoadingSpinner />}
            <h1>Detalhes da Programação</h1>
            <p>ID da Programação: {id}</p>
        </div>
    );
};
