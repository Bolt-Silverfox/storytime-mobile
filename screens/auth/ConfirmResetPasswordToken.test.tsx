import TestRenderer, { act } from "react-test-renderer";
import ConfirmResetPasswordTokenScreen from "./ConfirmResetPasswordToken";

const mockValidatePasswordReset = jest.fn();

jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({ navigate: jest.fn(), goBack: jest.fn() }),
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
jest.mock("../../utils/utils", () => ({ formatTime: () => "0:00" }));
jest.mock("../../components/PageTitle", () => ({
  __esModule: true,
  default: () => null,
}));

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
const submit = () => {
  const button = tree.root.find(
    (node: Instance) =>
      typeof node.type !== "string" &&
      node.props.onPress &&
      node.props.disabled !== undefined &&
      node.findAll((n: Instance) => n.props.children === "Verify Email")
        .length > 0
  );
  if (!button.props.disabled) act(() => button.props.onPress());
};

describe("reset code entry", () => {
  beforeEach(() => mockValidatePasswordReset.mockClear());
  afterEach(() => act(() => tree.unmount()));

  it("renders eight boxes", () => {
    renderScreen();
    expect(
      tree.root.findAll(
        (n: Instance) =>
          n.props.testID === "otp-input" && typeof n.type === "string"
      )
    ).toHaveLength(8);
  });

  it.each(["123456", "12345678"])("submits a %s code", (code) => {
    renderScreen();
    enterCode(code);
    submit();
    expect(mockValidatePasswordReset).toHaveBeenCalledWith(
      expect.objectContaining({ token: code })
    );
  });

  it.each(["", "12345", "1234567"])("does not submit a %j code", (code) => {
    renderScreen();
    enterCode(code);
    submit();
    expect(mockValidatePasswordReset).not.toHaveBeenCalled();
  });
});
