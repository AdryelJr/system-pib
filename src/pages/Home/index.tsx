import { useEffect, useState } from "react";
import { useUser } from "../../context/AuthContext"
import { useNavigate } from "react-router-dom";
import { handleSignOut } from "../../services/operacoes";
import logoImg from '../../assets/logo-removebg-preview.png';

import './style.scss'
import { ImgProfile } from "../../componentes/ImgProfile/ImgProfile";
import { onValue, ref } from "firebase/database";
import { database } from "../../services/firebase";
import { InfoDia } from "../../componentes/InfoDia";
import LoadingSpinner from "../../componentes/loadingComponent";

type Dia = {
    id: string;
    data: string;
    horario: string;
    tipoCulto: string;
};

type DadosDoFirebase = Record<string, Dia>;

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


    const [data, setData] = useState<DadosDoFirebase>({});

    useEffect(() => {
        const diasRef = ref(database, 'dias/');
        onValue(diasRef, (snapshot) => {
            const dadosDoFirebase = snapshot.val();
            if (dadosDoFirebase) {
                const dadosArray = Object.entries<Dia>(dadosDoFirebase);
                const dadosInvertidosArray = dadosArray.reverse();
                const dadosInvertidos: DadosDoFirebase = dadosInvertidosArray.reduce((acc, [key, value]) => {
                    acc[key] = value;
                    return acc;
                }, {} as DadosDoFirebase);
                setData(dadosInvertidos);
            } else {
                setData({});
            }
        });
    }, []);


    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    }, []);

    function handleProfile() {
        navigate('/profile')
    }

    function handleAdd() {
        navigate('/criardia')
    }
    function handleConfig() {
        navigate('/settings')
    }
    // function handleMusic() {
    //     navigate('/music')
    // }

    return (
        <div className='container-home'>
            {isLoading && <LoadingSpinner />}
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
                    {data && Object.keys(data).map((diaId) => {
                        const dia = data[diaId];
                        return (
                            <InfoDia
                                key={diaId}
                                id={diaId}
                                data={dia.data}
                                horario={dia.horario}
                                tipoCulto={dia.tipoCulto}
                            />
                        );
                    })}
                </main>


                <section className={`slide-bar ${isSlideBarOpen ? 'slide-bar-open' : ''}`}>
                    <div className={`slide-content ${isSlideContent ? 'slide-content-open' : ''}`}>
                        <div onClick={handleProfile} className="user-profile">
                            <ImgProfile />
                            <p>{user?.displayName}</p>
                            <span>{'>'}</span>
                        </div>
                        <nav className="nav-links">
                            <div className="div-ministerio">
                                <h3>Ministério</h3>
                                <h4>PiB</h4>
                            </div>
                            <div className="close">
                                {/* <div className="close-content-menu">
                                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12.5 8.89001V18.5M12.5 8.89001V5.57656C12.5 5.36922 12.5 5.26554 12.5347 5.17733C12.5653 5.09943 12.615 5.03047 12.6792 4.97678C12.752 4.91597 12.8503 4.88318 13.047 4.81761L17.447 3.35095C17.8025 3.23245 17.9803 3.17319 18.1218 3.20872C18.2456 3.23982 18.3529 3.31713 18.4216 3.42479C18.5 3.54779 18.5 3.73516 18.5 4.10989V7.42335C18.5 7.63069 18.5 7.73436 18.4653 7.82258C18.4347 7.90048 18.385 7.96943 18.3208 8.02313C18.248 8.08394 18.1497 8.11672 17.953 8.18229L13.553 9.64896C13.1975 9.76746 13.0197 9.82671 12.8782 9.79119C12.7544 9.76009 12.6471 9.68278 12.5784 9.57512C12.5 9.45212 12.5 9.26475 12.5 8.89001ZM12.5 18.5C12.5 19.8807 10.933 21 9 21C7.067 21 5.5 19.8807 5.5 18.5C5.5 17.1192 7.067 16 9 16C10.933 16 12.5 17.1192 12.5 18.5Z" stroke="#5c5c5c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                                    <button onClick={handleMusic}>Músicas</button>
                                </div> */}
                                <div className="close-content-menu config">
                                    <svg viewBox="-0.5 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg" transform="rotate(90)"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 7.82001H22" stroke="#333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M2 7.82001H4" stroke="#333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M20 16.82H22" stroke="#333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M2 16.82H12" stroke="#333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M8 11.82C10.2091 11.82 12 10.0291 12 7.82001C12 5.61087 10.2091 3.82001 8 3.82001C5.79086 3.82001 4 5.61087 4 7.82001C4 10.0291 5.79086 11.82 8 11.82Z" stroke="#838383" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M16 20.82C18.2091 20.82 20 19.0291 20 16.82C20 14.6109 18.2091 12.82 16 12.82C13.7909 12.82 12 14.6109 12 16.82C12 19.0291 13.7909 20.82 16 20.82Z" stroke="#838383" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                                    <button onClick={handleConfig}>Confirgurações</button>
                                </div>

                                <div className="close-content-menu ">
                                    <svg viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" ><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>entrance_fill</title> <g id="页面-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"> <g id="System" transform="translate(-672.000000, -144.000000)" fillRule="nonzero"> <g id="entrance_fill" transform="translate(672.000000, 144.000000)"> <path d="M24,0 L24,24 L0,24 L0,0 L24,0 Z M12.5934901,23.257841 L12.5819402,23.2595131 L12.5108777,23.2950439 L12.4918791,23.2987469 L12.4918791,23.2987469 L12.4767152,23.2950439 L12.4056548,23.2595131 C12.3958229,23.2563662 12.3870493,23.2590235 12.3821421,23.2649074 L12.3780323,23.275831 L12.360941,23.7031097 L12.3658947,23.7234994 L12.3769048,23.7357139 L12.4804777,23.8096931 L12.4953491,23.8136134 L12.4953491,23.8136134 L12.5071152,23.8096931 L12.6106902,23.7357139 L12.6232938,23.7196733 L12.6232938,23.7196733 L12.6266527,23.7031097 L12.609561,23.275831 C12.6075724,23.2657013 12.6010112,23.2592993 12.5934901,23.257841 L12.5934901,23.257841 Z M12.8583906,23.1452862 L12.8445485,23.1473072 L12.6598443,23.2396597 L12.6498822,23.2499052 L12.6498822,23.2499052 L12.6471943,23.2611114 L12.6650943,23.6906389 L12.6699349,23.7034178 L12.6699349,23.7034178 L12.678386,23.7104931 L12.8793402,23.8032389 C12.8914285,23.8068999 12.9022333,23.8029875 12.9078286,23.7952264 L12.9118235,23.7811639 L12.8776777,23.1665331 C12.8752882,23.1545897 12.8674102,23.1470016 12.8583906,23.1452862 L12.8583906,23.1452862 Z M12.1430473,23.1473072 C12.1332178,23.1423925 12.1221763,23.1452606 12.1156365,23.1525954 L12.1099173,23.1665331 L12.0757714,23.7811639 C12.0751323,23.7926639 12.0828099,23.8018602 12.0926481,23.8045676 L12.108256,23.8032389 L12.3092106,23.7104931 L12.3186497,23.7024347 L12.3186497,23.7024347 L12.3225043,23.6906389 L12.340401,23.2611114 L12.337245,23.2485176 L12.337245,23.2485176 L12.3277531,23.2396597 L12.1430473,23.1473072 Z" id="MingCute" fillRule="nonzero"> </path> <path d="M12,2.5 C12.8284,2.5 13.5,3.17157 13.5,4 C13.5,4.82843 12.8284,5.5 12,5.5 L12,5.5 L7,5.5 C6.72386,5.5 6.5,5.72386 6.5,6 L6.5,6 L6.5,18 C6.5,18.2761 6.72386,18.5 7,18.5 L7,18.5 L11.5,18.5 C12.3284,18.5 13,19.1716 13,20 C13,20.8284 12.3284,21.5 11.5,21.5 L11.5,21.5 L7,21.5 C5.067,21.5 3.5,19.933 3.5,18 L3.5,18 L3.5,6 C3.5,4.067 5.067,2.5 7,2.5 L7,2.5 Z M18.0606,8.11091 L20.889,10.9393 C21.4748,11.5251 21.4748,12.4749 20.889,13.0607 L18.0606,15.8891 C17.4748,16.4749 16.5251,16.4749 15.9393,15.8891 C15.3535,15.3033 15.3535,14.3536 15.9393,13.7678 L16.207,13.5 L12,13.5 C11.1716,13.5 10.5,12.8284 10.5,12 C10.5,11.1716 11.1716,10.5 12,10.5 L16.207,10.5 L15.9393,10.2322 C15.3535,9.64645 15.3535,8.6967 15.9393,8.11091 C16.5251,7.52513 17.4748,7.52513 18.0606,8.11091 Z" id="形状结合" fill="#636363"> </path> </g> </g> </g> </g></svg>
                                    <button onClick={handleSignOut}>Sair</button>
                                </div>
                            </div>
                        </nav>
                    </div>
                </section>
                {(user && user.uid === "Qu3xbobOndcykGPCNXMmoGWeXBC2" || user && user.uid === "Ge7RBqSFOcd9LxLul0y5A7gcjUh1") && (
                    <button className="btn-add-dia" onClick={handleAdd}>add</button>
                )}
            </div>
        </div>
    )
}
