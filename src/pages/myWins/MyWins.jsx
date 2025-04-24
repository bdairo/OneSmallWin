import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './MyWins.css';

const MyWins = () => {
    const [userPosts, setUserPosts] = useState([]);
    const navigate = useNavigate();
    
    // In a real app, you would fetch the user's posts from an API
    useEffect(() => {
        // Mock data - this would be fetched from an API based on the logged-in user
        const mockUserPosts = [
            {
                id: 2,
                username: "CurrentUser", // This would be the logged-in user
                title: "React Component Success!",
                date: new Date(Date.now() - 86400000), // 1 day ago
                content: "After struggling with React for weeks, I finally built my first component that actually works! It's not perfect, but it's progress. 💻",
                imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
                upvotes: 18,
                category: "learning",
                comments: [
                    { id: 3, username: "ReactMaster", content: "The first component is the hardest. It gets easier!", date: new Date(Date.now() - 43200000) }
                ]
            },
            {
                id: 4,
                username: "CurrentUser", // This would be the logged-in user
                title: "Finished Reading a Book",
                date: new Date(Date.now() - 172800000), // 2 days ago
                content: "Finally finished that book I've been reading for months. Small victory but it feels good to complete something!",
                imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
                upvotes: 12,
                category: "personal",
                comments: []
            }
        ];

        setUserPosts(mockUserPosts);
    }, []);

    // Format date to relative time (e.g., "2 hours ago")
    const formatDate = (date) => {
        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / 60000);
        
        if (minutes < 60) {
            return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
        }
        
        const hours = Math.floor(minutes / 60);
        if (hours < 24) {
            return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
        }
        
        const days = Math.floor(hours / 24);
        return `${days} day${days !== 1 ? 's' : ''} ago`;
    };

    return (
        <div className="my-wins-container">
            <div className="page-header">
                <h2>My Wins</h2>
                <p>Here are all the wins you've shared</p>
            </div>

            {userPosts.length > 0 ? (
                <div className="posts-feed">
                    {userPosts.map(post => (
                        <div 
                            className="card post-card" 
                            key={post.id} 
                            onClick={() => navigate(`/post/${post.id}`)} 
                            style={{ cursor: 'pointer' }}
                        >
                            <div className="post-header">
                                <div className="post-user-info">
                                    <h3 className="post-title">{post.title}</h3>
                                    <div className="post-meta">
                                        <span className="post-date">{formatDate(post.date)}</span>
                                    </div>
                                </div>
                                <div className={`post-category ${post.category}`}>
                                    {post.category}
                                </div>
                            </div>
                            <div className="post-content-preview">
                                {post.content.length > 120 
                                    ? post.content.substring(0, 120) + '...' 
                                    : post.content
                                }
                            </div>
                            <div className="post-actions">
                                <div className="button-upvote">
                                    <span>👏</span> {post.upvotes}
                                </div>
                                <div className="post-comments-count">
                                    <span>💬</span> {post.comments.length}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="no-posts-message">
                    <p>You haven't shared any wins yet.</p>
                    <button 
                        className="btn-primary" 
                        onClick={() => navigate('/create-post')}
                    >
                        Share Your First Win
                    </button>
                </div>
            )}
        </div>
    );
};

export default MyWins; 