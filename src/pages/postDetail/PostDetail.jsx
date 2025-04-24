import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import './PostDetail.css';

const PostDetail = () => {
    const { isAuthenticated } = useAuth();
    const { id } = useParams();
    const navigate = useNavigate(); 
    const [post, setPost] = useState(null);
    const [comment, setComment] = useState('');
   
    const [alert, setAlert] = useState(false);

    // In a real app, this would be fetched from an API
    useEffect(() => {
        // Mock data - this would be a fetch call to an API
        const mockPosts = [
            {
                id: 1,
                username: "GrowthMindset",
                title: "My First 5K Run!",
                date: new Date(Date.now() - 7200000), // 2 hours ago
                content: "Finally finished my first 5K run today after training for 3 months! 🏃‍♀️ Small steps, big achievement for me!",
                imageUrl: "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
                upvotes: 24,
                category: "fitness",
                comments: [
                    { id: 1, username: "RunnerFriend", content: "Congrats! That's a big deal!", date: new Date(Date.now() - 3600000) },
                    { id: 2, username: "HealthyHabits", content: "What's your next goal?", date: new Date(Date.now() - 1800000) }
                ]
            },
            {
                id: 2,
                username: "CodeJourney",
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
                id: 3,
                username: "MindfulMatters",
                title: "Daily Meditation Streak",
                date: new Date(Date.now() - 259200000), // 3 days ago
                content: "Set a goal to meditate every morning this week and actually did it! Even if it was just 5 minutes each day, I'm proud of building this habit. 🧘‍♂️",
                imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
                upvotes: 32,
                category: "mental-health",
                comments: []
            }
        ];

        const foundPost = mockPosts.find(p => p.id === parseInt(id));
        setPost(foundPost);
        
        // if (foundPost) {
        //     setEditFormData({
        //         title: foundPost.title,
        //         content: foundPost.content,
        //         imageUrl: foundPost.imageUrl,
        //         category: foundPost.category
        //     });
        // }
    }, [id]);

    if (!post) {
        return <div className="post-detail-loading">Loading post...</div>;
    }

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

    const handleUpvote = () => {
        console.log('isAuthenticated', isAuthenticated);
        console.log('in handleUpvote');
        if (!isAuthenticated) {
            setAlert(true);
            return;
        }

        setPost(prev => ({
            ...prev,
            upvotes: prev.upvotes + 1
        }));
    };

    const handleAddComment = (e) => {
        e.preventDefault();
        if (!comment.trim()) return;

        if (!isAuthenticated) {
            setAlert(true);
            return;
        }

        const newComment = {
            id: post.comments.length + 1,
            username: "CurrentUser", // In a real app, this would be the logged-in user
            content: comment,
            date: new Date()
        };

        setPost(prev => ({
            ...prev,
            comments: [...prev.comments, newComment]
        }));
        
        setComment('');
    };

    return (
        <div className="post-detail-container">
           
                <div className="post-content-container">
                    <div className="post-header-actions">
                        <button className="btn-back" onClick={() => navigate('/')}>
                            ← Back to Feed
                        </button>
                       
                    </div>

                    <div className="card post-detail-card">
                        <div className="post-header">
                            <h1 className="post-title">{post.title}</h1>
                            <div className="post-meta">
                                <span className="username">{post.username}</span>
                                <span className="post-date">{formatDate(post.date)}</span>
                                <div className={`post-category ${post.category}`}>
                                    {post.category}
                                </div>
                            </div>
                        </div>
                        
                        <div className="post-content">
                            <p>{post.content}</p>
                        </div>
                        
                        {post.imageUrl && (
                            <div className="post-image">
                                <img src={post.imageUrl} alt={post.title} />
                            </div>
                        )}
                        
                        <div className="post-engagement">
                            <button className="button-upvote" onClick={handleUpvote} >
                                <span>👏</span> {post.upvotes} Upvotes
                            </button>

                            {alert && (
                                <Snackbar open={alert} autoHideDuration={3000} onClose={() => setAlert(false)}>
                                    <Alert severity="error">
                                        Please log in to upvote
                                    </Alert>
                                </Snackbar>
                            )}
                        </div>
                    </div>

                    <div className="card comments-section">
                        <h3>Comments ({post.comments.length})</h3>
                        
                       {isAuthenticated && <form className="comment-form" onSubmit={handleAddComment}>
                            <textarea
                                placeholder="Add a comment..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                rows={2}
                                required
                            />
                            <button type="submit" className="btn-primary">Post Comment</button>
                        </form>}
                        
                        <div className="comments-list">
                            {post.comments.length > 0 ? (
                                post.comments.map(comment => (
                                    <div className="comment" key={comment.id}>
                                        <div className="comment-header">
                                            <span className="comment-username">{comment.username}</span>
                                            <span className="comment-date">{formatDate(comment.date)}</span>
                                        </div>
                                        <div className="comment-content">
                                            {comment.content}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="no-comments">No comments yet. Be the first to comment!</div>
                            )}
                        </div>
                    </div>
                </div>
            
        </div>
    );
};

export default PostDetail; 