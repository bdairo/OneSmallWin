import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaUserCircle } from "react-icons/fa";
import { useAuth } from '../../context/AuthContext';
import './navbar.css';

const Navbar = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const { currentUser, logout, isAuthenticated } = useAuth();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/?search=${encodeURIComponent(searchTerm)}`);
        }
    };

    return (
        <div className="navbar-container">
            <Link to="/" className="logo-link">
                <h1>One Small Win</h1>
            </Link>
            
            <form className="search-form" onSubmit={handleSearch}>
                <input 
                    type="text" 
                    placeholder="Search wins..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="submit" className="search-btn">
                  <FaSearch />
                </button>
            </form>
            
            <div className="navbar-links">
                <Link to="/">Home</Link>
                
                {isAuthenticated ? (
                    <>
                        <Link to="/my-wins">My Wins</Link>
                        <Link to="/create-post">Post a win</Link>
                        <div className="user-menu">
                            <span className="username-display">
                                <FaUserCircle /> {currentUser?.username}
                            </span>
                            <button className="logout-btn" onClick={logout}>
                                Logout
                            </button>
                        </div>
                    </>
                ) : (
                    <Link to="/auth" className="auth-link">Sign In</Link>
                )}
            </div>
        </div>
    );
};

export default Navbar;