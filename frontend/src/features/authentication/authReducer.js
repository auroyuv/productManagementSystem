import { createSlice } from '@reduxjs/toolkit';

export const isAuthenticated = () => {
  const storedToken = localStorage.getItem('token');
  return !!storedToken;
}

export const logout = () =>{
  localStorage.removeItem('token')
}

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: isAuthenticated(),
  },
  reducers: {
    authenticate: (state) => {
      state.isAuthenticated = isAuthenticated();
    },
    logOut: (state) => {
      state.isAuthenticated = logout();
    },
  },
});

export const { authenticate } = authSlice.actions;
export default authSlice.reducer;
