import { useUser } from "../../context/AuthContext"
import './style.scss'

export function ImgProfile() {
    const { user } = useUser();

    const photoURL = user?.photoURL ?? 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';
    const name = user?.name;
    return (
        <div className="ImgProfile">
            <img src={photoURL} alt={name} />
        </div>
    )
}