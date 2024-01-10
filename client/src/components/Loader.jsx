import Spinner from 'react-bootstrap/Spinner';

const Loader = (props) => {
    return (
        props.show && <div style={{"zIndex": 99999}} className="position-fixed d-flex justify-content-center align-items-center w-100 h-100 top-0 bg-dark opacity-75">
        <Spinner animation="border" role="status" variant='danger'>
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
}

export default Loader;