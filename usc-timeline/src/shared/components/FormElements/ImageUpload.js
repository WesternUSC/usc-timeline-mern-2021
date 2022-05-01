import React, { useRef, useState, useEffect, useContext } from "react";
import { AuthContext } from "../../../shared/context/auth-context";
import { useHttpClient } from "../../../shared/hooks/http-hook";

import Button from "./Button";
import "./ImageUpload.css";

const ImageUpload = (props) => {
  const [file, setFile] = useState();
  const [previewUrl, setPreviewUrl] = useState();
  const [existingPreview, setExistingPreview] = useState(props.preview);
  const [isValid, setIsValid] = useState(false);
  const auth = useContext(AuthContext);
  const { isLoading, sendRequest } = useHttpClient();

  const filePickerRef = useRef();

  useEffect(() => {
    if (!file) {
      return;
    }
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  }, [file]);

  const pickedHandler = (event) => {
    let pickedFile;
    let fileIsValid = isValid;
    if (event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0];
      setFile(pickedFile);
      setIsValid(true);
      fileIsValid = true;
    } else {
      setIsValid(false);
      fileIsValid = false;
    }
    props.onInput(props.id, pickedFile, fileIsValid);
  };

  const pickImageHandler = () => {
    filePickerRef.current.click();
  };

  const removeImageHandler = async () => {
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/events/image/${props.eventId}`,
        "PATCH",
        null,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
      setExistingPreview(null);
    } catch (err) {}
  };

  return (
    <div className="image-picker">
      <input
        id={props.id}
        ref={filePickerRef}
        style={{ display: "none" }}
        type="file"
        accept=".jpg,.png,.jpeg"
        onChange={pickedHandler}
        className="form-control"
      />
      <div className={`image-upload ${props.center && "center"}`}>
        <div className="image-upload__preview">
          {existingPreview && !previewUrl ? (
            <img src={existingPreview} alt="Preview" />
          ) : (
            previewUrl && <img src={previewUrl} alt="Preview" />
          )}
          {/*previewUrl && <img src={previewUrl} alt="Preview" />*/}
          {!previewUrl && !existingPreview && <p>Please pick an image.</p>}
        </div>
        <Button type="button" onClick={pickImageHandler}>
          PICK IMAGE
        </Button>
        {existingPreview && !previewUrl && (
          <Button danger type="button" onClick={removeImageHandler}>
            X
          </Button>
        )}
        {/*previewUrl && (
          <Button danger type="button" onClick={resetPicker}>
            X
          </Button>
        )*/}
      </div>
      {!isValid && <p>{props.errorText}</p>}
    </div>
  );
};

export default ImageUpload;
