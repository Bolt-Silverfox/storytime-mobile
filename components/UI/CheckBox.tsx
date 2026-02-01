import { Pressable } from "react-native";
import Icon from "../Icon";

type PropTypes = {
  onPress: () => void;
  isSelected: boolean;
};

const CheckBox = ({ onPress, isSelected }: PropTypes) => {
  return (
    <Pressable
      onPress={onPress}
      className={`flex size-8 flex-col items-center justify-center rounded-lg ${isSelected ? "bg-blue" : "border border-border-light bg-white "}`}
    >
      <Icon name="Check" color="white" size={20} />
    </Pressable>
  );
};

export default CheckBox;
