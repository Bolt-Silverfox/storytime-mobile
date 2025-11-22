import { FC } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import CustomText from "./CustomText";

const MenuItem: FC<any> = ({
  label,
  icon,
  textColor = "#000",
  onPress,
  isTablet,
}) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <View style={styles.menuItemLeft}>
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
      ›
    </CustomText>
  </TouchableOpacity>
);

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
