import React, { useEffect, useState } from "react";

import EventsList from "../components/EventsList";
import Button from "../../shared/components/FormElements/Button";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";
import "./Events.css";

const Events = () => {
  const { isLoading, sendRequest } = useHttpClient();
  const [loadedEvents, setLoadedEvents] = useState();
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/events/"
        );

        setLoadedEvents(responseData.events);
      } catch (err) {}
    };
    fetchEvents();
  }, [sendRequest]);

  const eventDeletedHandler = (deletedEventId) => {
    setLoadedEvents((prevEvents) =>
      prevEvents.filter((event) => event.id !== deletedEventId)
    );
  };

  return (
    <React.Fragment>
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}

      {!isLoading && loadedEvents && (
        <EventsList items={loadedEvents} onDeleteEvent={eventDeletedHandler} />
      )}
    </React.Fragment>
  );
};

export default Events;
