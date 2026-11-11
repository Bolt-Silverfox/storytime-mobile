import auth from "./auth";

jest.mock("../apiFetch", () => ({ __esModule: true, default: jest.fn() }));
jest.mock("../constants", () => ({ BASE_URL: "https://api.test" }));

const fetchMock = jest.fn();

beforeEach(() => {
  fetchMock.mockReset();
  fetchMock.mockResolvedValue({ ok: true, json: async () => ({}) });
  global.fetch = fetchMock as unknown as typeof fetch;
});

const sentBody = () => fetchMock.mock.calls[0][1].body as string;

describe("reset code wire format", () => {
  it("sends the validate-reset-token code as a JSON string with its leading zero", async () => {
    await auth.vaildateResetToken("parent@example.com", "01234567");
    expect(sentBody()).toContain('"token":"01234567"');
    expect(typeof JSON.parse(sentBody()).token).toBe("string");
  });

  it("sends the reset-password code as a JSON string with its leading zero", async () => {
    await auth.resetpassword("parent@example.com", "01234567", "Secret123!");
    expect(sentBody()).toContain('"token":"01234567"');
    expect(typeof JSON.parse(sentBody()).token).toBe("string");
  });
});
