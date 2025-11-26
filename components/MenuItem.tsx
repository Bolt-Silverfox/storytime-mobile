import { FC, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CustomText from "./CustomText";
import { ChevronDown, ChevronRight } from "lucide-react-native";
import defaultStyles from "../styles";

const MenuItem: FC<any> = ({
  label,
  icon,
  textColor = "#000",
  onPress,
  isTablet,
  description,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  if (description) {
    return (
      <Pressable onPress={() => setIsOpen((n) => !n)}>
        <View style={[styles.menuItem, isOpen && { borderBottomWidth: 0 }]}>
          <View style={styles.menuItemLeft} className="w-[85%]">
            {icon}
            <CustomText
              style={[
                styles.menuItemLabel,
                { color: textColor, fontSize: isTablet ? 18 : 16 },
              ]}
            >
              {label}
            </CustomText>
          </View>
          <CustomText
            style={[styles.menuItemArrow, { fontSize: isTablet ? 24 : 20 }]}
          >
            {isOpen ? (
              <ChevronDown strokeWidth={1.5} />
            ) : (
              <ChevronRight strokeWidth={1.5} />
            )}
          </CustomText>
        </View>

        {isOpen && (
          <View
            style={[
              isOpen && { borderBottomWidth: 1, borderBottomColor: "#E5E7EB" },
            ]}
            className="px-4 pb-4 "
          >
            <Text style={[defaultStyles.defaultText]}>{description}</Text>
          </View>
        )}
      </Pressable>
    );
  }
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.menuItem}>
        <View style={styles.menuItemLeft} className="w-[85%]">
          {icon}
          <CustomText
            style={[
              styles.menuItemLabel,
              { color: textColor, fontSize: isTablet ? 18 : 16 },
            ]}
          >
            {label}
          </CustomText>
        </View>
        <CustomText
          style={[styles.menuItemArrow, { fontSize: isTablet ? 24 : 20 }]}
        >
          <ChevronRight strokeWidth={1.5} />
        </CustomText>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  menuItemLeft: { flexDirection: "row", alignItems: "center" },
  menuItemLabel: { fontSize: 16, marginLeft: 12 },
  menuItemArrow: { fontSize: 20, color: "#FB923C" },
});
export default MenuItem;
