import React, { useState } from "react";
import "../App.css";
const ReadMore = ({ children }) => {
  const text = children;
  const [readMore, setReadMore] = useState(true);
  const toggleReadMore = () => {
    setReadMore(!readMore);
  };
  return (
    <>
      {readMore ? text.slice(0, 250) : text}
      <a onClick={toggleReadMore} className="read-or-hide">
        {text.length > 250 ? (
          <span>
            {readMore ? (
              <span>
                ... <span className="read-more">[Read More]</span>
              </span>
            ) : (
              <p className="show-less"> show less </p>
            )}
          </span>
        ) : (
          ""
        )}
      </a>
    </>
  );
};

export default ReadMore;
