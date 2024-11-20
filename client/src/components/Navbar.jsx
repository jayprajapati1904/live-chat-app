import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Drawer, message } from "antd";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [username, setUsername] = useState(""); // State to store the username
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const { isAuthenticated, logout } = useAuth();
  const [isUploading, setIsUploading] = useState(false); // For loading state

  // Fetch the user's profile photo after login
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (isAuthenticated) {
        const response = await fetch("/api/user/getuser", {});
        const data = await response.json();
        if (data.user) {
          setProfilePhoto(data.user.profile_photo);
          setUsername(data.user.username); // Assuming the response contains a `username` field
        }
      }
    };

    fetchUserProfile();
  }, [isAuthenticated]);

  const toggleDrawer = () => {
    setDrawerOpen(!isDrawerOpen);
  };

  const handleSignOut = async () => {
    const response = await fetch("/api/user/signout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    if (response.ok) {
      localStorage.removeItem("token");
      window.location.href = "/";
    } else {
      console.error(data.error);
    }
    logout();
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profilePhoto", file);

    setIsUploading(true);

    try {
      const response = await fetch("/api/user/upload-profile-photo", {
        method: "POST",

        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setProfilePhoto(data.profilePhotoUrl); // Update profile photo in the state
        message.success("Profile photo updated successfully!");
        // Show success notification
      } else {
        console.error("Error updating profile photo:", data.error);
        message.error("Error updating profile photo. Please try again.");
      }
    } catch (error) {
      console.error("Error uploading profile photo:", error);
      message.error("Error uploading profile photo.");
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => {
    document.getElementById("fileInput").click();
  };

  return (
    <nav className="bg-gray-700 text-white py-3 md:py-4 fixed top-0 left-0 w-full z-50 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="ml-2 text-2xl sm:text-xl md:text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
          <Link to="/">
            Live Chat <span className="text-yellow-400">App</span>
          </Link>
        </h1>

        <div className="hidden md:flex  space-x-4">
          {!isAuthenticated ? (
            <>
              <Link
                to="/signup"
                className="cursor-pointer hover:text-purple-400 transition duration-300"
              >
                Signup
              </Link>
              <Link
                to="/signin"
                className="cursor-pointer hover:text-blue-400 transition duration-300"
              >
                Signin
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/users"
                className="cursor-pointer hover:text-green-400 transition duration-300"
              >
                Message
              </Link>
              <Link
                to="/chat"
                className="cursor-pointer hover:text-orange-400 transition duration-300"
              >
                Chat
              </Link>
              <Link
                onClick={handleSignOut}
                className="cursor-pointer hover:text-red-400 transition duration-300"
              >
                Signout
              </Link>
              <div className="relative">
                <img
                  src={
                    profilePhoto ||
                    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                  }
                  alt="Profile"
                  className="w-10 h-10 rounded-full cursor-pointer"
                  onClick={toggleDrawer}
                />
              </div>
            </>
          )}
        </div>

        <button
          className="mr-2 md:hidden flex items-center justify-center w-8 h-8 bg-yellow-400 hover:bg-yellow-500 text-gray-800 rounded-full shadow-md transition duration-300 ease-in-out"
          onClick={toggleDrawer}
          aria-label="Toggle Navigation"
        >
          <span className="text-xl">&#9776;</span>
        </button>
      </div>

      <Drawer
        title={
          <span className="text-white text-lg md:text-xl font-bold">
            Live Chat App
          </span>
        }
        placement="left"
        width="75%"
        onClose={toggleDrawer}
        open={isDrawerOpen}
        bodyStyle={{
          padding: 0,
          background: "linear-gradient(to right, #7e5bef, #46a8f9)",
        }}
        headerStyle={{
          background: "linear-gradient(to right, #7e5bef, #46a8f9)",
        }}
        className="custom-drawer"
      >
        <div className="p-3">
          {!isAuthenticated ? (
            <>
              <Link
                to="/signup"
                className="block py-2 px-3 text-base md:text-lg text-white hover:bg-blue-600 hover:shadow-lg rounded-md transition duration-200 ease-in-out"
                onClick={toggleDrawer}
              >
                Signup
              </Link>
              <Link
                to="/signin"
                className="block py-2 px-3 text-base md:text-lg text-white hover:bg-blue-600 hover:shadow-lg rounded-md transition duration-200 ease-in-out"
                onClick={toggleDrawer}
              >
                Signin
              </Link>
            </>
          ) : (
            <>
              <div className="flex flex-col items-center">
                {/* Profile Image */}
                <img
                  src={
                    profilePhoto ||
                    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                  }
                  alt="Profile"
                  className="w-32 h-32 rounded-full mx-auto mb-4 cursor-pointer border-2 border-gray-300"
                  onClick={triggerFileInput}
                />

                {/* Username Text */}
                <p className="text-xl font-semibold text-gray-700">
                  {username || "Loading..."}
                </p>

                {/* Hidden File Input */}
                <input
                  id="fileInput"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                />

                {/* Upload Button */}
                <button
                  type="button"
                  className={`my-4 px-4 py-2 rounded ${
                    isUploading
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                  onClick={triggerFileInput}
                  disabled={isUploading}
                >
                  {isUploading ? "Uploading..." : "Change Profile Photo"}
                </button>
              </div>
              <Link
                to="/users"
                className="block py-2 px-3 text-base md:text-lg text-white hover:bg-blue-600 hover:shadow-lg rounded-md transition duration-200 ease-in-out"
              >
                Message
              </Link>
              <Link
                to="/chat"
                className="block py-2 px-3 text-base md:text-lg text-white hover:bg-blue-600 hover:shadow-lg rounded-md transition duration-200 ease-in-out"
              >
                Chat
              </Link>
              <Link
                onClick={() => {
                  handleSignOut();
                }}
                className="block w-full text-left py-2 px-3 text-base md:text-lg text-white hover:bg-red-600 hover:shadow-lg rounded-md transition duration-200 ease-in-out"
              >
                Signout
              </Link>
            </>
          )}
        </div>
      </Drawer>
    </nav>
  );
};

export default Navbar;
