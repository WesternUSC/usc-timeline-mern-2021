import React, { useEffect, useState, useRef } from "react";
import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import BadgeRow from "../../components/BadgeRow";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { ReactComponent as SchoolIcon } from "../../icons/college.svg";
import { ReactComponent as CultureIcon } from "../../icons/around-the-world.svg";
import { ReactComponent as StatsIcon } from "../../icons/presentation.svg";
import ReadMore from "../../components/ReadMore";

import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";

import "react-vertical-timeline-component/style.min.css";

const searchOptions = [
  { value: "dates", label: "Dates" },
  { value: "text", label: "Text" },
];

const Search = () => {
  let schoolIconStyles = { background: "#c7b0e8" };
  let cultureIconStyles = { background: "#e7c7b0" };
  let statsIconStyles = { background: "#b0e7c7" };

  //Store search form values
  const [search, setSearch] = useState({
    to: "",
    from: "",
    category: "",
  });

  //Store search form values
  const [searchQuery, setSearchQuery] = useState({
    query: "",
  });

  //Store search type
  const [searchType, setSearchType] = useState(true);

  //Search Ref
  const searchRef = useRef();

  //Request events from server
  const { isLoading, sendRequest } = useHttpClient();
  const [loadedEvents, setLoadedEvents] = useState();
  const [reset, setReset] = useState(true);

  //Request events upon component re-render
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
  }, [setSearch, sendRequest]);

  //Store values on change
  function handleChange(event) {
    const value = event.target.value;
    setSearch({
      ...search,
      [event.target.name]: value,
    });
  }

  //Store query on change
  function handleQuery(event) {
    const value = event.target.value;
    setSearchQuery({
      ...searchQuery,
      query: value,
    });
  }

  //Change form type
  function handleSelectedSearch() {
    searchRef.current.value === "text"
      ? setSearchType(false)
      : setSearchType(true);
  }

  //Reset events filters and form fields
  const resetHandler = async () => {
    const responseData = await sendRequest(
      process.env.REACT_APP_BACKEND_URL + "/events"
    );
    setLoadedEvents(responseData.events);

    setSearch({ from: "", to: "", category: "" });
    setSearchQuery({ query: "" });

    setReset(true);
  };

  //Search filters based on user selection
  const searchSubmitHandler = async (event) => {
    event.preventDefault();

    //Filter by dates no category
    function filterByDate(item) {
      if (item.date >= search.from && item.date <= search.to) {
        return true;
      }
      return false;
    }

    //Filter by dates and category
    function filterByCategory(item) {
      if (
        item.date >= search.from &&
        item.date <= search.to &&
        item.category === search.category
      ) {
        return true;
      }
      return false;
    }

    //Filter events array
    try {
      if (search.from && search.to && search.category) {
        setLoadedEvents(loadedEvents.filter(filterByCategory));
        setReset(false);
      } else if (
        search.category === "None" ||
        (search.category === "" && search.from && search.to)
      ) {
        setLoadedEvents(loadedEvents.filter(filterByDate));
        setReset(false);
      } else {
        alert("Please enter a valid date range!");
        setLoadedEvents(loadedEvents);
      }
    } catch (err) {}
  };

  //Search filters based on user selection
  const textSubmitHandler = async (event) => {
    event.preventDefault();

    const responseData = await sendRequest(
      process.env.REACT_APP_BACKEND_URL + "/events/search",
      "POST",
      JSON.stringify({ search_query: searchQuery.query }),
      {
        "Content-Type": "application/json",
      }
    );
    setLoadedEvents(responseData.events);
  };

  return (
    <div>
      <div
        className="search-title"
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Card style={{ width: 1000 }}>
          <h3 style={{ fontWeight: "bold" }} className="title">
            Search Events
          </h3>
        </Card>
      </div>
      <div
        className="form-wrapper"
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 20,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="search-type">
          <label className="grey-text" htmlFor="search-select">
            Search By:
          </label>
          <select
            id="search-select"
            name="search-select"
            ref={searchRef}
            onChange={handleSelectedSearch}
            style={{ marginBottom: 22 }}
            className="browser-default custom-select"
          >
            {searchOptions.map((option) => {
              return <option value={option.value}>{option.label}</option>;
            })}
          </select>
        </div>
        {searchType && !searchQuery.query ? (
          <div id="dates-form">
            <form
              id="date-search-form"
              className="form-group"
              onSubmit={searchSubmitHandler}
            >
              <div
                className="inputs-group"
                style={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: 20,
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: 50,
                }}
              >
                <div className="from">
                  <label className="grey-text" htmlFor="from">
                    From
                  </label>
                  <input
                    id="from"
                    type="date"
                    name="from"
                    value={search.from}
                    onChange={handleChange}
                    style={{ marginTop: 0 }}
                    className="form-control"
                  />
                </div>
                <div className="to">
                  <label className="grey-text" htmlFor="to">
                    To
                  </label>
                  <input
                    id="to"
                    type="date"
                    name="to"
                    value={search.to}
                    onChange={handleChange}
                    style={{ marginTop: 0 }}
                    className="form-control"
                  />
                </div>
                <div className="category">
                  <label className="grey-text" htmlFor="category">
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={search.category}
                    onChange={handleChange}
                    style={{ marginBottom: 16 }}
                    className="browser-default custom-select"
                  >
                    <option value="None">None</option>
                    <option value="USC">USC</option>
                    <option value="Culture">Culture</option>
                    <option value="Statistics">Statistics</option>
                  </select>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Button disabled={!reset} type="submit">
                  SEARCH
                </Button>
                <Button
                  className="event-button"
                  disabled={reset}
                  style={{ color: "white" }}
                  onClick={resetHandler}
                >
                  RESET
                </Button>
              </div>
            </form>
          </div>
        ) : (
          <div id="text-form">
            <form
              id="query-form"
              className="form-group"
              onSubmit={textSubmitHandler}
            >
              <div
                className="inputs-group"
                style={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: 20,
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: 50,
                }}
              >
                <div className="text-search">
                  <label className="grey-text" htmlFor="search_query">
                    Search Query
                  </label>
                  <input
                    id="search_query"
                    type="text"
                    name="search_query"
                    placeholder="Search..."
                    value={searchQuery.query}
                    onChange={handleQuery}
                    style={{ marginBottom: 55, marginTop: 0, width: 300 }}
                    className="form-control"
                  />
                </div>

                <div style={{ marginBottom: 25 }}>
                  <Button type="submit">SEARCH</Button>
                  <Button
                    className="event-button"
                    danger
                    disabled={!searchQuery.query}
                    style={{ color: "white" }}
                    onClick={resetHandler}
                  >
                    RESET
                  </Button>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
      <div className="search-results">
        <BadgeRow />
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
                  return [schoolIconStyles, <SchoolIcon />, "schoolButton"];
                else if (element.category === "Culture")
                  return [cultureIconStyles, <CultureIcon />, "cultureButton"];
                else return [statsIconStyles, <StatsIcon />, "statsButton"];
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
      </div>
    </div>
  );
};

export default Search;
