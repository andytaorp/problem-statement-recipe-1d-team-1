import { Link } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";

function Navbar() {
    const {logout} = useLogout();
    const {user} = useAuthContext();

    const handleClick = () => {
        logout();
    }
    return(
        <header>
            <div className="container">
                <Link to="/">
                    <div className="Logo">
                        <img src="/Logo.png" alt="Recipe App" />
                        <h1>Recipe App</h1>
                    </div>
                </Link>
                <Link to="/nutrition">Nutrition Analysis</Link>
                <nav>
                    {user && (
                        <div>
                            <span>{user.email}</span>
                            <button onClick={handleClick}>Log Out</button>
                        </div>
                    )}
                    { !user && (
                        <div>
                            <Link to="/login">Login</Link>
                            <Link to="/signup">Signup</Link>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    )
}

export default Navbar;