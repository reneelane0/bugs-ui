import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Read() {
    const { id } = useParams();
    // STORE RESULT FROM API
    const [bug, setBug] = useState(null);
    const [error, setError] = useState(''); // added error state to handle fetch errors
    const apiUrl = import.meta.env.VITE_API_HOST; 

    useEffect(() => {
        // FETCH DATA FROM API
        async function fetchData() {
            const url = `${apiUrl}/api/bugs/get/${id}`; 
            const response = await fetch(url);

            if (response.ok) {
                const data = await response.json();
                setBug(data);
            } else {
                setError('Failed to load bug data.'); 
                setBug(null); // bug set to null on error
            }
        }

    }, [id, apiUrl]); // added apiUrl to dependency array

    return (
        <>
            <h1>Read Page for {id}</h1>
            {error && <p className="text-danger">{error}</p>} 
            {bug ? (
                <div>
                    <h2>{bug.name}</h2>
                    <img src={`${apiUrl}/images/${bug.filename}`} alt={bug.name} className="thumbnail" /> 
                    <p>{bug.description}</p> 
                    <p>Date Found: {bug.dateFound}</p> 
                    <p>Species: {bug.species}</p> 
                </div>
            ) : (
                <div>Bug not found.</div>
            )}
        </>
    );
}
