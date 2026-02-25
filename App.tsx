import React, { useEffect, useMemo, useState } from 'react';

type Character = {
  id: string;
  name: string;
  role: string;
  desire: string;
};

type SavedCreation = {
  id: string;
  savedAt: string;
  title: string;
  scene: string;
  words: number;
};

type StoredUser = {
  email: string;
  password: string;
  displayName: string;
};

type DraftState = {
  title: string;
  scene: string;
  goal: number;
  prompt: string;
  characters: Character[];
};

const STORAGE_KEYS = {
  users: 'creative-writing/users',
  session: 'creative-writing/session'
} as const;

const prompts = {
  openings: [
    'A lighthouse keeper receives letters addressed to storms.',
    'A forgotten train station appears on no map, yet everyone has passed through it once.',
    'A pastry chef can bake memories into bread.',
    'At sunrise, one street in town changes to a different century.',
    'A translator discovers a language that predicts tomorrow.'
  ],
  conflicts: [
    'Someone they love is at the center of the mystery.',
    'Every answer costs one treasured memory.',
    'A rival offers help, but only if the protagonist breaks their own rule.',
    'Time is running out, and the wrong choice will erase a promise.',
    'The truth helps one person and hurts another.'
  ],
  settings: [
    'a floating market above cloud level',
    'a rain-starved coastal city',
    'a monastery carved into red cliffs',
    'a glass-and-steel greenhouse district',
    'an underground archive lit by bioluminescent ink'
  ]
};

const DEFAULT_PROMPT = 'Press “Generate Prompt” for a new writing spark.';

const defaultDraft: DraftState = {
  title: 'Untitled Manuscript',
  scene: '',
  goal: 750,
  prompt: DEFAULT_PROMPT,
  characters: []
};

const normalizeEmail = (value: string) => value.trim().toLowerCase();
const draftKey = (email: string) => `creative-writing/draft/${normalizeEmail(email)}`;
const creationsKey = (email: string) => `creative-writing/creations/${normalizeEmail(email)}`;

const safeParse = <T,>(raw: string | null, fallback: T): T => {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

const readUsers = (): StoredUser[] => safeParse<StoredUser[]>(localStorage.getItem(STORAGE_KEYS.users), []);
const writeUsers = (users: StoredUser[]) => localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(users));
const readDraft = (email: string): DraftState => safeParse<DraftState>(localStorage.getItem(draftKey(email)), defaultDraft);
const writeDraft = (email: string, draft: DraftState) => localStorage.setItem(draftKey(email), JSON.stringify(draft));
const readCreations = (email: string): SavedCreation[] => safeParse<SavedCreation[]>(localStorage.getItem(creationsKey(email)), []);
const writeCreations = (email: string, creations: SavedCreation[]) => localStorage.setItem(creationsKey(email), JSON.stringify(creations));

const randomFrom = (values: string[]) => values[Math.floor(Math.random() * values.length)];

