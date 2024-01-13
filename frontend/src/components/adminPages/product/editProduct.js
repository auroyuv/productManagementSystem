import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams  } from "react-router-dom";
import Swal from "sweetalert2";

export default function EditProduct() {
    const navigate  = useNavigate ();
    const [productName, setProductName] = useState("");
    const [productDescription, setProductDescription] = useState("");
    const [priceSymbol, setPriceSymbol] = useState("");
    const [price, setPrice] = useState("");
    const [productQuantity, setProductQuantity] = useState("");
    const [productCategory, setProductCategory] = useState("");
    const [weight, setWeight] = useState("");
    const storedToken = localStorage.getItem('token')
    const { productId } = useParams();

    const handleSubmit = (e) => {

        e.preventDefault();
        const priceWithSymbol = priceSymbol + price

        axios.put(`http://localhost:3002/product/modifyProduct/${productId}`, {
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
                Swal.fire({
                    icon: "success",
                    text: response.data,
                })
                    .then(() => {
                        // Redirect to the products page immediately after clicking "OK"
                        navigate("/products");
                    });
            })
            .catch((error) => {
                console.log(error)
            })
    };

    useEffect(() => {
        axios.get(`http://localhost:3002/product/getProduct/${productId}`, {
            headers: {
                Authorization: `Bearer ${storedToken}`
            }
        })
            .then((response) => {
                const data = response.data;
                const currencySymbol = data.price.match(/[^\d]/g).join(''); // Extracts non-numeric characters
                const numericPrice = parseFloat(data.price.replace(/[^0-9.]/g, '')); // Extracts numeric characters
                setProductName(data.name);
                setProductDescription(data.description);
                setPriceSymbol(currencySymbol);
                setPrice(numericPrice);
                setProductQuantity(data.maxQuantity);
                setWeight(data.weight);
                setProductCategory(data.category);
            })
            .catch((error) => {
                console.log(error)
            })
    }, [productId, storedToken])

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
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="productCategory">Product Category: </label>
                            <select
                                value={productCategory}
                                onChange={(e) => setProductCategory(e.target.value)}
                                required
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
                        required
                    ></textarea>

                    <div className="row-container">
                        <div>
                            <label htmlFor="priceSymbol">Price Symbol: </label>
                            <select
                                value={priceSymbol}
                                onChange={(e) => setPriceSymbol(e.target.value)}
                                required
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
                                required
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
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="weight">Weight in grams: </label>
                            <input
                                type="number"
                                value={weight}
                                onChange={(e) => setWeight(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <button type="submit">Submit</button>
                </div>
            </form>
        </div>
    );
}
