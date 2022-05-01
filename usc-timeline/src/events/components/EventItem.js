import React, { useContext } from "react";
import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import { useHttpClient } from "../../shared/hooks/http-hook";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { AuthContext } from "../../shared/context/auth-context";

import "./EventItem.css";

const EventItem = (props) => {
  const auth = useContext(AuthContext);
  const { isLoading, sendRequest } = useHttpClient();

  const date = new Date(props.date.replace(/-/g, "/").replace(/T.+/, ""));
  const month = date.toLocaleString("en-US", { month: "2-digit" });
  const day = date.toLocaleString("en-US", { day: "2-digit" });
  const year = date.getFullYear();
  const dateFormat = year + "-" + month + "-" + day;

  const deleteHandler = async () => {
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/events/${props.id}`,
        "DELETE",
        null,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
      props.onDelete(props.id);
    } catch (err) {}
  };

  return (
    <li className="event-item">
      <Card>
        {isLoading && <LoadingSpinner asOverlay />}
        <div className="event-item__info">
          <h3 style={{ fontWeight: "bold" }}>
            {props.index}. {props.title}
          </h3>
          <h5>{dateFormat}</h5>
          <p>{props.description}</p>
          {props.image && (
            <img
              src={`${props.image}`}
              alt="thumbnail"
              style={{ height: 300, marginBottom: 10 }}
              className="img-thumbnail"
            />
          )}
          <small>
            <p>EID: {props.id} </p>
          </small>
        </div>
        <div className="event-item__actions">
          <Button to={`/events/${props.id}`}>EDIT</Button>
          <Button danger onClick={deleteHandler}>
            DELETE
          </Button>
        </div>
      </Card>
    </li>
  );
};

export default EventItem;
