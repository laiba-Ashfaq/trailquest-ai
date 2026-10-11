import { useEffect, useMemo, useState } from "react";
import ExitScreen from "./components/ExitScreen.jsx";
import Home from "./components/Home.jsx";
import MissionCard from "./components/MissionCard.jsx";
import ReturnScreen from "./components/ReturnScreen.jsx";
import { generateMission, getHealth } from "./api.js";

const TIMES = ["30 min", "60 min", "2 hours"];
const ACTIVITIES = ["walking", "photography", "nature observation", "hiking"];
const ENERGIES = ["low", "medium", "high"];
const PLACES = ["park", "mountains", "garden", "neighborhood", "anywhere"];

const SESSION_KEY = "tq-session";

function loadSession() {
  try {
    const s = JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
    if (s && s.status === "out" && s.mission && s.startedAt) return s;
  } catch {
    /* ignore */
  }
  return null;
}

function saveSession(session) {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    /* ignore */
  }
}

function clearSession() {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    /* ignore */
  }
}

function pick(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function ThemeToggle({ theme, onToggle }) {
  return (
    <button
      className="icon-btn"
      onClick={onToggle}
      aria-label="Toggle light and dark mode">
      {theme === "dark" ? "☀" : "🌙"}
    </button>
  );
}

export default function App() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("tq-theme") || "light",
  );
  const [saved] = useState(loadSession);
  const [screen, setScreen] = useState(saved ? "return" : "home");
  const [prefs, setPrefs] = useState({
    time: "60 min",
    activity: "walking",
    energy: "medium",
    environment: "park",
  });
  const [mission, setMission] = useState(saved ? saved.mission : null);
  const [model, setModel] = useState(saved ? saved.model || "" : "");
  const [startedAt, setStartedAt] = useState(saved ? saved.startedAt : null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [health, setHealth] = useState(null);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("tq-theme", theme);
  }, [theme]);

  useEffect(() => {
    getHealth()
      .then(setHealth)
      .catch(() =>
        setHealth({
          message: "Backend is offline. Start FastAPI on port 8000.",
        }),
      );
  }, []);

  const dots = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        id: i,
        left: `${(i * 17) % 100}%`,
        top: `${(i * 23) % 90}%`,
        color: ["var(--leaf)", "var(--sun)", "var(--clay)", "var(--dot)"][
          i % 4
        ],
        size: 6 + (i % 5),
      })),
    [],
  );

  async function run(nextPrefs, surprise = false) {
    setLoading(true);
    setError("");
    try {
      const data = await generateMission({ ...nextPrefs, surprise });
      setMission(data.mission);
      setModel(data.model);
      setScreen("mission");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function surprise() {
    const next = {
      time: pick(TIMES),
      activity: pick(ACTIVITIES),
      energy: pick(ENERGIES),
      environment: pick(PLACES),
    };
    setPrefs(next);
    run(next, true);
  }

  function goOut() {
    const now = Date.now();
    setStartedAt(now);
    saveSession({ mission, model, startedAt: now, status: "out" });
    setScreen("exit");
  }

  function finishTrip() {
    clearSession();
    setMission(null);
    setStartedAt(null);
    setScreen("home");
  }

  return (
    <>
      <div className="float-dots" aria-hidden="true">
        {dots.map((dot) => (
          <span
            key={dot.id}
            style={{
              left: dot.left,
              top: dot.top,
              background: dot.color,
              width: dot.size,
              height: dot.size,
            }}
          />
        ))}
      </div>
      <div className="shell">
        <header className="topbar">
          <div className="brand">
            <span aria-hidden="true">🌿</span>
            <div>
              TrailQuest AI
              <small>open AI that ends the conversation</small>
            </div>
          </div>
          <ThemeToggle
            theme={theme}
            onToggle={() => setTheme(theme === "dark" ? "light" : "dark")}
          />
        </header>

        {screen === "home" && (
          <Home
            prefs={prefs}
            setPrefs={setPrefs}
            onGenerate={() => run(prefs)}
            onSurprise={surprise}
            loading={loading}
            health={health}
            error={error}
          />
        )}
        {screen === "mission" && mission && (
          <MissionCard
            mission={mission}
            model={model}
            onGo={goOut}
            onBack={() => {
              setScreen("home");
              setMission(null);
            }}
          />
        )}
        {screen === "exit" && (
          <ExitScreen
            mission={mission}
            onClose={() => window.close()}
            onBack={() => setScreen("return")}
          />
        )}
        {screen === "return" && mission && (
          <ReturnScreen
            mission={mission}
            startedAt={startedAt}
            onFinish={finishTrip}
          />
        )}
      </div>
    </>
  );
}
