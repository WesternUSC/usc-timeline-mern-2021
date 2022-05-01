import React, { useEffect, useState } from "react";
import LoadingSpinner from "../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../shared/hooks/http-hook";
import { ReactComponent as SchoolIcon } from "../icons/college.svg";
import { ReactComponent as CultureIcon } from "../icons/around-the-world.svg";
import { ReactComponent as StatsIcon } from "../icons/presentation.svg";
import Button from "../shared/components/FormElements/Button";
import ReadMore from "./ReadMore";

import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";

import "react-vertical-timeline-component/style.min.css";

const USCTimeline = (props) => {
  const { isLoading, sendRequest } = useHttpClient();
  const [loadedEvents, setLoadedEvents] = useState();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/events"
        );

        setLoadedEvents(responseData.events);
      } catch (err) {}
    };
    fetchEvents();
  }, [sendRequest]);

  return (
    <>
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedEvents && (
        <VerticalTimeline>
          {loadedEvents.map((element) => {
            let showButton =
              element.url !== "" &&
              element.url !== undefined &&
              element.url !== null;

            //Select Icon and Icon Style
            let selectIcon = (element) => {
              if (element.category === "USC")
                return [props.schoolIconStyles, <SchoolIcon />, "schoolButton"];
              else if (element.category === "Culture")
                return [
                  props.cultureIconStyles,
                  <CultureIcon />,
                  "cultureButton",
                ];
              else return [props.statsIconStyles, <StatsIcon />, "statsButton"];
            };

            const date = new Date(
              element.date.replace(/-/g, "/").replace(/T.+/, "")
            );
            const month = date.toLocaleString("en-US", { month: "long" });
            const day = date.toLocaleString("en-US", { day: "2-digit" });
            const year = date.getFullYear();
            const dateFormat = month + " " + day + ", " + year;

            return (
              <VerticalTimelineElement
                key={element.key}
                date={dateFormat}
                dateClassName="date"
                iconStyle={selectIcon(element)[0]}
                icon={selectIcon(element)[1]}
              >
                <h3
                  className="vertical-timeline-element-title"
                  style={{ "font-weight": "bold" }}
                >
                  {element.title}
                </h3>
                <small>
                  <h6 className="vertical-timeline-element-subtitle">
                    {element.category}
                  </h6>
                </small>
                {element.image && (
                  <img
                    src={`${element.image}`}
                    alt="thumbnail"
                    style={{
                      height: 200,
                      float: "right",
                      marginBottom: 10,
                      clear: "both",
                    }}
                    className="rounded"
                  />
                )}
                <p id="description">
                  <ReadMore>{element.description}</ReadMore>
                </p>

                {showButton && (
                  <a
                    className={`button ${selectIcon(element)[2]}`}
                    target="_blank"
                    href={element.url}
                  >
                    Learn More
                  </a>
                )}
              </VerticalTimelineElement>
            );
          })}
        </VerticalTimeline>
      )}
    </>
  );
};

export default USCTimeline;
