import { StyleSheet } from "react-native";
import colours from "./colours";

const defaultStyles = StyleSheet.create({
  defaultText: {
    fontSize: 16,
    color: colours.text,
    fontFamily: "abeezee",
  },
  linkText: {
    fontSize: 16,
    color: colours.link,
    fontFamily: "abeezee",
  },
  input: {
    borderColor: colours.border,
    borderRadius: 60,
    height: 50,
    borderWidth: 1,
    fontSize: 14,
    position: "relative",
    paddingHorizontal: 16,
  },
  heading: {
    fontFamily: "quilka",
    fontSize: 24,
    textAlign: "center",
    color: colours.black,
  },
  smallText: {
    fontFamily: "abeezee",
    fontSize: 12,
    color: colours.text,
  },
  screen: {
    paddingVertical: 46,
    paddingHorizontal: 17,
    backgroundColor: colours["bg-light"],
    flex: 1,
  },
  label: {
    color: colours.black,
    fontSize: 16,
    fontFamily: "abeezee",
  },
  button: {
    backgroundColor: colours.primary,
    borderRadius: 100,
    paddingVertical: 12,
    textAlign: "center",
    width: "100%",
    maxWidth: 600,
    alignSelf: "center",
  },
  buttonDisabled: {
    backgroundColor: colours.disabled,
    borderRadius: 100,
    paddingVertical: 12,
    textAlign: "center",
    width: "100%",
    maxWidth: 600,
    alignSelf: "center",
  },
});

export default defaultStyles;
