import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Update() {
    const { id } = useParams();
    const navigate = useNavigate();

    // STATE TO HOLD EXISTING BUG AND FORM DATA
    const [bug, setBug] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        dateFound: '',
        species: '',
        file: null 
    });
    const [error, setError] = useState('');

    const apiUrl = import.meta.env.VITE_API_HOST;

    // FETCH BUG DATA BY ID
    useEffect(() => {
        async function fetchBugData() {
            const response = await fetch(`${apiUrl}/api/bugs/${id}`);
            if (response.ok) {
                const data = await response.json();
                setBug(data);
                // PREPOPULATE FORM FIELDS WITH EXISTING DATA
                setFormData({
                    name: data.name,
                    description: data.description,
                    dateFound: data.dateFound,
                    species: data.species,
                    file: null
                });
            } else {
                setError('Failed to load bug data.');
            }
        }
        fetchBugData();
    }, [id, apiUrl]);

    // HANDLE FORM INPUT CHANGES
    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData(prev => ({ // FIXED TYPO: SETFORMDATE TO SETFORMDATA
            ...prev,
            [name]: files ? files[0] : value // HANDLE FILE INPUT SEPARATELY
        }));
    };

    // HANDLE FORM SUBMISSION
    const handleSubmit = async (e) => {
        e.preventDefault();
        // VALIDATE REQUIRED FIELDS
        if (!formData.name || !formData.description || !formData.dateFound || !formData.species) {
            setError('Please fill in all required fields.');
            return;
        }

        // PREPARE THE FORM DATA FOR SUBMISSION
        const updateBug = new FormData(); // FIXED TYPO: UPDATEDBUG TO UPDATEBUG
        updateBug.append('name', formData.name);
        updateBug.append('description', formData.description);
        updateBug.append('dateFound', formData.dateFound);
        updateBug.append('species', formData.species);
        if (formData.file) {
            updateBug.append('file', formData.file);
        }

        // SUBMIT UPDATED DATA
        const response = await fetch(`${apiUrl}/api/bugs/update/${id}`, {
            method: 'PUT',
            body: updateBug,
        });

        if (response.ok) {
            navigate('/'); // BACK TO HOMEPAGE
        } else {
            setError('Failed to update bug. Please try again.');
        }
    };

    if (!bug) {
        return <p>Loading...</p>; // SHOW LOADING STATE WHILE FETCHING DATA
    }

    return (
        <>
            <h1>Update Bug</h1>
            {error && <p className="text-danger">{error}</p>} {/* DISPLAY ERROR MESSAGE */}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name" // ENSURE NAME ATTRIBUTE IS SET
                        value={formData.name}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="form-control"
                        required
                    ></textarea>
                </div>
                <div className="mb-3">
                    <label htmlFor="dateFound" className="form-label">Date Found</label>
                    <input
                        type="date"
                        id="dateFound"
                        name="dateFound" // ENSURE NAME ATTRIBUTE IS SET
                        value={formData.dateFound}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="species" className="form-label">Species</label>
                    <input
                        type="text"
                        id="species"
                        name="species" // ENSURE NAME ATTRIBUTE IS SET
                        value={formData.species}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="file" className="form-label">Image (optional)</label>
                    <input
                        type="file"
                        id="file"
                        name="file"
                        onChange={handleChange}
                        className="form-control"
                    />
                    {bug.filename && (
                        <img src={`${apiUrl}/images/${bug.filename}`} alt={bug.name} className="thumbnail" />
                    )}
                </div>
                <button type="submit" className="btn btn-primary">Update Bug</button>
            </form>
        </>
    );
}
