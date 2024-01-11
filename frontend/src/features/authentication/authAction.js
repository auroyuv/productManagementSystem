import { createAction } from '@reduxjs/toolkit';
import axios from 'axios';
import Swal from 'sweetalert2';

export const authentication = createAction('auth/authenticate');

export const logOut = createAction('auth/logOut');

export const authenticateUser = (email, password) => async (dispatch) => {

    axios.post('http://localhost:3002/admin/login', {
        email,
        password,
    })
        .then((response) => {
            if(response.data.message === "Logged in successfully"){
                localStorage.setItem('token', response.data.token)
                localStorage.setItem('emailId', response.data.emailId)
                Swal.fire({
                    icon: "success",
                    text: response.data.message,
                  });
            dispatch(authentication())
            }else{
                Swal.fire({
                    icon: "error",
                    text: response.data,
                  });
            }
        })
        .catch((error) => {
            console.log("error fetching data", error)
        })
}