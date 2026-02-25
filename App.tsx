import React, { useEffect, useMemo, useState } from 'react';

type Character = {
  id: number;
  name: string;
  role: string;
  desire: string;
};

type StoredUser = {
  email: string;
  password: string;
  displayName: string;
};

type WritingState = {
  title: string;
  scene: string;
  goal: number;
  prompt: string;
  characters: Character[];
};

const openingIdeas = [
  'A librarian discovers a handwritten map hidden inside a returned book.',
  'On the day rain disappears forever, a city starts to remember forgotten promises.',
  'A ghostwriter begins hearing the voice of the author they are impersonating.',
  'Every midnight, one apartment in the building resets to a different decade.',
  'A chef can taste emotions in every dish and uncovers a crime through flavor.'
];

const conflictIdeas = [
  'The protagonist must choose between telling the truth and protecting someone they love.',
  'A secret society offers power in exchange for one precious memory each month.',
  'Two rivals are forced to collaborate before a deadline that cannot be moved.',
  'A missing person returns with a warning no one believes.',
  'A magical ability works perfectly, except when it is needed most.'
];

const settingIdeas = [
  'solar-punk floating market',
  'wind-beaten coastal monastery',
  'underground city archive',
  'forest train line at twilight',
  'quiet suburb with one impossible house'
];

const DEFAULT_PROMPT = 'Click “New Prompt” to spark your next scene.';
const USERS_KEY = 'creative-writing-users';
const SESSION_KEY = 'creative-writing-session';

const defaultWritingState: WritingState = {
  title: 'Untitled Manuscript',
  scene: '',
  goal: 750,
  prompt: DEFAULT_PROMPT,
  characters: []
};

const getDraftKey = (email: string) => `creative-writing-draft:${email}`;

