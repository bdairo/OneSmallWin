import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreatePost.css';
import CATEGORIES from '../../contants';
import supabase from '../../client';
import { useAuth } from '../../context/AuthContext';

const CreatePost = () => {
    const {userId} = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        imageUrl: '',
        category: CATEGORIES[0]
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try{

            const data = {
                user_id: userId,
                title: formData.title,
                content: formData.content,
                image_url: formData.imageUrl,
                category: formData.category
            }
            console.log('data', data);

            await supabase.from('posts').insert(data);
            console.log('Submitted win:', data);
            
            navigate('/');

        } catch (error) {
            console.error('Error submitting win:', error);
        }
       
       
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
                        {Object.values(CATEGORIES).map((category, index) => (
                            <option key={index} value={category}>{category}</option>
                        ))}
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