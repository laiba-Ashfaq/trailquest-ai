import { useState } from "react";
import Sprout from "./Sprout.jsx";

export default function ExitScreen({ mission, onClose, onBack }) {
  const [tried, setTried] = useState(false);

  function handleClose() {
    onClose();
    setTried(true);
  }

  return (
    <section className="exit">
      <Sprout />
      <p className="status">You&apos;re ready.</p>
      <h1>The rest of this experience doesn&apos;t need a screen.</h1>
      <p>
        {mission?.closing_nudge ||
          "Close this tab. Go outside. Come back when you're done."}
      </p>
      <p className="fineprint">
        Your mission is saved on this device. It will be waiting when you come
        back.
      </p>
      <div className="actions" style={{ maxWidth: 360, margin: "24px auto 0" }}>
        <button className="btn btn-primary" onClick={handleClose}>
          Close this tab
        </button>
        <button className="btn btn-ghost" onClick={onBack}>
          I&apos;m back, check in
        </button>
      </div>
      {tried && (
        <p className="status">
          If this tab is still open, close it yourself. Come back here when
          you&apos;re done.
        </p>
      )}
    </section>
  );
}
