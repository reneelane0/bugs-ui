import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import '/src/index.css'; 

export default function Delete() {
    const { id } = useParams();
    const navigate = useNavigate();

    // STATE TO HOLD EXISTING BUG DATA
    const [bug, setBug] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(false); // state to track delete confirmation
    const apiUrl = import.meta.env.VITE_API_HOST;

    // FETCH BUG DATA BY ID
    useEffect(() => {
        async function fetchBugData() {
            const response = await fetch(`${apiUrl}/api/bugs/${id}`);
            if (response.ok) {
                const bugData = await response.json();
                setBug(bugData); // set the bug data
            } else {
                setError('Failed to load bug data.'); // loading error
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
            navigate('/'); // back to homepage after deletion
        } else {
            setError('Failed to delete bug. Please try again.'); // deletion error
        }
    };

    return (
        <div className="delete-container">  
            <h1>Delete Bug</h1>

            <div className="d-flex align-items-center position-relative bug-info">
                <img 
                    src={`${apiUrl}/images/${bug?.image}`} 
                    alt={bug?.name} 
                    className="thumbnail" 
                />
                <div className="bug-details ms-3"> 
                    <h2>{bug?.name}</h2>
                    <p>
                        <span className="italic">{bug?.species}</span><br />
                        Date found: {bug?.dateFound}<br />
                        {bug?.description}
                    </p>
                </div>
            </div>

            <div className="mt-4"> 
                {!confirmDelete ? (
                    <>
                        <button onClick={() => setConfirmDelete(true)} className="btn btn-danger">Delete</button>
                        <button onClick={() => navigate('/')} className="btn btn-secondary">Cancel</button>
                    </>
                ) : (
                    <>
                        <p>Are you sure you want to delete this bug?</p>
                        <button onClick={handleDelete} className="btn btn-danger">Yes</button>
                        <button onClick={() => navigate('/')} className="btn btn-secondary">Cancel</button> 
                    </>
                )}
            </div>
        </div>
    );
}
