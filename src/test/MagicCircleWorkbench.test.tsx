import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MagicCircleWorkbench } from "../components/MagicCircleWorkbench";

describe("MagicCircleWorkbench", () => {
  it("renders the main workbench sections", () => {
    render(<MagicCircleWorkbench />);

    expect(
      screen.getByRole("heading", { name: /wave-function-collapse magic circles in react/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /magic circle preview/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /log console/i })).toBeInTheDocument();
  });

  it("allows a user to request a surprising new seed phrase", async () => {
    const user = userEvent.setup();

    render(<MagicCircleWorkbench />);

    const seedPhraseField = screen.getByLabelText(/seed phrase/i);

    if (!(seedPhraseField instanceof HTMLInputElement)) {
      throw new Error("The seed phrase control should render as an HTML input element.");
    }

    const originalSeedPhrase = seedPhraseField.value;

    await user.click(screen.getByRole("button", { name: /surprise me/i }));

    expect(seedPhraseField).not.toHaveValue(originalSeedPhrase);
  });

  it("lets the user regenerate the current circle from the control panel", async () => {
    const user = userEvent.setup();

    render(<MagicCircleWorkbench />);

    await user.click(screen.getByRole("button", { name: /generate magic circle/i }));

    expect(screen.getByText(/regenerating the magic circle/i)).toBeInTheDocument();
  });
});
