import './style.scss'
import { useEffect, useState } from "react";
import LoadingSpinner from "../../componentes/loadingComponent";
import { useNavigate } from 'react-router-dom';
import { ImgProfile } from '../../componentes/ImgProfile/ImgProfile';

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

                    <div className='div-avisos'>
                        <div className='svg'>
                            <svg height="25px" width="25px" version="1.1" id="_x32_" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xmlSpace="preserve" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <style type="text/css"> </style> <g> <path d="M256.007,357.113c-16.784,0-30.411,13.613-30.411,30.397c0,16.791,13.627,30.405,30.411,30.405 s30.397-13.614,30.397-30.405C286.405,370.726,272.792,357.113,256.007,357.113z"></path> <path d="M505.097,407.119L300.769,53.209c-9.203-15.944-26.356-25.847-44.777-25.847 c-18.407,0-35.544,9.904-44.747,25.847L6.902,407.104c-9.203,15.943-9.203,35.751,0,51.694c9.204,15.943,26.356,25.84,44.763,25.84 h408.67c18.406,0,35.559-9.897,44.762-25.84C514.301,442.855,514.301,423.047,505.097,407.119z M464.465,432.405 c-2.95,5.103-8.444,8.266-14.35,8.266H61.878c-5.892,0-11.394-3.163-14.329-8.281c-2.964-5.11-2.979-11.445-0.014-16.548 l194.122-336.24c2.943-5.103,8.436-8.274,14.35-8.274c5.9,0,11.386,3.171,14.336,8.282l194.122,336.226 C467.415,420.945,467.415,427.295,464.465,432.405z"></path> <path d="M256.007,152.719c-16.784,0-30.411,13.613-30.411,30.405l11.68,137.487c0,10.346,8.378,18.724,18.731,18.724 c10.338,0,18.731-8.378,18.731-18.724l11.666-137.487C286.405,166.331,272.792,152.719,256.007,152.719z"></path> </g> </g></svg>
                            <p> Avisos</p>
                        </div>
                        <div className='content-avisos'>
                            <p>Horário do ensáio mudou! 17:00!!!</p>
                        </div>
                    </div>

                    <div className='div-confirmados'>
                        <p>Confirmados</p>
                        <div className='content-confirmados'>
                            <ImgProfile />
                            <ImgProfile />
                            <ImgProfile />
                        </div>
                    </div>

                    <div className='div-louvores'>
                        <p>Louvores</p>
                        <div className='content-louvores'>
                            <ul>
                                <li>Música 1</li>
                                <li>Música 2</li>
                                <li>Música 3</li>
                                <li>Música 4</li>
                            </ul>
                        </div>
                    </div>

                </main>
            </div>
        </div>
    );
};
