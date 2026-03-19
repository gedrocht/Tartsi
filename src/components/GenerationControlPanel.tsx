import type { ChangeEvent } from "react";
import {
  colorPaletteLibrary,
  type MagicCircleGenerationOptions
} from "../domain/magicCircleGenerator";

export interface GenerationControlPanelProperties {
  magicCircleGenerationOptions: MagicCircleGenerationOptions;
  onMagicCircleGenerationOptionsChange: (
    nextMagicCircleGenerationOptions: MagicCircleGenerationOptions
  ) => void;
  onGenerateRequested: () => void;
  onSurpriseRequested: () => void;
}

function handleTextFieldChange(
  event: ChangeEvent<HTMLInputElement>,
  magicCircleGenerationOptions: MagicCircleGenerationOptions,
  onMagicCircleGenerationOptionsChange: (
    nextMagicCircleGenerationOptions: MagicCircleGenerationOptions
  ) => void
) {
  onMagicCircleGenerationOptionsChange({
    ...magicCircleGenerationOptions,
    [event.target.name]: event.target.value
  });
}

function handleNumberFieldChange(
  event: ChangeEvent<HTMLInputElement>,
  magicCircleGenerationOptions: MagicCircleGenerationOptions,
  onMagicCircleGenerationOptionsChange: (
    nextMagicCircleGenerationOptions: MagicCircleGenerationOptions
  ) => void
) {
  onMagicCircleGenerationOptionsChange({
    ...magicCircleGenerationOptions,
    [event.target.name]: Number(event.target.value)
  });
}

/**
 * The control panel keeps each generation option visible and editable.
 * Beginners can read the labels and immediately see which parts of the output are structural
 * versus purely aesthetic.
 */
export function GenerationControlPanel({
  magicCircleGenerationOptions,
  onMagicCircleGenerationOptionsChange,
  onGenerateRequested,
  onSurpriseRequested
}: GenerationControlPanelProperties) {
  return (
    <section
      className="magic-circle-card"
      aria-labelledby="generator-controls-title"
    >
      <p className="eyebrow-label">Generator controls</p>
      <h2 id="generator-controls-title">Tune the symbolic language</h2>
      <p className="supporting-text">
        Every control feeds the wave-function-collapse solver, so even small adjustments can
        ripple through the final geometry.
      </p>
      <div className="control-grid">
        <label className="field-label">
          Seed phrase
          <input
            className="text-field"
            name="seedPhrase"
            value={magicCircleGenerationOptions.seedPhrase}
            onChange={(event) =>
              handleTextFieldChange(
                event,
                magicCircleGenerationOptions,
                onMagicCircleGenerationOptionsChange
              )
            }
          />
        </label>

        <label className="field-label">
          Ring count
          <input
            className="text-field"
            type="range"
            min={3}
            max={7}
            name="ringCount"
            value={magicCircleGenerationOptions.ringCount}
            onChange={(event) =>
              handleNumberFieldChange(
                event,
                magicCircleGenerationOptions,
                onMagicCircleGenerationOptionsChange
              )
            }
          />
          <span>{magicCircleGenerationOptions.ringCount}</span>
        </label>

        <label className="field-label">
          Base segment count
          <input
            className="text-field"
            type="range"
            min={8}
            max={20}
            name="baseSegmentCount"
            value={magicCircleGenerationOptions.baseSegmentCount}
            onChange={(event) =>
              handleNumberFieldChange(
                event,
                magicCircleGenerationOptions,
                onMagicCircleGenerationOptionsChange
              )
            }
          />
          <span>{magicCircleGenerationOptions.baseSegmentCount}</span>
        </label>

        <label className="field-label">
          Symmetry sectors
          <input
            className="text-field"
            type="range"
            min={2}
            max={8}
            name="symmetrySectorCount"
            value={magicCircleGenerationOptions.symmetrySectorCount}
            onChange={(event) =>
              handleNumberFieldChange(
                event,
                magicCircleGenerationOptions,
                onMagicCircleGenerationOptionsChange
              )
            }
          />
          <span>{magicCircleGenerationOptions.symmetrySectorCount}</span>
        </label>

        <label className="field-label">
          Complexity level
          <input
            className="text-field"
            type="range"
            min={1}
            max={5}
            name="complexityLevel"
            value={magicCircleGenerationOptions.complexityLevel}
            onChange={(event) =>
              handleNumberFieldChange(
                event,
                magicCircleGenerationOptions,
                onMagicCircleGenerationOptionsChange
              )
            }
          />
          <span>{magicCircleGenerationOptions.complexityLevel}</span>
        </label>

        <label className="field-label">
          Color palette
          <select
            className="text-field"
            name="selectedColorPaletteIdentifier"
            value={magicCircleGenerationOptions.selectedColorPaletteIdentifier}
            onChange={(event) =>
              onMagicCircleGenerationOptionsChange({
                ...magicCircleGenerationOptions,
                selectedColorPaletteIdentifier: event.target.value
              })
            }
          >
            {colorPaletteLibrary.map((colorPaletteDefinition) => (
              <option
                key={colorPaletteDefinition.identifier}
                value={colorPaletteDefinition.identifier}
              >
                {colorPaletteDefinition.displayName}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="button-row">
        <button
          className="primary-button"
          type="button"
          onClick={onGenerateRequested}
        >
          Generate magic circle
        </button>
        <button
          className="secondary-button"
          type="button"
          onClick={onSurpriseRequested}
        >
          Surprise me
        </button>
      </div>
    </section>
  );
}