const App: React.FC = () => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [user, setUser] = useState<StoredUser | null>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [authError, setAuthError] = useState('');

  const [title, setTitle] = useState(defaultDraft.title);
  const [scene, setScene] = useState(defaultDraft.scene);
  const [goal, setGoal] = useState(defaultDraft.goal);
  const [prompt, setPrompt] = useState(defaultDraft.prompt);
  const [characters, setCharacters] = useState<Character[]>(defaultDraft.characters);

  const [characterName, setCharacterName] = useState('');
  const [characterRole, setCharacterRole] = useState('');
  const [characterDesire, setCharacterDesire] = useState('');

  const [creations, setCreations] = useState<SavedCreation[]>([]);
  const [flashMessage, setFlashMessage] = useState('');

  const words = useMemo(() => {
    const trimmed = scene.trim();
    return trimmed.length === 0 ? 0 : trimmed.split(/\s+/).length;
  }, [scene]);

  const progress = useMemo(() => {
    if (goal <= 0) return 0;
    return Math.min(100, Math.round((words / goal) * 100));
  }, [goal, words]);

  useEffect(() => {
    const sessionEmail = normalizeEmail(localStorage.getItem(STORAGE_KEYS.session) || '');
    if (!sessionEmail) return;

    const existing = readUsers().find((stored) => stored.email === sessionEmail);
    if (!existing) {
      localStorage.removeItem(STORAGE_KEYS.session);
      return;
    }

    setUser(existing);
    const savedDraft = readDraft(existing.email);
    setTitle(savedDraft.title);
    setScene(savedDraft.scene);
    setGoal(savedDraft.goal);
    setPrompt(savedDraft.prompt);
    setCharacters(savedDraft.characters || []);
    setCreations(readCreations(existing.email));
  }, []);

  useEffect(() => {
    if (!user) return;
    writeDraft(user.email, { title, scene, goal, prompt, characters });
  }, [user, title, scene, goal, prompt, characters]);

  useEffect(() => {
    if (!user) return;
    writeCreations(user.email, creations);
  }, [user, creations]);

  useEffect(() => {
    if (!flashMessage) return;
    const timer = window.setTimeout(() => setFlashMessage(''), 2400);
    return () => window.clearTimeout(timer);
  }, [flashMessage]);

  const generatePrompt = () => {
    setPrompt(`${randomFrom(prompts.openings)} Set it in ${randomFrom(prompts.settings)}. ${randomFrom(prompts.conflicts)}`);
  };

  const addCharacter = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const name = characterName.trim();
    const role = characterRole.trim();
    const desire = characterDesire.trim();

    if (!name || !role || !desire) {
      setFlashMessage('Fill in all character fields first.');
      return;
    }

    setCharacters((current) => [
      { id: crypto.randomUUID(), name, role, desire },
      ...current
    ]);

    setCharacterName('');
    setCharacterRole('');
    setCharacterDesire('');
    setFlashMessage('Character added.');
  };

  const saveCreation = () => {
    const cleanedTitle = title.trim() || 'Untitled Manuscript';
    const cleanedScene = scene.trim();

    if (!cleanedScene) {
      setFlashMessage('Write a scene before saving.');
      return;
    }

    const entry: SavedCreation = {
      id: crypto.randomUUID(),
      savedAt: new Date().toISOString(),
      title: cleanedTitle,
      scene: cleanedScene,
      words
    };

    setCreations((current) => [entry, ...current]);
    setFlashMessage('Saved to your creations library.');
  };

  const loadCreation = (entry: SavedCreation) => {
    setTitle(entry.title);
    setScene(entry.scene);
    setFlashMessage('Saved creation loaded into workspace.');
  };

  const deleteCreation = (id: string) => {
    setCreations((current) => current.filter((entry) => entry.id !== id));
    setFlashMessage('Saved creation deleted.');
  };

  const resetWorkspace = () => {
    setTitle(defaultDraft.title);
    setScene(defaultDraft.scene);
    setGoal(defaultDraft.goal);
    setPrompt(defaultDraft.prompt);
    setCharacters([]);
    setFlashMessage('Workspace reset.');
  };

  const signOut = () => {
    localStorage.removeItem(STORAGE_KEYS.session);
    setUser(null);
    setEmail('');
    setPassword('');
    setDisplayName('');
    setAuthError('');

    setTitle(defaultDraft.title);
    setScene(defaultDraft.scene);
    setGoal(defaultDraft.goal);
    setPrompt(defaultDraft.prompt);
    setCharacters([]);
    setCreations([]);
  };

  const submitAuth = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAuthError('');

    const cleanedEmail = normalizeEmail(email);
    const cleanedPassword = password.trim();
    const cleanedDisplayName = displayName.trim();

    if (!cleanedEmail || !cleanedPassword) {
      setAuthError('Please enter both email and password.');
      return;
    }

    const users = readUsers();

    if (mode === 'signup') {
      if (!cleanedDisplayName) {
        setAuthError('Display name is required.');
        return;
      }

      if (users.some((candidate) => candidate.email === cleanedEmail)) {
        setAuthError('That email is already registered.');
        return;
      }

      const createdUser: StoredUser = {
        email: cleanedEmail,
        password: cleanedPassword,
        displayName: cleanedDisplayName
      };

      writeUsers([...users, createdUser]);
      localStorage.setItem(STORAGE_KEYS.session, createdUser.email);
      setUser(createdUser);
      setCreations([]);
      resetWorkspace();
      return;
    }

    const existing = users.find(
      (candidate) => candidate.email === cleanedEmail && candidate.password === cleanedPassword
    );

    if (!existing) {
      setAuthError('Email or password is incorrect.');
      return;
    }

    localStorage.setItem(STORAGE_KEYS.session, existing.email);
    setUser(existing);

    const savedDraft = readDraft(existing.email);
    setTitle(savedDraft.title);
    setScene(savedDraft.scene);
    setGoal(savedDraft.goal);
    setPrompt(savedDraft.prompt);
    setCharacters(savedDraft.characters || []);
    setCreations(readCreations(existing.email));
  };

  if (!user) {
    return (
      <main className="page auth-page">
        <section className="panel">
          <p className="eyebrow">Lucid's Dreamscapes</p>
          <h1>{mode === 'signin' ? 'Welcome back' : 'Create your writer account'}</h1>
          <p className="muted">Everything is saved locally to this browser while you prototype.</p>

          <form className="stack" onSubmit={submitAuth}>
            {mode === 'signup' && (
              <label>
                Display name
                <input
                  value={displayName}
                  onChange={(event) => setDisplayName(event.target.value)}
                  placeholder="Avery"
                />
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

            {authError && <p className="error">{authError}</p>}

            <button type="submit">{mode === 'signin' ? 'Sign In' : 'Create Account'}</button>
          </form>

          <button
            type="button"
            className="button-secondary"
            onClick={() => setMode((current) => (current === 'signin' ? 'signup' : 'signin'))}
          >
            {mode === 'signin' ? 'Need an account? Sign up' : 'Already registered? Sign in'}
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="page">
      <header className="panel">
        <div className="header-row">
          <div>
            <p className="eyebrow">Lucid's Dreamscapes</p>
            <h1>Dream deeper. Write brighter.</h1>
            <p className="muted">A writing sanctuary for scenes, story sparks, and saved dream drafts.</p>
          </div>
          <div className="account-card">
            <span className="muted">Signed in as</span>
            <strong>{user.displayName}</strong>
            <small>{user.email}</small>
            <button type="button" onClick={signOut}>Sign out</button>
          </div>
        </div>
      </header>

      {flashMessage && <p className="flash">{flashMessage}</p>}

      <section className="content-grid">
        <article className="panel">
          <h2>Dream Manuscript Workspace</h2>

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
              onChange={(event) => setGoal(Math.max(100, Number(event.target.value) || 100))}
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

          <div className="meter" aria-label="word progress meter">
            <span style={{ width: `${progress}%` }} />
          </div>
          <p className="muted">{progress}% of your daily goal completed.</p>

          <div className="button-row">
            <button type="button" onClick={saveCreation}>Save Creation</button>
            <button type="button" className="button-secondary" onClick={resetWorkspace}>Reset Workspace</button>
          </div>
        </article>

        <article className="panel">
          <h2>Dream Prompt + Character Tools</h2>

          <p className="prompt">{prompt}</p>
          <button type="button" onClick={generatePrompt}>Generate Prompt</button>

          <h3>Character Forge</h3>
          <form className="stack" onSubmit={addCharacter}>
            <input
              value={characterName}
              onChange={(event) => setCharacterName(event.target.value)}
              placeholder="Character name"
            />
            <input
              value={characterRole}
              onChange={(event) => setCharacterRole(event.target.value)}
              placeholder="Role in story"
            />
            <input
              value={characterDesire}
              onChange={(event) => setCharacterDesire(event.target.value)}
              placeholder="Core desire"
            />
            <button type="submit">Add Character</button>
          </form>

          <ul className="list">
            {characters.length === 0 ? (
              <li className="list-empty">No characters yet. Add your protagonist to start.</li>
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

      <section className="panel">
        <h2>Dream Archive</h2>
        {creations.length === 0 ? (
          <p className="muted">No saved creations yet. Save your first scene from the workspace.</p>
        ) : (
          <ul className="list creations-list">
            {creations.map((entry) => (
              <li key={entry.id}>
                <div>
                  <strong>{entry.title}</strong>
                  <p className="muted">{new Date(entry.savedAt).toLocaleString()} · {entry.words} words</p>
                  <p className="excerpt">{entry.scene.slice(0, 220)}{entry.scene.length > 220 ? '…' : ''}</p>
                </div>
                <div className="button-row actions">
                  <button type="button" onClick={() => loadCreation(entry)}>Load</button>
                  <button type="button" className="danger" onClick={() => deleteCreation(entry.id)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
};

export default App;
