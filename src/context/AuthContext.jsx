import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Create the auth context
const AuthContext = createContext(null);

// Custom hook to use the auth context
export const useAuth = () => {
    return useContext(AuthContext);
};

// Provider component to wrap the app and provide auth state
export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Load user from localStorage on startup
    useEffect(() => {
        const checkLoggedIn = async () => {
            const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
            
            if (isLoggedIn) {
                // In a real app with Supabase, this would verify the session
                const username = localStorage.getItem('username');
                setCurrentUser({
                    username,
                    // Would include more user data from Supabase
                });
            }
            
            setLoading(false);
        };
        
        checkLoggedIn();
    }, []);

    // Login function
    const login = async (email, password) => {
        // In a real app, this would call Supabase auth.signIn
        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // This is where you'd validate credentials with Supabase
            if (!email || !password) {
                throw new Error('Please fill in all fields');
            }
            
            // Simulate successful login
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('username', email.split('@')[0]);
            
            setCurrentUser({
                username: email.split('@')[0],
                email
            });
            
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    };
    
    // Register function
    const register = async (username, email, password) => {
        // In a real app, this would call Supabase auth.signUp
        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 800));
            
            // This is where you'd create a user with Supabase
            if (!username || !email || !password) {
                throw new Error('Please fill in all fields');
            }
            
            // Simulate successful registration
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('username', username);
            
            setCurrentUser({
                username,
                email
            });
            
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    };
    
    // Logout function
    const logout = () => {
        // In a real app, this would call Supabase auth.signOut
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
        setCurrentUser(null);
        navigate('/');
    };

    const value = {
        currentUser,
        login,
        register,
        logout,
        isAuthenticated: !!currentUser
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export default AuthContext; 