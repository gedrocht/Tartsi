import { MagicCircleWorkbench } from "./components/MagicCircleWorkbench";

/**
 * The root application component delegates immediately to the workbench component.
 * This extra layer may look simple, but it gives us a clean place to add providers later
 * if the project grows to include routing, theming, analytics, or remote persistence.
 */
export default function App() {
  return <MagicCircleWorkbench />;
}
