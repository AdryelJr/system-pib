import { useNavigate } from 'react-router-dom';
import './style.scss'
import { useEffect, useState } from 'react';
import LoadingSpinner from '../../componentes/loadingComponent';
import { useUser } from '../../context/AuthContext';


export function Profile() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

    const { user } = useUser();

    const userPhotoURL = user?.photoURL ?? 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGu0c9KGiQZE5Lofd9RW_1omNOVUSiZ3ZSIQ&usqp=CAU'
    const userName = user?.displayName ?? 'Name'

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    }, []);

    function handleHome() {
        navigate('/home')
    }

    return (
        <div className="container-profile">
            {isLoading && <LoadingSpinner />}

            <div className='content-profile'>
                <header>
                    <svg onClick={handleHome} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M6 12H18M6 12L11 7M6 12L11 17" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                </header>
                <div className='div-bg'>
                </div>
                <main>
                    <div className='div-img'>
                        <img src={userPhotoURL} alt={userName} />
                        <input type="file" placeholder='+' />
                    </div>
                    <h2>Adryel Júnio</h2>
                </main>
            </div >
        </div >
    );
};
