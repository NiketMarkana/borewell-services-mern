import React, { useEffect, useState } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

const StarPicker = ({ value, onChange, readOnly = false, size = 22 }) => {
    const [hovered, setHovered] = useState(0);
    return (
        <div className="stars" style={{ display: 'inline-flex', gap: 2 }}>
            {[1, 2, 3, 4, 5].map(star => (
                <span
                    key={star}
                    onClick={() => !readOnly && onChange && onChange(star)}
                    onMouseEnter={() => !readOnly && setHovered(star)}
                    onMouseLeave={() => !readOnly && setHovered(0)}
                    style={{
                        fontSize: size,
                        cursor: readOnly ? 'default' : 'pointer',
                        color: star <= (hovered || value) ? '#f59e0b' : '#d1d5db',
                        transition: 'color 0.15s',
                        userSelect: 'none',
                        lineHeight: 1
                    }}
                >
                    ★
                </span>
            ))}
        </div>
    );
};

const AverageStars = ({ reviews }) => {
    if (!reviews || reviews.length === 0) return null;
    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    const rounded = Math.round(avg * 10) / 10;
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <StarPicker value={Math.round(avg)} readOnly size={20} />
            <span style={{ fontWeight: 700, color: '#f59e0b', fontSize: '1rem' }}>{rounded}</span>
            <span style={{ color: 'var(--text-light)', fontSize: '0.88rem' }}>({reviews.length} review{reviews.length !== 1 ? 's' : ''})</span>
        </div>
    );
};

