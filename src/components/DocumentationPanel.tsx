/**
 * The documentation shortcuts make the learning materials visible from inside the app.
 * This reinforces the idea that the project is not only an artifact to use, but also a
 * system to study and understand.
 */
export function DocumentationPanel() {
  return (
    <section className="magic-circle-card">
      <p className="eyebrow-label">Learn the system</p>
      <h2>Documentation paths</h2>
      <ul className="documentation-link-list">
        <li>
          <a href="./wiki/">Serveable documentation site</a>
        </li>
        <li>
          <a href="./api/index.html">API reference generated from source comments</a>
        </li>
      </ul>
      <p className="supporting-text">
        The tutorials explain the generator step by step, while the API docs explain how the
        code is organized and how each function is meant to be used. The DokuWiki layer can be
        started locally with <code>npm run docs:wiki:serve</code>.
      </p>
    </section>
  );
}
