import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import Select from "react-select";

import "./NewEvent.css";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../shared/util/validators";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";

const options = [
  { value: "USC", label: "USC" },
  { value: "Culture", label: "Culture" },
  { value: "Statistics", label: "Statistics" },
];

const NewEvent = () => {
  const auth = useContext(AuthContext);
  const { isLoading, sendRequest } = useHttpClient();
  const [formState, inputHandler] = useForm(
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

  const history = useHistory();

  const eventSubmitHandler = async (event) => {
    event.preventDefault();
    if (formState.inputs.category.value) {
      try {
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
        await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/events/new",
          "POST",
          formData,
          {
            //"Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          }
        );
        history.push("/events");
      } catch (err) {}
    } else {
      alert("Please select a category!");
    }
  };

  const [selected, setSelected] = useState({
    selectedOption: null,
  });

  const handleChangeSelect = (selectedOption) => {
    setSelected({ selectedOption });
    formState.inputs.category.value = selectedOption.value;
  };

  return (
    <>
      <form className="form-group event-form" onSubmit={eventSubmitHandler}>
        {isLoading && <LoadingSpinner asOverlay />}
        <Input
          id="title"
          element="input"
          type="text"
          name="title"
          label="Title"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter valid title."
          onInput={inputHandler}
        />
        <Input
          type="date"
          element="input"
          id="date"
          label="Date"
          name="date"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter valid date."
          onInput={inputHandler}
        />
        <label className="grey-text" htmlFor="category">
          Category
        </label>
        <Select
          id="category"
          name="category"
          options={options}
          errorText="Please enter valid category."
          style={{ marginBottom: 16 }}
          onChange={handleChangeSelect}
        />
        <br />

        <Input
          id="description"
          name="description"
          element="textarea"
          label="Description"
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Please enter valid description."
          onInput={inputHandler}
        />
        <ImageUpload id="image" onInput={inputHandler} errorText="" />
        <Input
          id="url"
          name="url"
          element="input"
          type="text"
          label="URL"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter valid URL."
          onInput={inputHandler}
          valid={formState.inputs.url.isValid}
        />
        <Button type="submit">ADD EVENT</Button>
      </form>
    </>
  );
};

export default NewEvent;
