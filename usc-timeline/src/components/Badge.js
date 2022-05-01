import "./Badge.css";

const Badge = (props) => {
  return (
    <div className="badge-container">
      <div className="badge" style={props.inheritStyle}>
        {props.children}
      </div>
      <h5 classsName="badge-name">{props.name}</h5>
    </div>
  );
};

export default Badge;
