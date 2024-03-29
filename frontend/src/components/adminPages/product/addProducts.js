import React, { useRef, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

export default function AddProducts() {
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [priceSymbol, setPriceSymbol] = useState("");
  const [price, setPrice] = useState("");
  const [productQuantity, setProductQuantity] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [weight, setWeight] = useState("");
  const [file, setFile] = useState();
  const [fileName, setFileName] = useState("");
  const storedToken = localStorage.getItem('token')

  const fileInput = useRef();

  const saveFile = () => {
    setFile(fileInput.current.files[0])
    setFileName(fileInput.current.files[0].name)
  }
  const clearFileInput = () => {
    fileInput.current.value = '';
    setFile(null);
    setFileName("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('image', file);
    formData.append('filename', fileName);

    const priceWithSymbol = priceSymbol + price

    let errorMessage = null;

    if (!productName.trim()) {
      errorMessage = 'Product Name is required.';
    } else if (!productCategory) {
      errorMessage = 'Please select a category.';
    } else if (!productDescription.trim()) {
      errorMessage = 'Product Description is required.';
    } else if (!priceSymbol || !price.trim()) {
      errorMessage = 'Price and Symbol are required.';
    } else if (!productQuantity.trim()) {
      errorMessage = 'Product Quantity is required.';
    } else if (!weight.trim()) {
      errorMessage = 'Weight is required.';
    } else if (!file && !fileName) {
      errorMessage = 'Please choose a profile picture.';
    }

    if (errorMessage) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: errorMessage,
      });
      return false;
    }

    axios.post('http://localhost:3002/product/addProduct', {
      productName,
      productDescription,
      priceWithSymbol,
      productQuantity,
      productCategory,
      weight,
    }, {
      headers: {
        Authorization: `Bearer ${storedToken}`
      }
    })
      .then((response) => {
        const id = response.data.productId;

        axios.post(`http://localhost:3002/product/uploadImage/${id}`, formData, {
          headers: {
            Authorization: `Bearer ${storedToken}`
          }
        })
          .then((response) => {
            setFile(null);
            setFileName("");
            clearFileInput();
            Swal.fire({
              icon: "success",
              text: "Product added successfully",
            });
          })
          .catch((error) => {
            console.log(error)
          })
        setProductName("");
        setProductDescription("");
        setPriceSymbol("");
        setPrice("");
        setProductQuantity("");
        setProductCategory("");
        setWeight("");
      })
      .catch((error) => {
        console.log(error)
      })
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="add_container">
          <div className="row-container">
            <div>
              <label htmlFor="productName">Product Name: </label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="productCategory">Product Category: </label>
              <select
                value={productCategory}
                onChange={(e) => setProductCategory(e.target.value)}
              >
                <option value="">Select Category</option>
                <option value="smartphone">Smartphone</option>
                <option value="cloths">Cloths</option>
                <option value="shoes">Shoes</option>
                <option value="electronics">Electronics</option>
                <option value="home-appliances">Home Appliances</option>
                <option value="books">Books</option>
                <option value="toys">Toys</option>
              </select>
            </div>
          </div>
          <label htmlFor="productDescription">Product Description: </label>
          <textarea
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
          ></textarea>

          <div className="row-container">
            <div>
              <label htmlFor="priceSymbol">Price Symbol: </label>
              <select
                value={priceSymbol}
                onChange={(e) => setPriceSymbol(e.target.value)}
              >
                <option value="">Select Price Symbol</option>
                <option value="$">USD</option>
                <option value="€">EUR</option>
                <option value="£">GBP</option>
              </select>
            </div>
            <div>
              <label htmlFor="numericPrice">Price: </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
          </div>
          <div className="row-container">
            <div>
              <label htmlFor="productQuantity">Product Quantity: </label>
              <input
                type="number"
                value={productQuantity}
                onChange={(e) => setProductQuantity(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="weight">Weight in grams: </label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </div>
          </div>
          <div className="file-input-container">
            <input type="file" name="image" className="upload_image" ref={fileInput} onChange={saveFile}></input>
          </div>
          <button type="submit">Add</button>
        </div>
      </form>
    </div>
  );
}
