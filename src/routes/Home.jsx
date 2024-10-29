import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import '/src/index.css';

export default function Home() {
    const [bugs, setBugs] = useState([]);
    const [error, setError] = useState('');
    const apiUrl = import.meta.env.VITE_API_HOST;

    useEffect(() => {
        async function fetchData() {
            const url = `${apiUrl}/api/bugs/all`;
            const response = await fetch(url);
            
            if (response.ok) { 
                const data = await response.json();
                console.log("Fetched data:", data);
                
                setBugs(data);
                setError(''); 
            } else {
                setBugs([]);
                setError('Failed to load bugs. Please try again.');
            } 
        }
        
        let ignore = false;
        fetchData();
        return () => {
            ignore = true;
        }
    }, [apiUrl]);

    return (
        <div className="container">
            <h1 className="my-bugs-title">My Bugs</h1>
            <div className="text-center mb-3">
                <Link to="/create" className="add-bug-button">Add a Bug</Link>
            </div>
            <div className="bug-list">
                {error && <p className="text-danger">{error}</p>}
                {bugs.length > 0 ? bugs.map((bug, index) => (
                    <div key={index} className="card mb-3">
                        <div className="card-body">
                            <div className="d-flex align-items-center position-relative">
                                <img 
                                    src={`${apiUrl}/images/${bug.image}`} 
                                    className="thumbnail" 
                                    alt={bug.name} 
                                />
                                <div className="bug-info">
                                    <h5 className="card-title">{bug.name}</h5>
                                    <p className="card-text">
                                        <span className="italic">{bug.species}</span><br />
                                        Date found: {bug.dateFound}<br /> 
                                        {bug.description}
                                    </p>
                                </div>
                                <div className="position-absolute top-0 end-0">
                                    <Link to={`/update/${bug.id}`} className="btn btn-light btn-sm">
                                        <i className="bi bi-pencil-square"></i>
                                    </Link>&nbsp;              
                                    <Link to={`/delete/${bug.id}`} className="btn btn-light btn-sm">
                                        <i className="bi bi-trash"></i>
                                    </Link>
                                </div>
                            </div>
                        </div>            
                    </div>
                )) : <p>No bugs.</p>}
            </div>
        </div>
    );
}
