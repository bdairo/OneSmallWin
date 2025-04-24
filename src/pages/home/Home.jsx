import './Home.css'
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Home = () => {
    const location = useLocation();
    const [sortBy, setSortBy] = useState('newest');
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');
    
    useEffect(() => {
        console.log('location', location);
        const params = new URLSearchParams(location.search);
        const searchQuery = params.get('search');
        if (searchQuery) {
            setSearchTerm(searchQuery);
        }
    }, [location.search]);
    
    // Sample data - in a real app, this would come from an API
    const samplePosts = [
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

    // Filter and sort posts based on user selection
    const getFilteredPosts = () => {
        // console.log('in getFilteredPosts');
        // First filter by search term
        let filteredPosts = samplePosts.filter(post => 
            post.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        // console.log('searchTerm', searchTerm);
        // console.log('filteredPosts', filteredPosts);
        // Then filter by category if not "all"
        if (activeCategory !== 'all') {
            filteredPosts = filteredPosts.filter(post => 
                post.category === activeCategory
            );
        }
        
        // Finally sort by selected criteria
        if (sortBy === 'newest') {
            return [...filteredPosts].sort((a, b) => b.date - a.date);
        } else if (sortBy === 'popular') {
            return [...filteredPosts].sort((a, b) => b.upvotes - a.upvotes);
        }

        // console.log(filteredPosts);
        return filteredPosts;
    };

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

    // Handle category change
    const handleCategoryChange = (category) => {
        setActiveCategory(category);
    };

    return (
        <div className="home-container">
            <div className="feed-header">
                <div className="title-and-filters">
                    <h2>Recent Wins</h2>
                    <div className="feed-filters">
                        <button 
                            className={`filter-btn ${activeCategory === 'all' ? 'active' : ''}`}
                            onClick={() => handleCategoryChange('all')}
                        >
                            All
                        </button>
                        <button 
                            className={`filter-btn ${activeCategory === 'fitness' ? 'active' : ''}`}
                            onClick={() => handleCategoryChange('fitness')}
                        >
                            Fitness
                        </button>
                        <button 
                            className={`filter-btn ${activeCategory === 'learning' ? 'active' : ''}`}
                            onClick={() => handleCategoryChange('learning')}
                        >
                            Learning
                        </button>
                        <button 
                            className={`filter-btn ${activeCategory === 'mental-health' ? 'active' : ''}`}
                            onClick={() => handleCategoryChange('mental-health')}
                        >
                            Mental Health
                        </button>
                    </div>
                </div>

                <div className="sort-options">
                    <label>Sort by:</label>
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                        <option value="newest">Newest</option>
                        <option value="popular">Most Upvoted</option>
                    </select>
                </div>
            </div>

            <div className="posts-feed">
                {getFilteredPosts().length > 0 ? (
                    getFilteredPosts().map(post => (
                        <Link to={`/post/${post.id}`} className="post-link" key={post.id}>
                            <div className="card post-card">
                                <div className="post-header">
                                    <div className="post-user-info">
                                        
                                        <div className="post-meta">
                                            <span className="username">{post.username}</span>
                                            <span className="post-date">{formatDate(post.date)}</span>
                                        </div>
                                        <h3 className="post-title">{post.title}</h3>
                                    </div>
                                    <div className={`post-category ${post.category}`}>
                                        {post.category}
                                    </div>
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
                        </Link>
                    ))
                ) : (
                    <div className="no-posts-message">
                        <p>No wins found matching your search. Try a different search term or category.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Home;