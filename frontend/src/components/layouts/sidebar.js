import React, { useEffect, useState } from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import defaultProfileImage from '../../assets/profile.jpg';
import axios from 'axios';

const Sidebar = () => {
  const [adminDetails, setAdminDetails] = useState([])

  const user = { role: 'Admin', };

  const storedToken = localStorage.getItem('token')
  const emailId = localStorage.getItem('emailId')

  useEffect(() => {
    axios.get(`http://localhost:3002/authadmin/getAdminUser/${emailId}`, {
      headers: {
        Authorization: `Bearer ${storedToken}`
      }
    })
      .then((response) => {
        setAdminDetails(response.data)
      })
      .catch((error) => {
        console.log(error)
      })
  }, [storedToken, emailId])

  return (
    <Nav className="col-md-2 d-md-block bg-dark sidebar">
      <div className="sidebar-sticky">
        <div className="user-profile d-flex align-items-center justify-content-center">
          <img
            src={adminDetails.image ? `http://localhost:3002/profile/${adminDetails.image}` : defaultProfileImage}
            onError={(e) => { e.target.src = defaultProfileImage }}
            alt={adminDetails.username}
            className="rounded-circle"
            width="50"
            height="50"
          />
          <div className="ml-2">
            <h6 className="text-light">{user.role}</h6>
            <p className="text-light">{adminDetails.username }</p>
          </div>
        </div>
        <Nav.Item>
          <Link to="/" className="nav-link text-light">
            Dashboard
          </Link>
        </Nav.Item>
        <Nav.Item>
          <Link to="/products" className="nav-link text-light">
            Products
          </Link>
        </Nav.Item>
      </div>
    </Nav>
  );
};

export default Sidebar;

