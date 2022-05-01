import React from "react";

import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import EventItem from "./EventItem";
import "./EventsList.css";

const EventsList = (props) => {
  if (props.items.length === 0) {
    return (
      <div className="event-list center">
        <Card>
          <h2>No events found. Maybe create one?</h2>
          <Button to="/events/new">Add Event</Button>
        </Card>
      </div>
    );
  }
  return (
    <ul className="event-list">
      {props.items.map((event, index) => {
        return (
          <EventItem
            key={event.id}
            id={event.id}
            title={event.title}
            date={event.date}
            description={event.description}
            image={event.image}
            url={event.url}
            category={event.category}
            index={index + 1}
            onDelete={props.onDeleteEvent}
          />
        );
      })}
    </ul>
  );
};

export default EventsList;
