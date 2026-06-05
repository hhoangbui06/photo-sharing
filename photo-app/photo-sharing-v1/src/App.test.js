import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders login page before authentication", async () => {
  jest.spyOn(global, "fetch").mockResolvedValue({
    ok: false,
    json: async () => ({ error: "Chưa đăng nhập." }),
  });

  render(<App />);
  expect(await screen.findByText("Đăng nhập")).toBeInTheDocument();
  expect(screen.getAllByText("Please Login")).toHaveLength(1);
  expect(screen.getByText("Đăng ký tại đây")).toBeInTheDocument();

  global.fetch.mockRestore();
});
