import { FontAwesome6 } from "@expo/vector-icons";

type PropTypes = {
  size?: number;
  status: "active" | "inactive";
};

const StreakIcon = ({ status, size = 28 }: PropTypes) => {
  return (
    <FontAwesome6
      name="fire-flame-curved"
      size={size}
      color={status === "active" ? "#ECC607" : "#BDBDBD"}
    />
  );
};

export default StreakIcon;
