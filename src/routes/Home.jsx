import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Home() {
    // store result from api
    const [bugs, setBugs] = useState([]);
    const [error, setError] = useState('');

    const apiUrl = import.meta.env.VITE_API_HOST;

    useEffect(() => {
        // fetch data from api
        async function fetchData() {
            const url = `${apiUrl}/api/bugs/all`;
            const response = await fetch(url);
            if(response.ok){ 
              const data = await response.json();
              if (!ignore) {
                setBugs(data);
                setError(''); 
              }
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
    }, []);

    return (
        <>
          <h1>My Bugs</h1>
          <p>
            <Link to="/create" className="btn btn-outline-secondary">Add a Bug</Link>
          </p>
          {error && <p className="text-danger">{error}</p>} {/* Display error message */}
          {
            bugs.length > 0 ?         
            bugs.map((bug, index) => (
              <div key={index} className="card mb-3">
                <div className="card-body">
                  <div className="d-flex align-items-center position-relative">
<img src={`${apiUrl}/images/${bug.filename}`} className="thumbnail" alt={bug.name} />
    
                    <div className="bug-info">
                      <h5 className="card-title">{ bug.name }</h5>
                      <p className="card-text">{ bug.description }<br />{ bug.dateFound }</p>
                    </div>
    
                    <div className="position-absolute top-0 end-0">
                      <Link to={`/update/${bug.id}`} className="btn btn-light btn-sm"><i className="bi bi-pencil-square"></i></Link>&nbsp;              
                      <Link to={`/delete/${bug.id}`} className="btn btn-light btn-sm"><i className="bi bi-trash"></i></Link>
                    </div>
                  </div>
                </div>            
              </div>
            )) :
            <p>No bugs.</p>
          }
        </>
      )
}