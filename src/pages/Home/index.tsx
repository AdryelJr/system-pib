import { useEffect } from "react";
import { useUser } from "../../context/AuthContext"
import { useNavigate } from "react-router-dom";

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
            Home
        </div>
    )
}
