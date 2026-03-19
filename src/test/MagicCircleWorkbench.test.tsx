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

    const seedPhraseField = screen.getByLabelText(/seed phrase/i) as HTMLInputElement;
    const originalSeedPhrase = seedPhraseField.value;

    await user.click(screen.getByRole("button", { name: /surprise me/i }));

    expect(seedPhraseField).not.toHaveValue(originalSeedPhrase);
  });
});
