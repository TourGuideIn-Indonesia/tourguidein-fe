import React, { useEffect, useState } from "react";
import axiosPrivate from "../api/axiosPrivate";

function Profile() {
  const token = localStorage.getItem("token");
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (!token) return;

    const fetchProfile = async () => {
      try {
        const res = await axiosPrivate.get("/api/get-traveller");
        setProfile(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProfile();
  }, [token]);

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Profile</h1>
          <p className="text-gray-600">
            Your profile information will appear here
          </p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="bg-white p-6 rounded-2xl shadow max-w-lg mx-auto">
        <h1 className="text-2xl font-bold mb-6">My Profile</h1>

        <div className="space-y-4">
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Phone:</strong> {profile.phone_number}</p>
        </div>
      </div>
    </div>
  );
}

export default Profile;
