import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";
import "./UserCard.css";

const UserCard = ({ user }) => {
  const { _id, firstName, lastName, photoURL, age, gender, about } = user;
  const dispatch = useDispatch();

  const handleSendRequest = async (status, userId) => {
    try {
      const res = await axios.post(
        BASE_URL + "/request/send/" + status + "/" + userId,
        {},
        { withCredentials: true }
      );
      dispatch(removeUserFromFeed(userId));
    } catch (err) {}
  };

  return (
    <div className="user-card-container">
      {/* User Photo & Info */}
      <div className="user-card-profile">
        <div className="profile-photo">
          <img
            src={photoURL}
            alt={`${firstName} ${lastName}`}
            className="photo-img"
          />
        </div>
        <div className="profile-details">
          <h2 className="user-name">{firstName} {lastName}</h2>
          {age && gender && (
            <p className="user-meta">
              {age}, {gender}
            </p>
          )}
          <p className="user-bio">
            {about || "No bio provided."}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="user-card-actions">
        <button
          className="action-btn ignore-btn"
          onClick={() => handleSendRequest("ignored", _id)}
        >
        <span className="btn-icon"></span> Ignore
        </button>
        <button
          className="action-btn interested-btn"
          onClick={() => handleSendRequest("interested", _id)}
        >
          <span className="btn-icon"></span> Interested
        </button>
      </div>
    </div>
  );
};

export default UserCard;