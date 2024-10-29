import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Delete() {
    const { id } = useParams();
    const navigate = useNavigate();

    // STATE TO HOLD EXISTING BUG DATA
    const [bug, setBug] = useState(null);
    const [error, setError] = useState('');

    const apiUrl = import.meta.env.VITE_API_HOST;

    // FETCH BUG DATA BY ID
    useEffect(() => {
        async function fetchBugData() {
            const response = await fetch(`${apiUrl}/api/bugs/read/${id}`);
            if (response.ok) {
                const data = await response.json();
                setBug(data);
            } else {
                setError('Failed to load bug data.'); // USE ELSE BLOCK FOR BETTER ERROR HANDLING
            }
        }
        fetchBugData();
    }, [id, apiUrl]);

    // HANDLE CONFIRM DELETE
    const handleDelete = async () => {
        const response = await fetch(`${apiUrl}/api/bugs/delete/${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            navigate('/'); // BACK TO HOMEPAGE AFTER DELETION
        } else {
            setError('Failed to delete bug. Please try again.'); // USE ELSE BLOCK FOR BETTER ERROR HANDLING
        }
    };

    // ADD LOADING STATE CHECK
    if (error) {
        return <p className="text-danger">{error}</p>;
    }

    if (!bug) { // CHECK IF BUG DATA IS LOADING
        return <p>Loading...</p>; // DISPLAY LOADING MESSAGE IF DATA IS NOT YET LOADED
    }

    return (
        <>
            <h1>Delete Bug</h1>
            <p>Are you sure you want to delete this bug?</p>
            <h2>{bug.name}</h2>
            <img src={`${apiUrl}/images/${bug.filename}`} alt={bug.name} className="thumbnail" />
            <div>
                <button onClick={handleDelete} className="btn btn-danger">Delete</button>
                <button onClick={() => navigate('/')} className="btn btn-secondary">Cancel</button>
            </div>
        </>
    );
}
