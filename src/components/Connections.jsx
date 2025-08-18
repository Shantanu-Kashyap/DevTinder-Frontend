import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/connectionSlice";
import { Link } from "react-router-dom";
import "./Connections.css";

const Connections = () => {
  const connections = useSelector((store) => store.connections);
  const dispatch = useDispatch();
  
  const fetchConnections = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      dispatch(addConnections(res.data.data));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if (!connections) return null;

  if (connections.length === 0)
    return (
      <div className="connections-container no-connections-container">
        <h1 className="connections-title">Your Connections</h1>
        <p className="no-connections-message">You have no connections yet.</p>
      </div>
    );

  return (
    <div className="connections-container">
      <h1 className="connections-title">Your Connections</h1>

      <div className="connections-list">
        {connections.map((connection) => {
          const { _id, firstName, lastName, photoURL, age, gender, about } = connection;
          return (
            <div key={_id} className="connection-card">
              <div className="connection-info">
                <div className="connection-avatar-container">
                  <img
                    alt="photo"
                    className="connection-avatar"
                    src={photoURL}
                  />
                </div>
                <div className="connection-details">
                  <h2 className="connection-name">
                    {firstName} {lastName}
                  </h2>
                  {about && <p className="connection-about">{about}</p>}
                </div>
              </div>
              <div className="connection-actions">
                <Link to={"/chat/" + _id}>
                  <button className="action-btn chat-btn">Chat</button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Connections;