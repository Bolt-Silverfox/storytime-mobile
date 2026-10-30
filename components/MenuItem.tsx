import { FC, ReactNode, useMemo, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CustomText from "./CustomText";
import { ChevronDown, ChevronRight } from "lucide-react-native";
import { useDefaultStyles } from "../styles";
import { useTheme } from "../theme/ThemeContext";
import type { Tokens } from "../theme/tokens";

type PropTypes = {
  label: string;
  icon?: ReactNode;
  textColor?: string;
  onPress?: () => void;
  isTablet: boolean;
  description?: string;
  isLastItem?: boolean;
};

const MenuItem: FC<PropTypes> = ({
  label,
  icon,
  textColor,
  onPress,
  isTablet,
  description,
  isLastItem = false,
}) => {
  const defaultStyles = useDefaultStyles();
  const { tokens } = useTheme();
  const styles = useMemo(() => makeStyles(tokens), [tokens]);
  const labelColor = textColor ?? tokens.textStrong;
  const [isOpen, setIsOpen] = useState(false);

  if (description) {
    return (
      <Pressable onPress={() => setIsOpen((n) => !n)}>
        <View
          style={[
            styles.menuItem,
            !isLastItem && styles.defaultBorderBottom,
            isOpen && styles.noBorderBottom,
          ]}
        >
          <View style={styles.menuItemLeft} className="w-[85%]">
            {icon}
            <CustomText
              style={[
                styles.menuItemLabel,
                // eslint-disable-next-line react-native/no-inline-styles
                { color: labelColor, fontSize: isTablet ? 18 : 16 },
              ]}
            >
              {label}
            </CustomText>
          </View>
          <CustomText
            // eslint-disable-next-line react-native/no-inline-styles
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
          <View style={styles.openBorder} className="px-4 pb-4">
            <Text style={[defaultStyles.defaultText]}>{description}</Text>
          </View>
        )}
      </Pressable>
    );
  }
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={[styles.menuItem, !isLastItem && styles.defaultBorderBottom]}
      >
        <View style={styles.menuItemLeft} className="w-[85%]">
          {icon}
          <CustomText
            style={[
              styles.menuItemLabel,
              // eslint-disable-next-line react-native/no-inline-styles
              { color: labelColor, fontSize: isTablet ? 18 : 16 },
            ]}
          >
            {label}
          </CustomText>
        </View>
        <CustomText
          // eslint-disable-next-line react-native/no-inline-styles
          style={[styles.menuItemArrow, { fontSize: isTablet ? 24 : 20 }]}
        >
          <ChevronRight strokeWidth={1.5} />
        </CustomText>
      </View>
    </TouchableOpacity>
  );
};

const makeStyles = (tokens: Tokens) =>
  StyleSheet.create({
    menuItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 16,
    },
    menuItemLeft: { flexDirection: "row", alignItems: "center" },
    menuItemLabel: { fontSize: 16, marginLeft: 12 },
    menuItemArrow: { fontSize: 20, color: "#FB923C" },
    defaultBorderBottom: {
      borderBottomWidth: 1,
      borderBottomColor: tokens.borderGray,
    },
    noBorderBottom: { borderBottomWidth: 0 },
    openBorder: { borderBottomWidth: 1, borderBottomColor: tokens.borderGray },
  });
export default MenuItem;
