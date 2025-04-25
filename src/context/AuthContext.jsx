import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../client';

const AuthContext = createContext(null);


export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [userId, setUserId] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // useEffect(() => {
    //     const {data: {subscription}} = supabase.auth.onAuthStateChange((event, session) => {
    //         if (event === 'SIGNED_OUT') {
    //             setCurrentUser(null);
    //         } else if (event === 'SIGNED_IN') {
    //             setCurrentUser(session?.user || null);
    //         }
    //         setLoading(false);
    //     });

    //     return () => {  
    //         subscription.unsubscribe();
    //     };
    // }, []);
    
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
        try {
            const {error, data} = await supabase.auth.signInWithPassword({
                email,
                password
            });
            
            if (error) {
                throw error;
            }
                
            setCurrentUser({
                username: data.user.user_metadata.username,
                email
            });

            setUserId(data.user.id);
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
        try {
            console.log('registering user...');
            const {data, error} = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {username}
                }
            });

            if (error) {
                throw error;
            }
            
            setCurrentUser({
                username,
                email
            });

            setUserId(data.user.id);
            
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    };
    
    // Logout function
    const logout = async () => {
        
        const {error} = await supabase.auth.signOut();
        if (error) {
            throw error;
        }
        setCurrentUser(null);
        setUserId(null);
        navigate('/');
    };

    const value = {
        currentUser,
        login,
        register,
        logout,
        userId,
        isAuthenticated: !!currentUser
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export default AuthContext; 