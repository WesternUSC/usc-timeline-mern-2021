import React, { useContext, useRef } from "react";
import { useHttpClient } from "../shared/hooks/http-hook";
import { AuthContext } from "../shared/context/auth-context";
import Card from "../shared/components/UIElements/Card";
import Button from "../shared/components/FormElements/Button";
import "./UsersList.css";

const UsersList = (props) => {
  const auth = useContext(AuthContext);
  const { sendRequest } = useHttpClient();
  const userIdRef = useRef();

  const deleteHandler = async (id) => {
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/users/${id}`,
        "DELETE",
        null,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
      props.onDeleteUser(id);
    } catch (err) {}
  };
  if (props.items.length === 0) {
    return (
      <div className="center">
        <Card>
          <h2>No users found.</h2>
        </Card>
      </div>
    );
  }

  return (
    <Card className="users-card">
      <table className="users-list">
        <tr>
          <th>USERS</th>
          <th>
            <Button create to="/users/new">
              <i class="fas fa-plus" style={{ paddingRight: 10 }}></i> ADD USER
            </Button>
          </th>
        </tr>
        {props.items.map((user, index) => (
          <tr className="user-item">
            <td>
              <p>{user.username}</p>
              <small>
                UID:{" "}
                <span ref={userIdRef} id={`user-${index}`}>
                  {user.id}
                </span>
              </small>
            </td>
            <td>
              {user.id !== "60a5430a404e9f49781467ef" ? (
                <Button danger onClick={() => deleteHandler(user.id)}>
                  DELETE
                </Button>
              ) : (
                <Button danger disabled>
                  DELETE
                </Button>
              )}
            </td>
          </tr>
        ))}
      </table>
    </Card>
  );
};

export default UsersList;
