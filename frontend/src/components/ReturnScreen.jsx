import { useEffect, useState } from "react";
import Sprout from "./Sprout.jsx";
import "../return.css";

function formatElapsed(ms) {
  const mins = Math.max(1, Math.round(ms / 60000));
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m ? `${h} h ${m} min` : `${h} h`;
}

export default function ReturnScreen({ mission, startedAt, onFinish }) {
  const [done, setDone] = useState(() => mission.activities.map(() => false));
  const [note, setNote] = useState("");
  const [photo, setPhoto] = useState(null);
  const [finishedAt, setFinishedAt] = useState(null);

  useEffect(() => {
    return () => {
      if (photo) URL.revokeObjectURL(photo);
    };
  }, [photo]);

  function toggle(index) {
    setDone(done.map((value, i) => (i === index ? !value : value)));
  }

  function onPhoto(event) {
    const file = event.target.files && event.target.files[0];
    if (file) setPhoto(URL.createObjectURL(file));
  }

  const doneCount = done.filter(Boolean).length;
  const total = mission.activities.length;

  if (finishedAt) {
    return (
      <>
        <section className="card complete-card">
          <p className="status" style={{ margin: 0 }}>
            Mission complete
          </p>
          <h1 className="mission-title">{mission.title}</h1>
          <div className="meta">
            <span className="chip">
              out for {formatElapsed(finishedAt - startedAt)}
            </span>
            <span className="chip">
              {doneCount} of {total} tasks
            </span>
          </div>
          <ul className="done-list">
            {mission.activities.map((item, i) => (
              <li key={item} className={done[i] ? "is-done" : ""}>
                <span aria-hidden="true">{done[i] ? "✓" : "○"}</span> {item}
              </li>
            ))}
          </ul>
          {note.trim() && (
            <div className="note">
              <strong>What I noticed</strong>
              {note}
            </div>
          )}
          {photo && (
            <img
              className="photo-preview"
              src={photo}
              alt="Photo from my mission"
            />
          )}
          <p className="fineprint">
            Screenshot this card to keep it. Your note and photo stay on this
            device.
          </p>
        </section>
        <div className="actions">
          <button className="btn btn-primary" onClick={onFinish}>
            New mission
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <section className="hero">
        <Sprout />
        <div>
          <p className="status" style={{ margin: 0 }}>
            Welcome back
          </p>
          <h1 className="mission-title">
            How did &ldquo;{mission.title}&rdquo; go?
          </h1>
          <p>
            You&apos;ve been out for {formatElapsed(Date.now() - startedAt)}.
          </p>
        </div>
      </section>

      <article className="card">
        <h2 className="return-h">Tick what you did</h2>
        <ul className="check-list">
          {mission.activities.map((item, i) => (
            <li key={item}>
              <label className="check-row">
                <input
                  type="checkbox"
                  checked={done[i]}
                  onChange={() => toggle(i)}
                />
                <span>{item}</span>
              </label>
            </li>
          ))}
        </ul>

        <h2 className="return-h">What did you notice? (optional)</h2>
        <textarea
          className="textarea"
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={mission.observation_challenge}
        />

        <h2 className="return-h">Add a photo (optional)</h2>
        <p className="fineprint">{mission.photo_challenge}</p>
        <label className="btn btn-ghost file-btn">
          {photo ? "Change photo" : "Choose or take a photo"}
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={onPhoto}
            hidden
          />
        </label>
        {photo && (
          <img
            className="photo-preview"
            src={photo}
            alt="Preview of your photo"
          />
        )}
      </article>

      <div className="actions">
        <button
          className="btn btn-primary"
          onClick={() => setFinishedAt(Date.now())}>
          Finish mission
        </button>
        <button className="btn btn-ghost" onClick={onFinish}>
          Skip, new mission
        </button>
      </div>
    </>
  );
}
