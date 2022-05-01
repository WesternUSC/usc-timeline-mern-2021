import Badge from "./Badge.js";
import { ReactComponent as SchoolIcon } from "../icons/college.svg";
import { ReactComponent as CultureIcon } from "../icons/around-the-world.svg";
import { ReactComponent as StatsIcon } from "../icons/presentation.svg";

const BadgeRow = () => {
  let schoolIconStyles = { background: "#c7b0e8" };
  let cultureIconStyles = { background: "#e7c7b0" };
  let statsIconStyles = { background: "#b0e7c7" };

  return (
    <div style={{ textAlign: "center", margin: 40 }}>
      <h5>Categories</h5>
      <div
        className="badge-row"
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Badge name="USC" inheritStyle={schoolIconStyles}>
          <SchoolIcon
            style={{
              height: 40,
              width: 40,
            }}
          />
        </Badge>
        <Badge name="Culture" inheritStyle={cultureIconStyles}>
          <CultureIcon
            style={{
              height: 40,
              width: 40,
            }}
          />
        </Badge>
        <Badge name="Statistics" inheritStyle={statsIconStyles}>
          <StatsIcon
            style={{
              height: 40,
              width: 40,
            }}
          />
        </Badge>
      </div>
    </div>
  );
};

export default BadgeRow;
