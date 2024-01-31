import { useEffect } from "react";
import { useUser } from "../../context/AuthContext"
import { useNavigate } from "react-router-dom";
import { handleSignOut } from "../../services/operacoes";
import { logoImg } from '../../assets/logo-removebg-preview.png';

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
        <div className="contianer-home">
            <div className="content">
                <header>
                    <div className="hamb">
                        icon hamb
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
