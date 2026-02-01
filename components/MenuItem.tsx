import { FC, ReactNode, useState } from "react";
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

interface MenuItemProps {
  label: string;
  icon?: ReactNode;
  textColor?: string;
  onPress?: () => void;
  isTablet?: boolean;
  description?: string;
}

const MenuItem: FC<MenuItemProps> = ({
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
        <View style={[styles.menuItem, isOpen && styles.menuItemNoBorder]}>
          <View style={styles.menuItemLeft} className="w-[85%]">
            {icon}
            <CustomText
              style={[
                isTablet ? styles.menuItemLabelTablet : styles.menuItemLabel,
                { color: textColor },
              ]}
            >
              {label}
            </CustomText>
          </View>
          <CustomText
            style={isTablet ? styles.menuItemArrowTablet : styles.menuItemArrow}
          >
            {isOpen ? (
              <ChevronDown strokeWidth={1.5} />
            ) : (
              <ChevronRight strokeWidth={1.5} />
            )}
          </CustomText>
        </View>

        {isOpen && (
          <View style={styles.descriptionBorder} className="px-4 pb-4 ">
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
              isTablet ? styles.menuItemLabelTablet : styles.menuItemLabel,
              { color: textColor },
            ]}
          >
            {label}
          </CustomText>
        </View>
        <CustomText
          style={isTablet ? styles.menuItemArrowTablet : styles.menuItemArrow}
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
  menuItemNoBorder: {
    borderBottomWidth: 0,
  },
  menuItemLeft: { flexDirection: "row", alignItems: "center" },
  menuItemLabel: { fontSize: 16, marginLeft: 12 },
  menuItemLabelTablet: { fontSize: 18, marginLeft: 12 },
  menuItemArrow: { fontSize: 20, color: "#FB923C" },
  menuItemArrowTablet: { fontSize: 24, color: "#FB923C" },
  descriptionBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
});
export default MenuItem;