const ReviewSection = ({ targetType, targetId }) => {
    const { user } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Edit state
    const [editingId, setEditingId] = useState(null);
    const [editRating, setEditRating] = useState(0);
    const [editComment, setEditComment] = useState('');
    const [editLoading, setEditLoading] = useState(false);
    const [editError, setEditError] = useState('');

    const fetchReviews = async () => {
        try {
            setFetchLoading(true);
            const { data } = await api.get(`/reviews?targetType=${targetType}&targetId=${targetId}`);
            setReviews(data);
        } catch (err) {
            console.error('Failed to fetch reviews', err);
        } finally {
            setFetchLoading(false);
        }
    };

    useEffect(() => {
        if (targetId) fetchReviews();
    }, [targetType, targetId]);

    // Determine if the current user already has a review
    const myReview = user ? reviews.find(r => r.user === user.id || r.user === user._id) : null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!rating) {
            setError('Please select a star rating.');
            return;
        }

        setLoading(true);
        try {
            await api.post('/reviews', { targetType, targetId, rating, comment });
            setSuccess('Your review has been submitted! Thank you.');
            setRating(0);
            setComment('');
            await fetchReviews();
        } catch (err) {
            setError(err?.response?.data?.message || 'Failed to submit review.');
        } finally {
            setLoading(false);
        }
    };

    const startEdit = (r) => {
        setEditingId(r._id);
        setEditRating(r.rating);
        setEditComment(r.comment || '');
        setEditError('');
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditRating(0);
        setEditComment('');
        setEditError('');
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setEditError('');
        if (!editRating) {
            setEditError('Please select a star rating.');
            return;
        }
        setEditLoading(true);
        try {
            await api.put(`/reviews/${editingId}`, { rating: editRating, comment: editComment });
            setEditingId(null);
            await fetchReviews();
        } catch (err) {
            setEditError(err?.response?.data?.message || 'Failed to update review.');
        } finally {
            setEditLoading(false);
        }
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'short', year: 'numeric'
        });
    };

    return (
        <div className="review-section">
            <h4 style={{ marginBottom: 8, marginTop: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>⭐</span> Ratings &amp; Reviews
            </h4>

            {fetchLoading ? (
                <p className="muted" style={{ fontSize: '0.88rem' }}>Loading reviews…</p>
            ) : (
                <>
                    <AverageStars reviews={reviews} />

                    {reviews.length === 0 && (
                        <p className="muted" style={{ fontSize: '0.9rem', marginBottom: 12 }}>No reviews yet. Be the first!</p>
                    )}

                    {/* Review list */}
                    {reviews.map(r => {
                        const isOwner = user && (r.user === user.id || r.user === user._id);

                        if (isOwner && editingId === r._id) {
                            // Inline edit form for owner's review
                            return (
                                <div key={r._id} className="review-card" style={{ borderColor: 'var(--primary)', background: 'var(--primary-light)' }}>
                                    <p style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: 8 }}>Edit your review</p>
                                    <form onSubmit={handleEditSubmit}>
                                        <div style={{ marginBottom: 10 }}>
                                            <StarPicker value={editRating} onChange={setEditRating} size={26} />
                                        </div>
                                        <textarea
                                            className="input"
                                            rows={2}
                                            placeholder="Update your comment (optional)"
                                            value={editComment}
                                            onChange={e => setEditComment(e.target.value)}
                                            style={{ marginBottom: 8, resize: 'vertical' }}
                                        />
                                        {editError && <p style={{ color: 'var(--danger)', fontSize: '0.85rem', margin: '0 0 8px' }}>{editError}</p>}
                                        <div style={{ display: 'flex', gap: 8 }}>
                                            <button className="button" type="submit" disabled={editLoading} style={{ padding: '7px 16px', fontSize: '0.88rem' }}>
                                                {editLoading ? 'Saving…' : 'Save Changes'}
                                            </button>
                                            <button type="button" className="button outline" onClick={cancelEdit} style={{ padding: '7px 14px', fontSize: '0.88rem' }}>
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            );
                        }

                        return (
                            <div key={r._id} className="review-card">
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <div className="review-avatar">{r.userName?.charAt(0).toUpperCase()}</div>
                                        <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{r.userName}</span>
                                        {isOwner && (
                                            <span style={{ background: '#eff6ff', color: 'var(--primary)', fontSize: '0.72rem', fontWeight: 700, padding: '2px 7px', borderRadius: 20 }}>
                                                You
                                            </span>
                                        )}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <span className="muted" style={{ fontSize: '0.8rem' }}>{formatDate(r.createdAt)}</span>
                                        {isOwner && (
                                            <button
                                                className="button outline"
                                                style={{ padding: '3px 10px', fontSize: '0.78rem', borderRadius: 8 }}
                                                onClick={() => startEdit(r)}
                                            >
                                                ✏️ Edit
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <StarPicker value={r.rating} readOnly size={16} />
                                {r.comment && (
                                    <p style={{ margin: '6px 0 0', fontSize: '0.9rem', color: 'var(--text)', lineHeight: 1.5 }}>
                                        "{r.comment}"
                                    </p>
                                )}
                            </div>
                        );
                    })}
                </>
            )}

            {/* Submit form — only show if user hasn't reviewed yet */}
            <div className="review-form-wrap">
                {user ? (
                    myReview ? (
                        <p className="muted" style={{ marginTop: 10, fontSize: '0.88rem' }}>
                            You've already reviewed this. Click <strong>✏️ Edit</strong> on your review above to update it.
                        </p>
                    ) : (
                        <form onSubmit={handleSubmit} style={{ marginTop: 12 }}>
                            <p style={{ fontWeight: 600, marginBottom: 8, fontSize: '0.9rem' }}>Leave a Review</p>
                            <div style={{ marginBottom: 10 }}>
                                <StarPicker value={rating} onChange={setRating} size={28} />
                                {!rating && <span className="muted" style={{ marginLeft: 8, fontSize: '0.85rem' }}>Click to rate</span>}
                            </div>
                            <textarea
                                className="input"
                                rows={2}
                                placeholder="Share your experience (optional)"
                                value={comment}
                                onChange={e => setComment(e.target.value)}
                                style={{ marginBottom: 8, resize: 'vertical' }}
                            />
                            {error && <p style={{ color: 'var(--danger)', fontSize: '0.85rem', margin: '0 0 8px' }}>{error}</p>}
                            {success && <p style={{ color: 'var(--success)', fontSize: '0.85rem', margin: '0 0 8px' }}>{success}</p>}
                            <button className="button" type="submit" disabled={loading} style={{ padding: '8px 18px', fontSize: '0.9rem' }}>
                                {loading ? 'Submitting…' : 'Submit Review'}
                            </button>
                        </form>
                    )
                ) : (
                    <p className="muted" style={{ marginTop: 10, fontSize: '0.88rem' }}>
                        <a href="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Login</a> to leave a review.
                    </p>
                )}
            </div>
        </div>
    );
};

export default ReviewSection;
