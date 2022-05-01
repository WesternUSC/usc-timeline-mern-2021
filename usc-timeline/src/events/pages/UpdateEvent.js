import React, { useEffect, useState, useContext, useRef } from "react";
import Select from "react-select";
import { useParams, useHistory } from "react-router-dom";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import "./NewEvent.css";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";
import { useHttpClient } from "../../shared/hooks/http-hook";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { AuthContext } from "../../shared/context/auth-context";

const options = [
  { value: "USC", label: "USC" },
  { value: "Culture", label: "Culture" },
  { value: "Statistics", label: "Statistics" },
];

const UpdateEvent = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedEvent, setLoadedEvent] = useState();
  const eventId = useParams().eventId;
  const history = useHistory();

  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      date: {
        value: "",
        isValid: false,
      },
      category: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
      image: {
        value: null,
        isValid: false,
      },
      url: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/events/${eventId}`
        );
        setLoadedEvent(responseData.event);
        setFormData(
          {
            title: {
              value: responseData.event.title,
              isValid: true,
            },
            date: {
              value: responseData.event.date,
              isValid: true,
            },
            category: {
              value: responseData.event.category,
              isValid: true,
            },
            description: {
              value: responseData.event.description,
              isValid: true,
            },
            image: {
              value: responseData.event.image,
              isValid: true,
            },
            url: {
              value: responseData.event.url,
              isValid: true,
            },
          },
          true
        );
        //console.log(responseData.event);
      } catch (err) {}
    };
    fetchEvent();
  }, [sendRequest, eventId, setFormData]);

  //Select Category
  const [selected, setSelected] = useState({
    selectedOption: null,
  });

  //Selection Change Handler
  const handleChangeSelect = (selectedOption) => {
    setSelected({ selectedOption });
    formState.inputs.category.value = selectedOption.value;
  };

  //On Submit Handler
  const eventUpdateSubmitHandler = async (event) => {
    event.preventDefault();
    if (formState.inputs.category.value) {
      const formData = new FormData();
      formData.append("title", formState.inputs.title.value);
      formData.append("date", formState.inputs.date.value);
      formData.append("category", formState.inputs.category.value);
      formData.append("description", formState.inputs.description.value);
      formData.append("image", formState.inputs.image.value);
      formData.append("url", formState.inputs.url.value);

      //for (var key of formData.entries()) {
      //  console.log(key[0] + ", " + key[1]);
      //}

      try {
        await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/events/${eventId}`,
          "PATCH",
          formData,
          {
            //"Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          }
        );
        history.push("/events");
      } catch (err) {}
    } else {
      alert("Please select a valid category!");
    }
  };

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!loadedEvent && !error) {
    return (
      <div className="center">
        <h2>Could not find event!</h2>
      </div>
    );
  }

  let dateFormat;
  if (loadedEvent.date) {
    let loadedDate = new Date(
      loadedEvent.date.replace(/-/g, "/").replace(/T.+/, "")
    );
    let month = loadedDate.toLocaleString("en-US", { month: "2-digit" });
    let day = loadedDate.toLocaleString("en-US", { day: "2-digit" });
    let year = loadedDate.getFullYear();
    dateFormat = year + "-" + month + "-" + day;
  }

  return (
    <>
      {!isLoading && loadedEvent && (
        <form className="event-form" onSubmit={eventUpdateSubmitHandler}>
          <Input
            id="title"
            element="input"
            type="text"
            label="Title"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid title."
            onInput={inputHandler}
            value={loadedEvent.title}
            valid={true}
          />
          <Input
            element="input"
            id="date"
            label="Date"
            name="date"
            type="text"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid date."
            onInput={inputHandler}
            value={dateFormat}
            valid={true}
          />
          <label className="grey-text" htmlFor="category">
            Category
          </label>
          <Select
            id="category"
            name="category"
            options={options}
            defaultValue={
              options[
                options.findIndex(
                  (option) => option.value === loadedEvent.category
                )
              ]
            }
            onChange={handleChangeSelect}
          />
          <br />
          <Input
            id="description"
            type="text"
            label="Description"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid description."
            onInput={inputHandler}
            value={loadedEvent.description}
            valid={true}
          />
          <ImageUpload
            id="image"
            onInput={inputHandler}
            preview={loadedEvent.image}
            errorText=""
            eventId={eventId}
          />
          <Input
            id="url"
            element="input"
            type="text"
            label="URL"
            style={{ marginTop: 100 }}
            validators={[]}
            errorText="Please enter a valid URL."
            onInput={inputHandler}
            value={loadedEvent.url}
            valid={true}
          />
          <Button type="submit">UPDATE EVENT</Button>
        </form>
      )}
    </>
  );
};

export default UpdateEvent;
