import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreatePost.css';

const CreatePost = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        imageUrl: '',
        category: 'general'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // In a real app, this would send data to an API
        console.log('Submitted win:', formData);
        // Redirect to home after submission
        navigate('/');
    };

    return (
        <div className="create-post-container">
            <div className="page-header">
                <h2>Share Your Win</h2>
                <p>Big or small, every step forward deserves celebration!</p>
            </div>

            <div className="card form-card">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="title">Title your win*</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="My achievement in a few words..."
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="content">Share the details*</label>
                        <textarea
                            id="content"
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            placeholder="I finally..."
                            rows={4}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="imageUrl">Image URL (optional)</label>
                        <input
                            type="url"
                            id="imageUrl"
                            name="imageUrl"
                            value={formData.imageUrl}
                            onChange={handleChange}
                            placeholder="https://example.com/image.jpg"
                        />
                        <p className="form-hint">Add an image to celebrate your win! Paste a URL to an image.</p>
                    </div>

                    <div className="form-group">
                        <label htmlFor="category">Category</label>
                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                        >
                            <option value="general">General</option>
                            <option value="fitness">Fitness</option>
                            <option value="learning">Learning</option>
                            <option value="mental-health">Mental Health</option>
                            <option value="work">Work</option>
                            <option value="personal">Personal</option>
                        </select>
                    </div>
                
                    <div className="form-actions">
                        <button type="button" className="btn-secondary" onClick={() => navigate('/')}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary">
                            Share Win
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreatePost;