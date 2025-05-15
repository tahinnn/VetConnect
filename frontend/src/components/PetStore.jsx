import React from "react";
import "./PetStore.css";

const products = [
  {
    id: 1,
    name: "Bonnie Adult Cat Food Chicken 1.5kg",
    oldPrice: 1020,
    price: 800,
    image: "/assets/bonnie1.png"
  },
  {
    id: 2,
    name: "Bonnie Adult Cat Food Chicken 10kg",
    oldPrice: 4800,
    price: 4600,
    image: "/assets/bonnie2.png"
  },
  {
    id: 3,
    name: "Bonnie Kitten Cat Food Chicken 1.5kg",
    oldPrice: 1020,
    price: 800,
    image: "/assets/bonnie3.png"
  },
  {
    id: 4,
    name: "Enjoy Premium Adult Dog Food Chicken 10kg",
    oldPrice: 4200,
    price: 4000,
    image: "/assets/enjoy.png"
  },
  {
    id: 5,
    name: "Kitty Katto Adult Cat Food Chicken & Tuna 15kg",
    oldPrice: 5500,
    price: 4650,
    image: "/assets/katto.png"
  }
];

const PetStore = () => {
  return (
    <div className="store-section-wrapper">
      <div className="store-container">
        <h2 className="store-title">🛍️ VetConnect Pet Store</h2>
        <div className="product-grid">
          {products.map(product => (
            <div className="product-card" key={product.id}>
              <div className="product-img-container">
                <img src={product.image} alt={product.name} className="product-img" />
              </div>
              <div className="product-info">
                <h4 className="product-name">{product.name}</h4>
                <p className="product-prices">
                  <span className="old-price">৳ {product.oldPrice}</span>
                  <span className="new-price">৳ {product.price}</span>
                </p>
                <div className="product-actions">
                  <button className="add-cart">🛒 Add to cart</button>
                  <button className="details-btn">📄 Details</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PetStore;
