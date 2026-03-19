import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import {
  defaultMagicCircleGenerationOptions,
  generateMagicCircleDiagram
} from "../domain/magicCircleGenerator";
import { ApplicationLogger } from "../services/applicationLogger";
import { MagicCircleCanvas } from "../components/MagicCircleCanvas";

describe("MagicCircleCanvas", () => {
  it("exports the generated SVG when the export button is pressed", async () => {
    const user = userEvent.setup();
    const magicCircleDiagram = generateMagicCircleDiagram(defaultMagicCircleGenerationOptions);
    const applicationLogger = new ApplicationLogger();
    const infoSpy = vi.spyOn(applicationLogger, "info");
    const createObjectUrlSpy = vi
      .spyOn(URL, "createObjectURL")
      .mockReturnValue("blob:generated-magic-circle");
    const revokeObjectUrlSpy = vi
      .spyOn(URL, "revokeObjectURL")
      .mockImplementation(() => undefined);
    const anchorClickSpy = vi
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => undefined);

    render(
      <MagicCircleCanvas
        magicCircleDiagram={magicCircleDiagram}
        applicationLogger={applicationLogger}
      />
    );

    await user.click(screen.getByRole("button", { name: /export svg/i }));

    expect(createObjectUrlSpy).toHaveBeenCalledTimes(1);
    expect(anchorClickSpy).toHaveBeenCalledTimes(1);
    expect(revokeObjectUrlSpy).toHaveBeenCalledWith("blob:generated-magic-circle");
    expect(infoSpy).toHaveBeenCalledWith(
      "canvas",
      "Exported the current magic circle as SVG."
    );
  });
});
