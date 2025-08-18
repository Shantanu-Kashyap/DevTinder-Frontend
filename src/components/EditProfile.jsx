import { useState } from "react";
import UserCard from "./UserCard";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import "./Profile.css";

const EditProfile = ({ user }) => {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [photoURL, setPhotoUrl] = useState(user.photoURL);
  const [age, setAge] = useState(user.age || "");
  const [gender, setGender] = useState(user.gender || "");
  const [about, setAbout] = useState(user.about || "");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const [showToast, setShowToast] = useState(false);

  const saveProfile = async () => {
  
    setError("");
    try {
      const res = await axios.patch(
        BASE_URL + "/profile/edit",
        {
          firstName,
          lastName,
          photoURL,
          age,
          gender,
          about,
        },
        { withCredentials: true }
      );
      dispatch(addUser(res?.data?.data));
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    } catch (err) {
      setError(err.response.data);
    }
  };

  return (
    <>
      <div className="profile-container">
        {/* Edit Profile Form */}
        <div className="profile-edit-form">
          <h2 className="form-title">Edit Profile</h2>
          <div className="form-fields-container">
            <label className="form-label">
              <span>First Name:</span>
              <input
                type="text"
                value={firstName}
                className="form-input"
                onChange={(e) => setFirstName(e.target.value)}
              />
            </label>
            <label className="form-label">
              <span>Last Name:</span>
              <input
                type="text"
                value={lastName}
                className="form-input"
                onChange={(e) => setLastName(e.target.value)}
              />
            </label>
            <label className="form-label">
              <span>Photo URL:</span>
              <input
                type="text"
                value={photoURL}
                className="form-input"
                onChange={(e) => setPhotoUrl(e.target.value)}
              />
            </label>
            <label className="form-label">
              <span>Age:</span>
              <input
                type="text"
                value={age}
                className="form-input"
                onChange={(e) => setAge(e.target.value)}
              />
            </label>
            <label className="form-label">
              <span>Gender:</span>
              <select
                className="form-select"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="" disabled>
                  Select Gender
                </option>
                <option value="male">male</option>
                <option value="female">female</option>
                <option value="others">others</option>
              </select>
            </label>
            <label className="form-label">
              <span>About:</span>
              <input
                type="text"
                value={about}
                className="form-input"
                onChange={(e) => setAbout(e.target.value)}
              />
            </label>
          </div>
          {error && <p className="error-message">{error}</p>}
          <div className="form-actions">
            <button className="save-button" onClick={saveProfile}>
              Save Profile
            </button>
          </div>
        </div>

        <div className="profile-preview-card">
            <h3 className="preview-title">Your Public Profile</h3>
            <UserCard
                user={{ firstName, lastName, photoURL, age, gender, about }}
            />
        </div>
      </div>
      {showToast && (
        <div className="toast-message success">
          <span>Profile saved successfully.</span>
        </div>
      )}
    </>
  );
};
export default EditProfile;