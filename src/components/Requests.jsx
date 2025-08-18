import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addRequests, removeRequest } from "../utils/requestSlice";
import { useEffect, useState } from "react";
import "./Requests.css";

const Requests = () => {
  const requests = useSelector((store) => store.requests);
  const dispatch = useDispatch();

  const reviewRequest = async (status, _id) => {
    try {
      const res = axios.post(
        BASE_URL + "/request/review/" + status + "/" + _id,
        {},
        { withCredentials: true }
      );
      dispatch(removeRequest(_id));
    } catch (err) {}
  };

  const fetchRequests = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/requests/received", {
        withCredentials: true,
      });
      dispatch(addRequests(res.data.data));
    } catch (err) {}
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (!requests) return;

  if (requests.length === 0)
    return (
      <div className="requests-container no-requests-container">
        <h1 className="requests-title">Connection Requests</h1>
        <p className="no-requests-message">No new requests found.</p>
      </div>
    );

  return (
    <div className="requests-container">
      <h1 className="requests-title">Connection Requests</h1>

      <div className="requests-list">
        {requests.map((request) => {
          const { _id, firstName, lastName, photoURL, age, gender, about } = request.fromUserId;
          return (
            <div key={_id} className="request-card">
              <div className="request-info">
                <div className="request-avatar-container">
                  <img
                    alt="photo"
                    className="request-avatar"
                    src={photoURL}
                  />
                </div>
                <div className="request-details">
                  <h2 className="request-name">
                    {firstName} {lastName}
                  </h2>
                  {age && gender && (
                    <p className="request-meta">{age}, {gender}</p>
                  )}
                  {about && <p className="request-about">{about}</p>}
                </div>
              </div>

              <div className="request-actions">
                <button
                  className="action-btn reject-btn"
                  onClick={() => reviewRequest("rejected", request._id)}
                >
                  Reject
                </button>
                <button
                  className="action-btn accept-btn"
                  onClick={() => reviewRequest("accepted", request._id)}
                >
                  Accept
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default Requests;