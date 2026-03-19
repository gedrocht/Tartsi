import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import {
  defaultMagicCircleGenerationOptions,
  colorPaletteLibrary
} from "../domain/magicCircleGenerator";
import { GenerationControlPanel } from "../components/GenerationControlPanel";

describe("GenerationControlPanel", () => {
  it("emits updated generation options for each editable field", () => {
    const onMagicCircleGenerationOptionsChange = vi.fn();
    const alternateColorPaletteIdentifier =
      colorPaletteLibrary[1]?.identifier ?? colorPaletteLibrary[0]?.identifier ?? "solar-gold";

    render(
      <GenerationControlPanel
        magicCircleGenerationOptions={defaultMagicCircleGenerationOptions}
        onMagicCircleGenerationOptionsChange={onMagicCircleGenerationOptionsChange}
        onGenerateRequested={vi.fn()}
        onSurpriseRequested={vi.fn()}
      />
    );

    const seedPhraseField = screen.getByLabelText(/seed phrase/i);
    const ringCountField = screen.getByLabelText(/ring count/i);
    const baseSegmentCountField = screen.getByLabelText(/base segment count/i);
    const symmetrySectorCountField = screen.getByLabelText(/symmetry sectors/i);
    const complexityLevelField = screen.getByLabelText(/complexity level/i);
    const colorPaletteField = screen.getByLabelText(/color palette/i);

    fireEvent.change(seedPhraseField, { target: { name: "seedPhrase", value: "Beginner-Test-Seed" } });
    fireEvent.change(ringCountField, { target: { name: "ringCount", value: "6" } });
    fireEvent.change(baseSegmentCountField, {
      target: { name: "baseSegmentCount", value: "18" }
    });
    fireEvent.change(symmetrySectorCountField, {
      target: { name: "symmetrySectorCount", value: "8" }
    });
    fireEvent.change(complexityLevelField, { target: { name: "complexityLevel", value: "5" } });
    fireEvent.change(colorPaletteField, {
      target: {
        value: alternateColorPaletteIdentifier
      }
    });

    expect(onMagicCircleGenerationOptionsChange).toHaveBeenNthCalledWith(1, {
      ...defaultMagicCircleGenerationOptions,
      seedPhrase: "Beginner-Test-Seed"
    });
    expect(onMagicCircleGenerationOptionsChange).toHaveBeenNthCalledWith(2, {
      ...defaultMagicCircleGenerationOptions,
      ringCount: 6
    });
    expect(onMagicCircleGenerationOptionsChange).toHaveBeenNthCalledWith(3, {
      ...defaultMagicCircleGenerationOptions,
      baseSegmentCount: 18
    });
    expect(onMagicCircleGenerationOptionsChange).toHaveBeenNthCalledWith(4, {
      ...defaultMagicCircleGenerationOptions,
      symmetrySectorCount: 8
    });
    expect(onMagicCircleGenerationOptionsChange).toHaveBeenNthCalledWith(5, {
      ...defaultMagicCircleGenerationOptions,
      complexityLevel: 5
    });
    expect(onMagicCircleGenerationOptionsChange).toHaveBeenNthCalledWith(6, {
      ...defaultMagicCircleGenerationOptions,
      selectedColorPaletteIdentifier: alternateColorPaletteIdentifier
    });
  });

  it("invokes the generate and surprise callbacks when the buttons are pressed", async () => {
    const user = userEvent.setup();
    const onGenerateRequested = vi.fn();
    const onSurpriseRequested = vi.fn();

    render(
      <GenerationControlPanel
        magicCircleGenerationOptions={defaultMagicCircleGenerationOptions}
        onMagicCircleGenerationOptionsChange={vi.fn()}
        onGenerateRequested={onGenerateRequested}
        onSurpriseRequested={onSurpriseRequested}
      />
    );

    await user.click(screen.getByRole("button", { name: /generate magic circle/i }));
    await user.click(screen.getByRole("button", { name: /surprise me/i }));

    expect(onGenerateRequested).toHaveBeenCalledTimes(1);
    expect(onSurpriseRequested).toHaveBeenCalledTimes(1);
  });
});