const App: React.FC = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [authError, setAuthError] = useState('');

  const [user, setUser] = useState<StoredUser | null>(null);

  const [title, setTitle] = useState(defaultWritingState.title);
  const [scene, setScene] = useState(defaultWritingState.scene);
  const [goal, setGoal] = useState(defaultWritingState.goal);
  const [prompt, setPrompt] = useState(defaultWritingState.prompt);
  const [characters, setCharacters] = useState<Character[]>(defaultWritingState.characters);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [desire, setDesire] = useState('');

  useEffect(() => {
    const sessionEmail = localStorage.getItem(SESSION_KEY);
    const users: StoredUser[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const activeUser = users.find((stored) => stored.email === sessionEmail);
    if (!activeUser) return;

    setUser(activeUser);

    const draftRaw = localStorage.getItem(getDraftKey(activeUser.email));
    if (!draftRaw) return;

    const draft = JSON.parse(draftRaw) as WritingState;
    setTitle(draft.title);
    setScene(draft.scene);
    setGoal(draft.goal);
    setPrompt(draft.prompt);
    setCharacters(draft.characters || []);
  }, []);

  useEffect(() => {
    if (!user) return;
    const payload: WritingState = { title, scene, goal, prompt, characters };
    localStorage.setItem(getDraftKey(user.email), JSON.stringify(payload));
  }, [user, title, scene, goal, prompt, characters]);

  const words = useMemo(() => {
    const trimmed = scene.trim();
    return trimmed ? trimmed.split(/\s+/).length : 0;
  }, [scene]);

  const progress = Math.min(100, Math.round((words / goal) * 100));

  const generatePrompt = () => {
    const opener = openingIdeas[Math.floor(Math.random() * openingIdeas.length)];
    const conflict = conflictIdeas[Math.floor(Math.random() * conflictIdeas.length)];
    const setting = settingIdeas[Math.floor(Math.random() * settingIdeas.length)];

    setPrompt(`${opener} Set it in a ${setting}. ${conflict}`);
  };

  const addCharacter = (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !role.trim() || !desire.trim()) return;

    setCharacters((previous) => [
      ...previous,
      {
        id: Date.now(),
        name: name.trim(),
        role: role.trim(),
        desire: desire.trim()
      }
    ]);

    setName('');
    setRole('');
    setDesire('');
  };

  const handleAuth = (event: React.FormEvent) => {
    event.preventDefault();
    setAuthError('');

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !password.trim()) {
      setAuthError('Please enter an email and password.');
      return;
    }

    const users: StoredUser[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');

    if (isRegister) {
      if (!displayName.trim()) {
        setAuthError('Please enter a display name.');
        return;
      }
      if (users.some((existing) => existing.email === normalizedEmail)) {
        setAuthError('An account with this email already exists.');
        return;
      }

      const newUser: StoredUser = {
        email: normalizedEmail,
        password: password.trim(),
        displayName: displayName.trim()
      };

      localStorage.setItem(USERS_KEY, JSON.stringify([...users, newUser]));
      localStorage.setItem(SESSION_KEY, newUser.email);
      setUser(newUser);
      return;
    }

    const existing = users.find((stored) => stored.email === normalizedEmail && stored.password === password.trim());
    if (!existing) {
      setAuthError('Incorrect email or password.');
      return;
    }

    localStorage.setItem(SESSION_KEY, existing.email);
    setUser(existing);

    const draftRaw = localStorage.getItem(getDraftKey(existing.email));
    if (!draftRaw) {
      setTitle(defaultWritingState.title);
      setScene(defaultWritingState.scene);
      setGoal(defaultWritingState.goal);
      setPrompt(defaultWritingState.prompt);
      setCharacters(defaultWritingState.characters);
      return;
    }

    const draft = JSON.parse(draftRaw) as WritingState;
    setTitle(draft.title);
    setScene(draft.scene);
    setGoal(draft.goal);
    setPrompt(draft.prompt);
    setCharacters(draft.characters || []);
  };

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
    setEmail('');
    setPassword('');
    setDisplayName('');
    setTitle(defaultWritingState.title);
    setScene(defaultWritingState.scene);
    setGoal(defaultWritingState.goal);
    setPrompt(defaultWritingState.prompt);
    setCharacters(defaultWritingState.characters);
  };

  if (!user) {
    return (
      <main className="page auth-page">
        <section className="card auth-card">
          <p className="eyebrow">Creative Writing Studio</p>
          <h1>{isRegister ? 'Create your account' : 'Welcome back, writer'}</h1>
          <p className="muted">Sign in to save your drafts and character notes by user profile.</p>

          <form className="stack" onSubmit={handleAuth}>
            {isRegister && (
              <label>
                Display name
                <input value={displayName} onChange={(event) => setDisplayName(event.target.value)} placeholder="Avery" />
              </label>
            )}
            <label>
              Email
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="writer@example.com"
              />
            </label>
            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
              />
            </label>
            {authError && <p className="auth-error">{authError}</p>}
            <button type="submit">{isRegister ? 'Create Account' : 'Sign In'}</button>
          </form>

          <button type="button" className="link" onClick={() => setIsRegister((previous) => !previous)}>
            {isRegister ? 'Already have an account? Sign in' : 'New here? Create an account'}
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="page">
      <header className="hero card">
        <div className="topbar">
          <div>
            <p className="eyebrow">Creative Writing Studio</p>
            <h1>Write stories that feel alive.</h1>
            <p>A fresh, focused space for drafting scenes, tracking progress, and shaping character arcs.</p>
          </div>
          <div className="account-box">
            <p className="muted">Signed in as</p>
            <strong>{user.displayName}</strong>
            <span>{user.email}</span>
            <button type="button" onClick={logout}>Log out</button>
          </div>
        </div>
      </header>

      <section className="grid">
        <article className="card">
          <h2>Manuscript Workspace</h2>
          <label>
            Project title
            <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="My Next Novel" />
          </label>
          <label>
            Daily word goal
            <input
              type="number"
              min={100}
              step={50}
              value={goal}
              onChange={(event) => setGoal(Number(event.target.value) || 100)}
            />
          </label>
          <label>
            Current scene ({words} words)
            <textarea
              value={scene}
              onChange={(event) => setScene(event.target.value)}
              placeholder="Open with a sentence that makes the reader lean in..."
            />
          </label>
          <div className="meter" aria-label="word-goal-progress">
            <span style={{ width: `${progress}%` }} />
          </div>
          <p className="muted">
            <strong>{title}</strong> — {progress}% of today&apos;s goal complete.
          </p>
        </article>

        <article className="card">
          <h2>Prompt Generator</h2>
          <p className="prompt">{prompt}</p>
          <button type="button" onClick={generatePrompt}>New Prompt</button>

          <h3>Character Forge</h3>
          <form onSubmit={addCharacter} className="stack">
            <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Character name" />
            <input value={role} onChange={(event) => setRole(event.target.value)} placeholder="Role in story" />
            <input value={desire} onChange={(event) => setDesire(event.target.value)} placeholder="Core desire" />
            <button type="submit">Add Character</button>
          </form>

          <ul className="characters">
            {characters.length === 0 ? (
              <li className="muted">No characters yet. Start with your protagonist.</li>
            ) : (
              characters.map((character) => (
                <li key={character.id}>
                  <strong>{character.name}</strong>
                  <span>{character.role}</span>
                  <p>Wants: {character.desire}</p>
                </li>
              ))
            )}
          </ul>
        </article>
      </section>
    </main>
  );
};

export default App;
