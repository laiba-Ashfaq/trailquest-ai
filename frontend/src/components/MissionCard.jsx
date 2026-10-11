import Sprout from "./Sprout.jsx";

export default function MissionCard({ mission, model, onGo, onBack }) {
  return (
    <>
      <section className="hero">
        <Sprout />
        <div>
          <p className="status" style={{ margin: 0 }}>
            Your mission
          </p>
          <h1 className="mission-title">{mission.title}</h1>
        </div>
      </section>
      <article className="card">
        <div className="meta">
          <span className="chip">{mission.estimated_duration}</span>
          <span className="chip">{mission.difficulty}</span>
          {model && <span className="chip">local · {model}</span>}
        </div>
        <ol className="steps">
          {mission.activities.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
        <div className="note">
          <strong>Notice this</strong>
          {mission.observation_challenge}
        </div>
        <div className="note">
          <strong>Optional photo</strong>
          {mission.photo_challenge}
        </div>
        <div className="note">
          <strong>Phone rule</strong>
          {mission.phone_rule}
        </div>
        <div className="note">
          <strong>Stay safe</strong>
          {mission.safety_reminder}
        </div>
      </article>
      <div className="actions">
        <button className="btn btn-primary" onClick={onGo}>
          I&apos;m going out
        </button>
        <button className="btn btn-ghost" onClick={onBack}>
          New mission
        </button>
      </div>
    </>
  );
}
