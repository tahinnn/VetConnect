import React from "react";
import { useNavigate } from "react-router-dom";
import UserProfilePage from "./UserProfilePage";
import ShelterProfilePage from "./ShelterProfilePage";
import AdminProfilePage from "./AdminProfilePage";

const ProfileRouter = () => {
  const navigate = useNavigate();
  const userType = localStorage.getItem("userType");

  if (!userType) {
    alert("Please log in first.");
    navigate("/login");
    return null;
  }

  if (userType === "User") return <UserProfilePage />;
  if (userType === "Shelter") return <ShelterProfilePage />;
  if (userType === "Admin") return <AdminProfilePage />;

  return <p>Invalid user type.</p>;
};

export default ProfileRouter;
