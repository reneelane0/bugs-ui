import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Read() {
    const { id } = useParams();
    // STORE RESULT FROM API
    const [bug, setBug] = useState(null);
    const [error, setError] = useState(''); // ADD ERROR STATE TO HANDLE FETCH ERRORS
    const apiUrl = import.meta.env.VITE_API_HOST; // USE ENV VARIABLE FOR API URL

    useEffect(() => {
        // FETCH DATA FROM API
        async function fetchData() {
            const url = `${apiUrl}/api/bugs/get/${id}`; // USE TEMPLATE LITERAL FOR URL
            const response = await fetch(url);

            if (response.ok) {
                const data = await response.json();
                setBug(data);
            } else {
                setError('Failed to load bug data.'); // SET ERROR MESSAGE ON FAILURE
                setBug(null); // ENSURE bug IS SET TO null ON ERROR
            }
        }

        fetchData().catch(err => {
            setError('Error fetching data: ' + err.message); // CATCH ANY FETCH ERRORS
        });
    }, [id, apiUrl]); // ADD apiUrl TO DEPENDENCY ARRAY

    // DISPLAY LOADING STATE
    if (!bug && !error) {
        return <p>Loading...</p>; // SHOW LOADING MESSAGE UNTIL DATA IS FETCHED
    }

    return (
        <>
            <h1>Read Page for {id}</h1>
            {error && <p className="text-danger">{error}</p>} {/* DISPLAY ERROR MESSAGE */}
            {bug ? (
                <div>
                    <h2>{bug.name}</h2>
                    <img src={`${apiUrl}/images/${bug.filename}`} alt={bug.name} className="thumbnail" /> {/* SHOW IMAGE */}
                    <p>{bug.description}</p> {/* OPTIONAL: DISPLAY DESCRIPTION */}
                    <p>Date Found: {bug.dateFound}</p> {/* OPTIONAL: DISPLAY DATE FOUND */}
                    <p>Species: {bug.species}</p> {/* OPTIONAL: DISPLAY SPECIES */}
                </div>
            ) : (
                <div>Bug not found.</div>
            )}
        </>
    );
}
