import Sprout from "./Sprout.jsx";

const TIMES = ["30 min", "60 min", "2 hours"];
const ACTIVITIES = ["walking", "photography", "nature observation", "hiking"];
const ENERGIES = ["low", "medium", "high"];
const PLACES = ["park", "mountains", "garden", "neighborhood", "anywhere"];

function Pills({ options, value, onChange }) {
  return (
    <div className="pills">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          className={`pill ${value === option ? "active" : ""}`}
          onClick={() => onChange(option)}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

export default function Home({ prefs, setPrefs, onGenerate, onSurprise, loading, health, error }) {
  return (
    <>
      <section className="hero">
        <Sprout mood={loading ? "think" : "idle"} />
        <div>
          <h1>Turn a few minutes of screen time into a real outdoor mission.</h1>
          <p>Local open-weight AI writes the plan. Then you close the tab and go outside.</p>
        </div>
      </section>

      <section className="card section">
        <h2>Time</h2>
        <Pills options={TIMES} value={prefs.time} onChange={(time) => setPrefs({ ...prefs, time })} />
      </section>
      <section className="card section">
        <h2>Activity</h2>
        <Pills
          options={ACTIVITIES}
          value={prefs.activity}
          onChange={(activity) => setPrefs({ ...prefs, activity })}
        />
      </section>
      <section className="card section">
        <h2>Energy</h2>
        <Pills options={ENERGIES} value={prefs.energy} onChange={(energy) => setPrefs({ ...prefs, energy })} />
      </section>
      <section className="card section">
        <h2>Environment</h2>
        <Pills
          options={PLACES}
          value={prefs.environment}
          onChange={(environment) => setPrefs({ ...prefs, environment })}
        />
      </section>

      <div className="actions">
        <button className="btn btn-primary" onClick={onGenerate} disabled={loading}>
          {loading ? "Sprout is writing…" : "Generate my mission"}
        </button>
        <button className="btn btn-ghost" onClick={onSurprise} disabled={loading}>
          Surprise me
        </button>
      </div>
      {health && <p className="status">{health.message}</p>}
      {error && <p className="status error">{error}</p>}
    </>
  );
}
