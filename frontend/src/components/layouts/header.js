import { useDispatch } from 'react-redux';
import { logOut } from '../../features/authentication/authAction';

export default function Header({ onLogout }) {
  const dispatch = useDispatch();

  const logOutHandle = () => {
    dispatch(logOut());
    window.location.href = '/';
  };

  return (
    <div className="header bg-dark text-light py-2">
      <div className="container d-flex justify-content-between align-items-center">
        <div className="logo-holder logo-5 d-flex align-items-center">
          <p className="m-0 mx-2">-_-</p>
        </div>
        <div className="admin">
          <h2 className="m-0">ADMIN PAGE</h2>
        </div>
        <div>
          <button onClick={logOutHandle} className="btn btn-danger">Log out</button>
        </div>
      </div>
    </div>
  );
}


