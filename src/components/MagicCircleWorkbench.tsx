import { startTransition, useEffect, useState } from "react";
import {
  defaultMagicCircleGenerationOptions,
  generateMagicCircleDiagram,
  type MagicCircleDiagram,
  type MagicCircleGenerationOptions
} from "../domain/magicCircleGenerator";
import { sharedApplicationLogger } from "../services/applicationLogger";
import { GenerationControlPanel } from "./GenerationControlPanel";
import { MagicCircleCanvas } from "./MagicCircleCanvas";
import { LogConsolePanel } from "./LogConsolePanel";
import { DocumentationPanel } from "./DocumentationPanel";

function createSurpriseSeedPhrase(): string {
  return `Tartsi-${crypto.randomUUID().slice(0, 8)}-Constellation`;
}

/**
 * The workbench is the application's orchestration layer. It keeps the user's current
 * generator settings, reacts to button presses, and coordinates the canvas and log console.
 */
export function MagicCircleWorkbench() {
  const [magicCircleGenerationOptions, setMagicCircleGenerationOptions] =
    useState<MagicCircleGenerationOptions>(defaultMagicCircleGenerationOptions);
  const [magicCircleDiagram, setMagicCircleDiagram] = useState<MagicCircleDiagram>(() =>
    generateMagicCircleDiagram(defaultMagicCircleGenerationOptions, sharedApplicationLogger)
  );
  const [applicationLogEntries, setApplicationLogEntries] = useState(
    sharedApplicationLogger.getEntries()
  );

  useEffect(() => {
    const unsubscribeFromLogUpdates = sharedApplicationLogger.subscribe(
      (nextApplicationLogEntries) => {
        setApplicationLogEntries(nextApplicationLogEntries);
      }
    );

    return unsubscribeFromLogUpdates;
  }, []);

  const handleGenerateRequested = () => {
    sharedApplicationLogger.info("workbench", "Regenerating the magic circle.", {
      seedPhrase: magicCircleGenerationOptions.seedPhrase
    });

    const nextMagicCircleDiagram = generateMagicCircleDiagram(
      magicCircleGenerationOptions,
      sharedApplicationLogger
    );

    startTransition(() => {
      setMagicCircleDiagram(nextMagicCircleDiagram);
    });
  };

  const handleSurpriseRequested = () => {
    const surpriseMagicCircleGenerationOptions = {
      ...magicCircleGenerationOptions,
      seedPhrase: createSurpriseSeedPhrase()
    };

    setMagicCircleGenerationOptions(surpriseMagicCircleGenerationOptions);
    sharedApplicationLogger.info("workbench", "Creating a surprise magic circle.", {
      seedPhrase: surpriseMagicCircleGenerationOptions.seedPhrase
    });

    const surpriseMagicCircleDiagram = generateMagicCircleDiagram(
      surpriseMagicCircleGenerationOptions,
      sharedApplicationLogger
    );

    startTransition(() => {
      setMagicCircleDiagram(surpriseMagicCircleDiagram);
    });
  };

  return (
    <main className="application-shell">
      <section className="hero-banner">
        <div className="hero-copy">
          <p className="eyebrow-label">Tartsi</p>
          <h1>Wave-function-collapse magic circles in React</h1>
          <p className="hero-description">
            Build luminous ceremonial diagrams from a shape-based symbolic language. The
            generator balances geometry, symmetry, and compatibility across multiple concentric
            rings to create circles that feel both engineered and arcane.
          </p>
        </div>
        <div className="hero-stat-grid">
          <article className="hero-stat-card">
            <span className="hero-stat-value">{magicCircleDiagram.rings.length}</span>
            <span className="hero-stat-label">Rings</span>
          </article>
          <article className="hero-stat-card">
            <span className="hero-stat-value">{magicCircleDiagram.symmetrySectorCount}</span>
            <span className="hero-stat-label">Symmetry sectors</span>
          </article>
          <article className="hero-stat-card">
            <span className="hero-stat-value">{magicCircleDiagram.solverRestartCount}</span>
            <span className="hero-stat-label">Solver restarts</span>
          </article>
        </div>
      </section>

      <section className="application-grid">
        <div className="sidebar-stack">
          <GenerationControlPanel
            magicCircleGenerationOptions={magicCircleGenerationOptions}
            onMagicCircleGenerationOptionsChange={setMagicCircleGenerationOptions}
            onGenerateRequested={handleGenerateRequested}
            onSurpriseRequested={handleSurpriseRequested}
          />
          <DocumentationPanel />
        </div>

        <div className="content-stack">
          <MagicCircleCanvas
            magicCircleDiagram={magicCircleDiagram}
            applicationLogger={sharedApplicationLogger}
          />
          <LogConsolePanel
            applicationLogEntries={applicationLogEntries}
            applicationLogger={sharedApplicationLogger}
          />
        </div>
      </section>
    </main>
  );
}
