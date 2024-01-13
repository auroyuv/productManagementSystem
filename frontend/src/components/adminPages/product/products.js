import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import defaultProductImage from '../../../assets/noImage.png';
import Swal from 'sweetalert2';



export default function Products() {

  const [products, setProducts] = useState([])
  const storedToken = localStorage.getItem('token')

  const deleteVendors = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://localhost:3002/product/deleteProduct/${id}`, {
            headers: {
              Authorization: `Bearer ${storedToken}`
            }
          })
          .then((response) => {
            console.log(response.data);
            Swal.fire({
              title: 'Deleted!',
              text: 'Your file has been deleted.',
              icon: 'success'
            }).then(() => {
              fetchProductList();
            });
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });
  };


  const fetchProductList = () => {
    axios.get('http://localhost:3002/product/getProductList', {
      headers: {
        Authorization: `Bearer ${storedToken}`
      }
    })
      .then((response) => {
        setProducts(response.data)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  useEffect(() => {
    axios.get('http://localhost:3002/product/getProductList', {
      headers: {
        Authorization: `Bearer ${storedToken}`
      }
    })
      .then((response) => {
        setProducts(response.data)
      })
      .catch((error) => {
        console.log(error)
      })
  }, [storedToken])

  return (
    <div className='product_table'>
      <h2>Products </h2>
      <div className='add_button_container'>
        <Link className='add_Product_Button' to='/addProducts'>Add Products</Link>
      </div>
      <table>
        <thead>
          <tr>
            <th>S.No</th>
            <th>Image</th>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Category</th>
            <th>Weight</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={product._id}>
              <td>{index + 1}</td>
              <td>
                <img
                  src={product.image ? `http://localhost:3002/products/${product.image}` : defaultProductImage}
                  onError={(e) => { e.target.src = defaultProductImage }}
                  alt={product.name}
                  style={{ width: '50px', height: '50px' }}
                />
              </td>
              <td>{product.name}</td>
              <td>{product.description}</td>
              <td>{product.price}</td>
              <td>{product.maxQuantity}</td>
              <td>{product.category}</td>
              <td>{product.weight}</td>
              <td>
                <Link to={`/editProduct/${product._id}`} className='productButton edit_Product_Button' >Edit</Link>
                <button onClick={() => deleteVendors(product._id)} className='productButton delete_Product_Button'>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


