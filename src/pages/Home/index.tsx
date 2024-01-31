import { useEffect } from "react";
import { useUser } from "../../context/AuthContext"
import { useNavigate } from "react-router-dom";
import { handleSignOut } from "../../services/operacoes";
import logoImg from '../../assets/logo-removebg-preview.png';

import './style.scss'

export function Home() {
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

    return (
        <div className="container-home">
            <div className="content">
                <header>
                    <div className="hamb">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M4 18L20 18" stroke="#000000" stroke-width="2" stroke-linecap="round"></path> <path d="M4 12L20 12" stroke="#000000" stroke-width="2" stroke-linecap="round"></path> <path d="M4 6L20 6" stroke="#000000" stroke-width="2" stroke-linecap="round"></path> </g></svg>
                    </div>
                    <div className="div-span">
                        <span>Graça e Paz!</span>
                        <span>Seja Bem-Vindo!</span>
                    </div>
                    <div className="div-nav">
                        <img src={logoImg} alt="logo" />
                    </div>
                </header>


                <button onClick={handleSignOut}>Sair</button>


            </div>
        </div>
    )
}
