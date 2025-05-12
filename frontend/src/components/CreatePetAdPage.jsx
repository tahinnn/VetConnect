import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./CreatePetAdPage.css"; // Reuse the custom CSS file




const CreatePetAdPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    breed: "",
    age: "",
    gender: "",
    location: "",
    amount: "",
    phone: "",
    description: "",
  });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const userId = localStorage.getItem("userId");
      const userType = localStorage.getItem("userType");

      if (userType === "Shelter") {
        try {
          const res = await axios.get(`http://localhost:5000/api/auth/profile/${userId}`);
          const { shelterName, shelterLocation, petTypes } = res.data;

          const isIncomplete =
            !shelterName?.trim() || !shelterLocation?.trim() || !petTypes?.trim();

          if (isIncomplete) {
            alert("Please complete your profile before creating an ad.");
            navigate("/profile");
          }
        } catch (err) {
          console.error("Shelter profile fetch error:", err);
          alert("Error verifying shelter profile.");
        }
      }
    };

    fetchProfile();
  }, []);



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("User ID not found. Please log in again.");
      return;
    }

    try {
      const form = new FormData();
      form.append("name", formData.name);
      form.append("type", formData.type);
      form.append("breed", formData.breed);
      form.append("age", formData.age);
      form.append("gender", formData.gender);
      form.append("location", formData.location);
      form.append("amount", formData.amount);
      form.append("phone", formData.phone);
      form.append("owner", userId);
      if (imageFile) {
        form.append("image", imageFile);
      }

      await axios.post("http://localhost:5000/api/pets", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Pet Ad created successfully!");
      navigate("/pets"); // ✅ Redirect back to listing
    } catch (err) {
      console.error("Create Pet Ad error:", err);
      alert("Something went wrong while submitting the form.");
    }
  };

  return (
    <div className="pet-ad-container">
      <div className="form-wrapper">
        <h2 className="form-title">Create Pet Ad</h2>
  
        <form onSubmit={handleSubmit} className="pet-ad-form">
          <div className="form-group">
            <label>Pet Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </div>
  
          <div className="form-group">
            <label>Pet Type</label>
            <select name="type" value={formData.type} onChange={handleChange} required>
              <option value="">Select Pet Type</option>
              <option value="Dog">Dog</option>
              <option value="Cat">Cat</option>
            </select>
          </div>
  
          <div className="form-group">
            <label>Breed</label>
            <select name="breed" value={formData.breed} onChange={handleChange} required>
              <option value="">Select Breed</option>
              <option value="Labrador">Labrador</option>
              <option value="Poodle">Poodle</option>
              <option value="Persian">Persian</option>
            </select>
          </div>
  
          <div className="form-group">
            <label>Age (Years)</label>
            <input type="number" name="age" value={formData.age} onChange={handleChange} required />
          </div>
  
          <div className="form-group">
            <label>Gender</label>
            <select name="gender" value={formData.gender} onChange={handleChange} required>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
  
          <div className="form-group">
            <label>Location</label>
            <select name="location" value={formData.location} onChange={handleChange} required>
              <option value="">Select Location</option>
              <option value="Dhanmondi">Dhanmondi</option>
              <option value="Gulshan">Gulshan</option>
              <option value="Banani">Banani</option>
            </select>
          </div>
  
          <div className="form-group">
            <label>Amount (Tk)</label>
            <input type="number" name="amount" value={formData.amount} onChange={handleChange} required />
          </div>
  
          <div className="form-group">
            <label>Phone Number</label>
            <input type="number" name="phone" value={formData.phone} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              maxLength={5000}
              rows={4}
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>
  
          <div className="form-group">
            <label>Pet Image</label>
            <input type="file" accept="image/*" onChange={handleImageChange} required />
          </div>
  
          <div className="form-group">
            <button type="submit" className="submit-btn">Submit Ad</button>
          </div>
        </form>
      </div>
    </div>
  );
  
};

export default CreatePetAdPage;
