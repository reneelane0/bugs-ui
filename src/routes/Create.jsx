import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Create() {
    // api url
    const apiUrl = import.meta.env.VITE_API_HOST + '/api/bugs/create'
    const navigate = useNavigate(); // navigate different views on one page

    // form state variables
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [dateFound, setDateFound] = useState('');
    const [species, setSpecies] = useState('');
    const [image, setImage] = useState(null);
    
    const [loading, setLoading] = useState(false); 
    const [error, setError] = useState('');

    function addBug(event) {
        event.preventDefault();

        // create a FormData
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('dateFound', dateFound);
        formData.append('species', species);
        formData.append('image', image);

        // use fetch to post form to api
        async function postData() {
            setLoading(true);
            setError(''); // reset error message
            const response = await fetch(apiUrl, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                navigate('/');
            }
            else {
                // error message
                setError('Failed to add bug. Please try again.'); 
            }
        }
        postData();
    }
    return (
        <>
            <h1>Add new bug</h1>
            <form onSubmit={addBug} method="post" encType="multipart/form-data">
                <div className="mb-3">
                    <label className="form-label">Bug Name</label>
                    <input required type="text" name="name" className="form-control bg-light" value={name} onChange={e => setName(e.target.value)}  />"
                </div>
                <div className="mb-3">
                    <label className="form-label">Description</label>
                    <input required type="text" name="description" className="form-control bg-light" value={description} onChange={e => setDescription(e.target.value)}  />
                </div>
                <div className="mb-3">
                    <label className="form-label">Date Found</label>
                    <input type="text" name="dateFound" className="form-control bg-light" value={dateFound} onChange={e => setDateFound(e.target.value)}  />
                </div>
                <div className="mb-3">
                    <label className="form-label">Species</label>
                    <input required type="text" name="species" className="form-control bg-light" value={species} onChange={e => setSpecies(e.target.value)}  />
                </div>
                <div className="mb-3">
                    <label className="form-label">Image</label>
                    <input type="file" name="image" className="form-control bg-light" onChange={e => setImage(e.target.files[0])} />
                </div>

                <button type="submit" className="btn btn-primary">Add</button>
                <Link to="/" className="btn btn-outline-secondary ms-3">Cancel</Link>
            </form>
        </>
    )
    
}