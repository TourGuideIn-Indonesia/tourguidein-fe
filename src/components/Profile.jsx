import React, { useEffect, useState } from "react";
import axiosPrivate from "../api/axiosPrivate";

function Profile() {
  const token = localStorage.getItem("token");
  const [profile, setProfile] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);

  const [form, setForm] = useState({
    name: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    current_password: "",
    password: "",
    password_confirmation: "",
  });

  const [avatarFile, setAvatarFile] = useState(null);
  useEffect(() => {
    if (!token) return;

    const fetchProfile = async () => {
      try {
        const res = await axiosPrivate.get("/api/get-traveller");
        console.log(res.data);
        setProfile(res.data.user);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProfile();
  }, [token]);

  const getInitials = (name) => {
    if (!name) return "";
    return name
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase();
  };

  const Avatar = ({ name, imageUrl }) => {
    if (imageUrl) {
      return (
        <img
          src={imageUrl}
          alt={name}
          className="w-24 h-24 rounded-full object-cover border"
        />
      );
    }

    return (
      <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-white text-3xl font-bold">
        {getInitials(name)}
      </div>
    );
  };

  const handleUpdateProfile = async () => {
    try {
      const res = await axiosPrivate.post("/api/update-traveller", form);
      setProfile(res.data.user);
      setIsEditOpen(false);
      alert("Profil berhasil diperbarui");
    } catch (err) {
      console.error(err);
      alert("Gagal update profile");
    }
  };

  const handleUploadAvatar = async () => {
    if (!avatarFile) return;

    const formData = new FormData();
    formData.append("avatar", avatarFile);

    try {
      const res = await axiosPrivate.post(
        "/api/traveller/avatar",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setProfile(prev => ({
        ...prev,
        avatar_image_url: res.data.avatar_image_url,
      }));

      alert("Avatar berhasil diupload");
    } catch (err) {
      console.error(err);
      alert("Gagal upload avatar");
    }
  };

  const handleChangePassword = async () => {
    try {
      await axiosPrivate.post("/api/changge-password", passwordForm);
      setIsPasswordOpen(false);
      alert("Password berhasil diubah");
    } catch (err) {
      console.error(err);
      alert("Password lama salah");
    }
  };

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
        <div className="flex items-center gap-6 mb-6">
          <Avatar
            name={profile.name}
            imageUrl={profile.avatar_image_url}
          />

          <div>
            <h1 className="text-2xl font-bold">{profile.name}</h1>
            <p className="text-gray-500">{profile.email}</p>
          </div>
        </div>

        <div className="space-y-4">
          <p><strong>Phone:</strong> {profile.phone_number}</p>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={() => {
              setForm({ name: profile.name });
              setIsEditOpen(true);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Edit Profile
          </button>

          <button
            onClick={() => setIsPasswordOpen(true)}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg"
          >
            Change Password
          </button>
        </div>
      </div>
      {isEditOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md space-y-4">
            <h2 className="text-xl font-bold">Edit Profile</h2>

            {/* Name */}
            <input
              type="text"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder="Name"
              className="w-full border rounded p-2"
            />

            {/* Email (disabled) */}
            <input
              type="email"
              value={profile.email}
              disabled
              className="w-full border rounded p-2 bg-gray-100 text-gray-500 cursor-not-allowed"
            />

            {/* Phone (disabled) */}
            <input
              type="text"
              value={profile.phone_number}
              disabled
              className="w-full border rounded p-2 bg-gray-100 text-gray-500 cursor-not-allowed"
            />

            {/* Upload Avatar */}
            <input
              type="file"
              onChange={e => setAvatarFile(e.target.files[0])}
              className="w-full"
            />

            <div className="flex justify-end gap-2 mt-2">
              <button
                onClick={() => setIsEditOpen(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleUpdateProfile();
                  handleUploadAvatar();
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {isPasswordOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-full max-w-md space-y-4">
            <h2 className="text-xl font-bold">Change Password</h2>

            <input
              type="password"
              placeholder="Current Password"
              className="w-full border p-2 rounded"
              onChange={e =>
                setPasswordForm({ ...passwordForm, current_password: e.target.value })
              }
            />

            <input
              type="password"
              placeholder="New Password"
              className="w-full border p-2 rounded"
              onChange={e =>
                setPasswordForm({ ...passwordForm, password: e.target.value })
              }
            />

            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full border p-2 rounded"
              onChange={e =>
                setPasswordForm({
                  ...passwordForm,
                  password_confirmation: e.target.value,
                })
              }
            />

            <div className="flex justify-end gap-2">
              <button onClick={() => setIsPasswordOpen(false)}>Cancel</button>
              <button
                onClick={handleChangePassword}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
