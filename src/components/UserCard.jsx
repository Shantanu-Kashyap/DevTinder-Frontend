import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";

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
    <div className="flex flex-col items-center max-w-sm rounded-3xl overflow-hidden shadow-2xl bg-gray-900 text-gray-100 p-8 transform transition-transform duration-300 hover:scale-105">
      
      {/* User Photo Section */}
      <div className="w-48 h-48 mb-6 rounded-full overflow-hidden border-4 border-indigo-500 shadow-md flex items-center justify-center bg-gray-700">
        <img
          src={photoURL}
          alt={`${firstName} ${lastName}`}
          className="w-full h-full object-cover"
        />
      </div>

      {/* User Info Section */}
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold mb-1">
          {firstName} {lastName}
        </h2>
        {age && gender && (
          <p className="text-lg text-gray-400 font-medium">
            {age}, {gender}
          </p>
        )}
        <p className="mt-4 text-base italic text-gray-300">
          {about || "No bio provided."}
        </p>
      </div>

      
      <div className="flex justify-center gap-4 w-full">
        <button
          className="flex-1 py-3 px-6 rounded-full font-bold text-lg text-white-500 border-2 border-pink-500 hover:bg-pink-500 hover:text-white transition-all duration-300"
          onClick={() => handleSendRequest("ignored", _id)}
        >
          Ignore
        </button>
        <button
          className="flex-1 py-3 px-6 rounded-full font-bold text-lg bg-indigo-500 hover:bg-indigo-400 text-white transition-all duration-300 shadow-lg"
          onClick={() => handleSendRequest("interested", _id)}
        >
          Interested
        </button>
      </div>
    </div>
  );
};
export default UserCard;