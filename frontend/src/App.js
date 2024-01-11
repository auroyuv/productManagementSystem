import React, { useEffect } from 'react';
import Login from './components/pages/login'
import Sidebar from './components/layouts/sidebar';
import Header from './components/layouts/header';
import Dashboard from './components/adminPages/dashboard/dashboard';
import Products from './components/adminPages/product/products';
import AddProduct from './components/adminPages/product/addProducts';
import EditProduct from './components/adminPages/product/editProduct';
import './styles/index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { authentication } from './features/authentication/authAction';

function App() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    dispatch(authentication());
  }, [dispatch]);

  return (
    <BrowserRouter>
      {!isAuthenticated ? (
        <div className="app-container">
          <Routes>
            <Route path="/" element={<Login />} />
          </Routes>
        </div>
      ) : (
        <div className="app-container">
          <Header />
          <div className="container-fluid">
            <div className="row">
              <Sidebar />
              <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/addProducts" element={<AddProduct />} />
                  <Route path="/editProduct/:productId" element={<EditProduct />} />
                </Routes>
              </main>
            </div>
          </div>
        </div>
      )}
    </BrowserRouter>
  );
}

export default App;




