import TestRenderer, { act } from "react-test-renderer";
import { StyleSheet, useWindowDimensions } from "react-native";
import ConfirmResetPasswordTokenScreen, {
  RESET_CODE_LENGTH,
} from "./ConfirmResetPasswordToken";

const mockValidatePasswordReset = jest.fn();
const mockNavigate = jest.fn();

jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({ navigate: mockNavigate, goBack: jest.fn() }),
  useRoute: () => ({ params: { email: "parent@example.com" } }),
}));
jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn().mockResolvedValue(null),
  setItem: jest.fn().mockResolvedValue(undefined),
  removeItem: jest.fn().mockResolvedValue(undefined),
}));
jest.mock("../../contexts/AuthContext", () => ({
  __esModule: true,
  default: () => ({
    isLoading: false,
    validatePasswordReset: mockValidatePasswordReset,
    resendVerificationEmail: jest.fn(),
  }),
}));
jest.mock("../../styles", () => ({
  makeDefaultStyles: jest.fn(),
  useDefaultStyles: () => ({
    screen: {},
    heading: {},
    defaultText: {},
    linkText: {},
  }),
}));
jest.mock("../../theme/ThemeContext", () => ({
  useTheme: () => ({ tokens: { link: "blue" }, isDark: false }),
}));
jest.mock("../../components/UI/SafeAreaWrapper", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => children,
}));
jest.mock("react-native/Libraries/Utilities/useWindowDimensions", () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock("../../utils/utils", () => ({ formatTime: () => "0:00" }));
jest.mock("../../components/PageTitle", () => ({
  __esModule: true,
  default: () => null,
}));

const mockWidth = (width: number) =>
  (useWindowDimensions as jest.Mock).mockReturnValue({
    width,
    height: 800,
    scale: 2,
    fontScale: 1,
  });

const SCREEN_PADDING = 34;

let tree: ReturnType<typeof TestRenderer.create>;
type Instance = typeof tree.root;

const renderScreen = () => {
  act(() => {
    tree = TestRenderer.create(<ConfirmResetPasswordTokenScreen />);
  });
};
const enterCode = (code: string) =>
  act(() => {
    tree.root
      .findByProps({ testID: "otp-input-hidden" })
      .props.onChangeText(code);
  });
const pressVerify = () => {
  const label = tree.root.find(
    (n: Instance) => n.props.children === "Verify Email"
  );
  let node: Instance | null = label;
  while (node && typeof node.type !== "string") node = node.parent;
  while (node && !node.props.onClick) node = node.parent;
  act(() => node!.props.onClick({ stopPropagation: jest.fn() }));
};
const boxes = () =>
  tree.root.findAll(
    (n: Instance) =>
      n.props.testID === "otp-input" && typeof n.type === "string"
  );
const rowWidth = () => {
  const box = StyleSheet.flatten(boxes()[0].props.style);
  return RESET_CODE_LENGTH * (box.width + 2 * box.marginHorizontal);
};

describe("reset code entry", () => {
  afterEach(() => act(() => tree.unmount()));
  beforeEach(() => {
    mockValidatePasswordReset.mockReset();
    mockNavigate.mockReset();
    mockWidth(375);
  });

  it("renders eight boxes", () => {
    renderScreen();
    expect(boxes()).toHaveLength(8);
  });

  it.each([
    ["123456", "123456"],
    ["12345678", "12345678"],
    ["01234567", "01234567"],
    ["123456 ", "123456"],
    ["123456\n", "123456"],
    [" 12345678 ", "12345678"],
    ["1234 5678", "12345678"],
  ])("submits %j as %s", (typed, expected) => {
    renderScreen();
    enterCode(typed);
    pressVerify();
    expect(mockValidatePasswordReset).toHaveBeenCalledTimes(1);
    const args = mockValidatePasswordReset.mock.calls[0][0];
    expect(args.token).toBe(expected);
    expect(typeof args.token).toBe("string");
    args.onSuccess();
    expect(mockNavigate).toHaveBeenCalledWith("auth", {
      screen: "inputNewPassword",
      params: { email: "parent@example.com", token: expected },
    });
  });

  it.each(["", "12345", "1234567", "12a45b", "abcdef", "123456789"])(
    "does not submit %j",
    (typed) => {
      renderScreen();
      enterCode(typed);
      pressVerify();
      expect(mockValidatePasswordReset).not.toHaveBeenCalled();
    }
  );

  it.each([300, 320, 360, 414])(
    "fits the code row inside a %ipt wide screen",
    (width) => {
      mockWidth(width);
      renderScreen();
      expect(rowWidth()).toBeLessThanOrEqual(width - SCREEN_PADDING);
    }
  );
});
