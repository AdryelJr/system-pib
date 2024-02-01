import './style.scss'
import { useEffect, useState } from "react";
import LoadingSpinner from "../../componentes/loadingComponent";
import { useNavigate } from 'react-router-dom';

export function DetalhesDia() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    }, []);

    function handleHome() {
        navigate('/home')
    }
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
                        <h3>Culto Noite</h3>
                        <div className='child-informations'>
                            <span>Domingo</span>
                            <span>
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M3 9H21M7 3V5M17 3V5M7 13H17V17H7V13ZM6.2 21H17.8C18.9201 21 19.4802 21 19.908 20.782C20.2843 20.5903 20.5903 20.2843 20.782 19.908C21 19.4802 21 18.9201 21 17.8V8.2C21 7.07989 21 6.51984 20.782 6.09202C20.5903 5.71569 20.2843 5.40973 19.908 5.21799C19.4802 5 18.9201 5 17.8 5H6.2C5.0799 5 4.51984 5 4.09202 5.21799C3.71569 5.40973 3.40973 5.71569 3.21799 6.09202C3 6.51984 3 7.07989 3 8.2V17.8C3 18.9201 3 19.4802 3.21799 19.908C3.40973 20.2843 3.71569 20.5903 4.09202 20.782C4.51984 21 5.07989 21 6.2 21Z" stroke="#333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                                &nbsp; 18/06/2024
                            </span>
                        </div>
                        <div className='div-confirmation'>
                            <p>Confirmar Presença</p>
                            <button className='btn1'>Não</button>
                            <button className='btn2'>Sim</button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};
