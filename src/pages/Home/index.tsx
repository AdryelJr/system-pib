import { useEffect, useState } from "react";
import { useUser } from "../../context/AuthContext"
import { useNavigate } from "react-router-dom";
import { handleSignOut } from "../../services/operacoes";
import logoImg from '../../assets/logo-removebg-preview.png';

import './style.scss'

export function Home() {
    const [isSlideBarOpen, setIsSlideBarOpen] = useState(false);
    const [isSlideContent, setIsSlideContent] = useState(false);
    const navigate = useNavigate();
    const { user, authChecked } = useUser();

    useEffect(() => {
        if (!authChecked) {
            return;
        }
        if (!user) {
            navigate('/');
        }
    }, [user, authChecked, navigate]);

    function slideBarClick() {
        setIsSlideBarOpen(!isSlideBarOpen)
        setTimeout(() => {
            setIsSlideContent(true)
        }, 300)
    }

    const slideBarBody = () => {
        setIsSlideContent(false)
        setTimeout(() => {
            setIsSlideBarOpen(false)
        }, 100)
    }

    return (
        <div className='container-home'>
            <div className="content" >
                <header>
                    <div className="hamb" onClick={slideBarClick}>
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                            <g id="SVGRepo_iconCarrier">
                                <path d="M4 18L20 18" stroke="#000000" strokeWidth="2" strokeLinecap="round"></path>
                                <path d="M4 12L20 12" stroke="#000000" strokeWidth="2" strokeLinecap="round"></path>
                                <path d="M4 6L20 6" stroke="#000000" strokeWidth="2" strokeLinecap="round"></path>
                            </g>
                        </svg>
                    </div>
                    <div className="div-span" onClick={slideBarBody}>
                        <span>Graça e Paz!</span>
                        <span>Seja Bem-Vindo!</span>
                    </div>
                    <div className="div-nav">
                        <img src={logoImg} alt="logo" />
                    </div>
                </header>

                <main onClick={slideBarBody}>
                    <div className="main-header">
                        <h3>Programações</h3>
                    </div>

                    <div className="content-main">
                        <div className="div-colum">
                            <span className="dia-culto">18</span>
                            <span className="mes-culto">JUN</span>
                            <span className="barrinha">|</span>
                        </div>
                        <div className="div-row-content">
                            <span>Domingo</span>
                            <div className="row-content">
                                <p>Culto Noite</p>
                                <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="confirmados" />
                                <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="confirmados" />
                                <p>18:00</p>
                            </div>
                        </div>
                    </div>

                    <div className="content-main">
                        <div className="div-colum">
                            <span className="dia-culto">24</span>
                            <span className="mes-culto">JUN</span>
                            <span className="barrinha">|</span>
                        </div>
                        <div className="div-row-content">
                            <span>Domingo</span>
                            <div className="row-content">
                                <p>Culto Noite</p>
                                <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="confirmados" />
                                <p>18:00</p>
                            </div>
                        </div>
                    </div>
                </main>


                <section className={`slide-bar ${isSlideBarOpen ? 'slide-bar-open' : ''}`}>
                    <div className={`slide-content ${isSlideContent ? 'slide-content-open' : ''}`}>
                        <div className="user-profile">
                            <img src="caminho-para-foto" alt="Foto do usuário" />
                            <p>Adryel</p>
                        </div>
                        <nav className="nav-links">
                            <a href="#">Perfil</a>
                            <a href="#">Configurações</a>
                            <button onClick={handleSignOut}>Sair</button>
                        </nav>
                    </div>
                </section>
            </div>
        </div>
    )
}
