import React, { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { authenticateUser } from '../../features/authentication/authAction';
import axios from 'axios';
import Swal from 'sweetalert2';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmRegisterPassword, setConfirmRegisterPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [file, setFile] = useState();
  const [fileName, setFileName] = useState("")
  const fileInput = useRef();
  const dispatch = useDispatch();

  const handleAuthorization = () => {
    if (!email || !password) {
      Swal.fire({
        icon: "error",
        text: 'email and password are required',
      });
      return;
    }
    dispatch(authenticateUser(email, password));
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  const saveFile = () => {
    const selectedFile = fileInput.current?.files[0];

    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    } else {
      console.error('No file selected');
    }
  };


  const clearFileInput = () => {
    fileInput.current.value = '';
    setFile(null);
    setFileName("");
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateMobileNo = (mobileNo) => {
    const mobileRegex = /^[0-9]{10}$/;
    return mobileRegex.test(mobileNo);
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{6,}$/;
    return passwordRegex.test(password);
  };


  const registerUser = async () => {
    let errorMessage = null;
    if (!userName) {
      errorMessage = 'Username is required.';
    } else if (!registerEmail || !validateEmail(registerEmail)) {
      errorMessage = 'Invalid email address.';
    } else if (!mobileNo || !validateMobileNo(mobileNo)) {
      errorMessage = 'Invalid mobile number.';
    } else if (!registerPassword || !validatePassword(registerPassword)) {
      errorMessage = 'Password must be at least 6 characters long and contain symbols, uppercase, lowercase, and numbers.';
    } else if (registerPassword !== confirmRegisterPassword) {
      errorMessage = 'Passwords do not match.';
    } else if(!file && !fileName){
      errorMessage = 'Please choose a profile picture';

    }
  
    if (errorMessage) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: errorMessage,
      });
      return;
    }

    const formData = new FormData();
    formData.append('profileImage', file);
    formData.append('profileImageName', fileName);

    try {
      const response = await axios.post('http://localhost:3002/admin/register', {
        userName,
        registerEmail,
        mobileNo,
        registerPassword
      });

      const id = response.data.id;

      await axios.post(`http://localhost:3002/admin/uploadProfileImage/${id}`, formData);

      clearFileInput();
      setUserName("");
      setRegisterEmail("");
      setMobileNo("");
      setRegisterPassword("");
      setConfirmRegisterPassword("");

      Swal.fire({
        icon: "success",
        text: response.data.message,
        footer: 'Now you can Login',
      });
      setIsLogin(!isLogin);
      setEmail(registerEmail);
      setPassword(registerPassword);
    } catch (error) {
      console.error(`Error: ${error}`);
      Swal.fire({
        icon: "error",
        text: "Error registering user.",
      });
    }
  };

  return (
    <div className='login-or-signup'>
      <div className='switch-login-signup'>
        <button type="button" onClick={toggleForm} className="toggle-button">
          Switch to {isLogin ? 'Sign Up' : 'Login'}
        </button>
      </div>
      {isLogin ?
        <div >
          <form className="form-container">
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
            />
            <button
              type="button"
              onClick={handleAuthorization}
              className="login-button"
            >
              Login
            </button>
          </form>
        </div>
        :
        <div>
          <form className="form-container">
            <input
              type="text"
              placeholder="Username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="input-field"
            />
            <input
              type="text"
              placeholder="Email"
              value={registerEmail}
              onChange={(e) => setRegisterEmail(e.target.value)}
              className="input-field"
            />
            <input
              type="number"
              placeholder="MobileNo"
              value={mobileNo}
              onChange={(e) => setMobileNo(e.target.value)}
              className="input-field"
            />
            <input
              type="password"
              placeholder="Password"
              value={registerPassword}
              onChange={(e) => setRegisterPassword(e.target.value)}
              className="input-field"
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmRegisterPassword}
              onChange={(e) => setConfirmRegisterPassword(e.target.value)}
              className="input-field"
            />
            <input
              type='file'
              name='profileImage'
              className='upload-profile'
              ref={fileInput}
              onChange={saveFile}
              required
            />
            <button
              type="button"
              onClick={registerUser}
              className="login-button"
            >
              SignUp
            </button>
          </form>
        </div>
      }

    </div>

  );
};


export default Login;
