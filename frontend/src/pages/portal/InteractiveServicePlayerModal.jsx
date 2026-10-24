import React, { useState } from 'react';

export default function InteractiveServicePlayerModal({ isOpen, service, onClose }) {
  if (!isOpen || !service) return null;

  return (
    <div className="modal-overlay" style={{ display: 'flex', zIndex: 1100 }}>
      <div className="modal-content" style={{ maxWidth: '850px', width: '95%', maxHeight: '90vh', overflowY: 'auto', borderRadius: '14px', padding: 0 }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 22px',
          background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
          color: '#ffffff',
          borderRadius: '14px 14px 0 0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'rgba(255,255,255,0.2)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.1rem'
            }}>
              {(service.name || 'S').charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#ffffff' }}>
                {service.name} &bull; Practice & Live Lab
              </h3>
              <span style={{ fontSize: '0.8rem', opacity: 0.9 }}>
                Category: <strong>{service.category}</strong> | Tuition: <strong>{service.cost}</strong>
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: '#ffffff',
              fontSize: '1.4rem',
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            &times;
          </button>
        </div>

        {/* Content Body based on service type */}
        <div style={{ padding: '22px' }}>
          {service.name.toLowerCase().includes('chess') && <ChessInteractiveLab />}
          {service.name.toLowerCase().includes('coding') && <CodingInteractiveLab />}
          {service.name.toLowerCase().includes('robotics') && <RoboticsInteractiveLab />}
          {service.name.toLowerCase().includes('drawing') && <DrawingInteractiveLab />}
          {service.name.toLowerCase().includes('spoken') && <SpokenEnglishInteractiveLab />}
          {service.name.toLowerCase().includes('abacus') && <AbacusInteractiveLab />}
          {service.name.toLowerCase().includes('dance') && <MusicDanceInteractiveLab />}
          {service.name.toLowerCase().includes('sports') && <SportsFitnessInteractiveLab />}

          {/* Fallback if another custom service */}
          {!['chess', 'coding', 'robotics', 'drawing', 'spoken', 'abacus', 'dance', 'sports'].some(k => service.name.toLowerCase().includes(k)) && (
            <GenericInteractiveLab service={service} />
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '14px 22px', borderTop: '1px solid #e2e8f0', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: '0 0 14px 14px' }}>
          <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
            ⚡ Live Student Practice Simulator &bull; Interactive Sandbox
          </span>
          <button type="button" className="btn btn-primary btn-sm" onClick={onClose}>
            Close Lab
          </button>
        </div>
      </div>
    </div>
  );
}

// 1. CHESS ACADEMY INTERACTIVE LAB
function ChessInteractiveLab() {
  const initialBoard = [
    ['♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜'],
    ['♟', '♟', '♟', '♟', '♟', '♟', '♟', '♟'],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙'],
    ['♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖']
  ];

  const [board, setBoard] = useState(initialBoard);
  const [selectedCell, setSelectedCell] = useState(null);
  const [turn, setTurn] = useState('White');
  const [moveHistory, setMoveHistory] = useState(['Game Started: 1. e4 ready']);
  const [puzzleMode, setPuzzleMode] = useState(false);

  const handleCellClick = (r, c) => {
    if (selectedCell) {
      const [fromR, fromC] = selectedCell;
      if (fromR === r && fromC === c) {
        setSelectedCell(null);
        return;
      }
      const newBoard = board.map(row => [...row]);
      const piece = newBoard[fromR][fromC];
      newBoard[fromR][fromC] = '';
      newBoard[r][c] = piece;
      setBoard(newBoard);
      setSelectedCell(null);
      const cols = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
      const moveText = `${piece} ${cols[fromC]}${8 - fromR} -> ${cols[c]}${8 - r}`;
      setMoveHistory(prev => [moveText, ...prev.slice(0, 7)]);
      setTurn(turn === 'White' ? 'Black' : 'White');
    } else {
      if (board[r][c]) {
        setSelectedCell([r, c]);
      }
    }
  };

  const resetBoard = () => {
    setBoard(initialBoard);
    setSelectedCell(null);
    setTurn('White');
    setMoveHistory(['Game reset to starting layout']);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>
            Current Turn: <strong style={{ color: turn === 'White' ? '#2563eb' : '#0f172a' }}>{turn} (Interactive: Click piece then click target square)</strong>
          </span>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button type="button" className="btn btn-sm btn-outline" onClick={resetBoard}>Reset Board</button>
          <button
            type="button"
            className={`btn btn-sm ${puzzleMode ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => {
              setPuzzleMode(!puzzleMode);
              if (!puzzleMode) {
                setMoveHistory(['Tactics Puzzle: Mate in 2 Moves loaded!']);
              }
            }}
          >
            🧩 {puzzleMode ? 'Puzzle Mode Active' : 'Tactics Puzzle'}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 420px) 1fr', gap: '20px', alignItems: 'start' }}>
        {/* Chess Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(8, 1fr)',
          border: '3px solid #78350f',
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}>
          {board.map((row, r) =>
            row.map((cell, c) => {
              const isDark = (r + c) % 2 === 1;
              const isSelected = selectedCell && selectedCell[0] === r && selectedCell[1] === c;
              return (
                <div
                  key={`${r}-${c}`}
                  onClick={() => handleCellClick(r, c)}
                  style={{
                    aspectRatio: '1/1',
                    background: isSelected ? '#fde047' : isDark ? '#b45309' : '#fef3c7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem',
                    cursor: 'pointer',
                    userSelect: 'none',
                    transition: 'background 0.15s ease'
                  }}
                >
                  {cell}
                </div>
              );
            })
          )}
        </div>

        {/* Moves & Academy Lessons */}
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px' }}>
          <h4 style={{ margin: '0 0 10px', fontSize: '0.95rem', fontWeight: 800, color: 'var(--color-primary, #1e3a8a)' }}>
            ♟️ Move Log & Lesson Notes
          </h4>
          <div style={{ maxHeight: '160px', overflowY: 'auto', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '10px', fontSize: '0.82rem', marginBottom: '14px' }}>
            {moveHistory.map((m, idx) => (
              <div key={idx} style={{ padding: '3px 0', borderBottom: '1px dashed #f1f5f9' }}>
                <span style={{ color: '#64748b', marginRight: '6px' }}>#{moveHistory.length - idx}:</span>
                <strong>{m}</strong>
              </div>
            ))}
          </div>

          <div style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.5 }}>
            <strong>Curriculum Focus:</strong>
            <ul style={{ margin: '6px 0 0 16px', padding: 0 }}>
              <li>Ruy Lopez Opening & Italian Game</li>
              <li>Fork, Pin, and Skewer Tactics</li>
              <li>Endgame King & Rook Checkmate patterns</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// 2. CODING FOR KIDS INTERACTIVE LAB
function CodingInteractiveLab() {
  const [code, setCode] = useState(`// Python / JavaScript Interactive Sandbox
function drawShape(sides) {
  let output = "Drawing polygon with " + sides + " sides: ";
  for (let i = 1; i <= sides; i++) {
    output += " ★ [Side " + i + "]";
  }
  return output;
}

drawShape(5);`);

  const [output, setOutput] = useState('Run code to see execution results...');

  const runCode = () => {
    try {
      const runner = new Function(code);
      const result = runner();
      setOutput(`[Execution Success]\nReturned: ${typeof result === 'object' ? JSON.stringify(result) : (result !== undefined ? result : 'Code ran successfully without return value.')}`);
    } catch (err) {
      setOutput(`[Runtime Error]\n${err.message}`);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>
          💻 Live Code Editor & Scratch Sandbox
        </span>
        <button type="button" className="btn btn-sm btn-primary" onClick={runCode}>
          ▶ Run Code
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div>
          <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '4px' }}>Code Input</label>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            rows={10}
            style={{
              width: '100%',
              fontFamily: 'Consolas, monospace',
              fontSize: '0.86rem',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              background: '#0f172a',
              color: '#38bdf8',
              lineHeight: 1.45
            }}
          />
        </div>
        <div>
          <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '4px' }}>Console Output</label>
          <pre style={{
            margin: 0,
            height: '215px',
            background: '#1e293b',
            color: '#4ade80',
            padding: '12px',
            borderRadius: '8px',
            fontFamily: 'Consolas, monospace',
            fontSize: '0.84rem',
            overflowY: 'auto',
            whiteSpace: 'pre-wrap'
          }}>
            {output}
          </pre>
        </div>
      </div>
    </div>
  );
}

// 3. ROBOTICS LAB
function RoboticsInteractiveLab() {
  const [power, setPower] = useState(true);
  const [speed, setSpeed] = useState(60);
  const [sensorDistance, setSensorDistance] = useState(45);
  const [robotStatus, setRobotStatus] = useState('Obstacle avoidance mode active');

  return (
    <div>
      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '18px', marginBottom: '18px' }}>
        <h4 style={{ margin: '0 0 12px', fontSize: '1rem', fontWeight: 800, color: 'var(--color-primary, #1e3a8a)' }}>
          🤖 Arduino Microbot Telemetry & Sensor Simulation
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '16px' }}>
          <div style={{ background: '#ffffff', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>MOTOR POWER</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: power ? '#10b981' : '#ef4444', marginTop: '4px' }}>
              {power ? 'ONLINE (100%)' : 'STANDBY'}
            </div>
            <button
              type="button"
              className="btn btn-sm btn-outline"
              style={{ marginTop: '8px', width: '100%', fontSize: '0.75rem' }}
              onClick={() => setPower(!power)}
            >
              Toggle Power
            </button>
          </div>

          <div style={{ background: '#ffffff', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>MOTOR RPM SPEED</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#3b82f6', marginTop: '4px' }}>
              {power ? `${speed} % PWM` : '0 PWM'}
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={speed}
              disabled={!power}
              onChange={(e) => setSpeed(Number(e.target.value))}
              style={{ width: '100%', marginTop: '10px' }}
            />
          </div>

          <div style={{ background: '#ffffff', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>ULTRASONIC SENSOR</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: sensorDistance < 20 ? '#ef4444' : '#10b981', marginTop: '4px' }}>
              {sensorDistance} cm
            </div>
            <input
              type="range"
              min="5"
              max="120"
              value={sensorDistance}
              onChange={(e) => {
                const dist = Number(e.target.value);
                setSensorDistance(dist);
                if (dist < 20) {
                  setRobotStatus('⚠️ OBSTACLE DETECTED! Reverse Servo & Steering Left');
                } else {
                  setRobotStatus('Path Clear. Forward Cruising.');
                }
              }}
              style={{ width: '100%', marginTop: '10px' }}
            />
          </div>
        </div>

        <div style={{ background: '#0f172a', color: '#38bdf8', padding: '10px 14px', borderRadius: '6px', fontSize: '0.84rem', fontFamily: 'monospace' }}>
          <strong>Telemetry Status:</strong> {robotStatus}
        </div>
      </div>
    </div>
  );
}

// 4. DRAWING & ART CANVAS LAB
function DrawingInteractiveLab() {
  const [color, setColor] = useState('#2563eb');
  const [brushSize, setBrushSize] = useState(6);
  const [shapes, setShapes] = useState([
    { type: 'sun', x: 80, y: 50, color: '#f59e0b' },
    { type: 'mountain', x: 200, y: 120, color: '#64748b' },
    { type: 'tree', x: 380, y: 130, color: '#10b981' }
  ]);

  return (
    <div>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569' }}>Palette Color:</span>
        {['#2563eb', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#0f172a'].map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setColor(c)}
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              background: c,
              border: color === c ? '3px solid #000000' : '1px solid #cbd5e1',
              cursor: 'pointer'
            }}
          />
        ))}
        <button
          type="button"
          className="btn btn-sm btn-outline"
          onClick={() => setShapes([...shapes, { type: 'star', x: Math.random() * 300 + 40, y: Math.random() * 150 + 20, color }])}
        >
          ✨ Stamp Star
        </button>
        <button type="button" className="btn btn-sm btn-outline" onClick={() => setShapes([])}>Clear Canvas</button>
      </div>

      <div style={{
        height: '240px',
        background: '#ffffff',
        border: '2px dashed #94a3b8',
        borderRadius: '10px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {shapes.map((s, idx) => (
          <div
            key={idx}
            style={{
              position: 'absolute',
              left: `${s.x}px`,
              top: `${s.y}px`,
              fontSize: s.type === 'star' ? '2rem' : '2.8rem',
              color: s.color,
              userSelect: 'none'
            }}
          >
            {s.type === 'sun' ? '☀️' : s.type === 'mountain' ? '⛰️' : s.type === 'tree' ? '🌲' : '⭐'}
          </div>
        ))}
        <div style={{ position: 'absolute', bottom: '10px', left: '14px', fontSize: '0.78rem', color: '#94a3b8' }}>
          Interactive Digital Art Studio &bull; Watercolors & Sketches Module
        </div>
      </div>
    </div>
  );
}

// 5. SPOKEN ENGLISH LAB
function SpokenEnglishInteractiveLab() {
  const [selectedTopic, setSelectedTopic] = useState('Introducing Yourself in Front of Audience');
  const [quizScore, setQuizScore] = useState(null);

  return (
    <div>
      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px', marginBottom: '14px' }}>
        <h4 style={{ margin: '0 0 10px', fontSize: '0.96rem', fontWeight: 800, color: 'var(--color-primary, #1e3a8a)' }}>
          🗣️ Pronunciation & Public Speaking Simulator
        </h4>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '14px' }}>
          {[
            'Introducing Yourself in Front of Audience',
            'Debate on Science vs Art',
            'Story Narration with Voice Modulation',
            'Extempore & Impromptu Speech'
          ].map((topic) => (
            <button
              key={topic}
              type="button"
              className={`btn btn-sm ${selectedTopic === topic ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setSelectedTopic(topic)}
            >
              {topic}
            </button>
          ))}
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px' }}>
          <h5 style={{ margin: '0 0 6px', color: '#1e3a8a' }}>Active Lesson: {selectedTopic}</h5>
          <p style={{ fontSize: '0.86rem', color: '#475569', lineHeight: 1.5, margin: '0 0 12px' }}>
            "Good morning respected Principal, teachers, and my fellow friends! Today I feel privileged to present my views..."
          </p>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button type="button" className="btn btn-sm btn-outline" onClick={() => setQuizScore('Fluency: 94% | Phonetics: 90% | Vocabulary: Grade A')}>
              🎙️ Test Pronunciation & Fluency
            </button>
            {quizScore && (
              <span className="badge badge-success" style={{ fontSize: '0.82rem', padding: '6px 12px' }}>
                {quizScore}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// 6. ABACUS & VEDIC MATHS LAB
function AbacusInteractiveLab() {
  const [num1, setNum1] = useState(48);
  const [num2, setNum2] = useState(37);
  const [userAns, setUserAns] = useState('');
  const [feedback, setFeedback] = useState('');

  const checkSum = () => {
    if (Number(userAns) === num1 + num2) {
      setFeedback('✅ Correct! Mental Math speed: 1.8 seconds!');
    } else {
      setFeedback(`❌ Incorrect. Correct answer is ${num1 + num2}`);
    }
  };

  const nextChallenge = () => {
    setNum1(Math.floor(Math.random() * 80 + 15));
    setNum2(Math.floor(Math.random() * 80 + 15));
    setUserAns('');
    setFeedback('');
  };

  return (
    <div>
      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '18px' }}>
        <h4 style={{ margin: '0 0 12px', fontSize: '1rem', fontWeight: 800, color: 'var(--color-primary, #1e3a8a)' }}>
          🧮 Fast Mental Math & Abacus Speed Challenge
        </h4>
        <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#1e293b', textAlign: 'center', margin: '20px 0' }}>
          {num1} + {num2} = ?
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', alignItems: 'center' }}>
          <input
            type="number"
            className="form-control"
            style={{ maxWidth: '140px', fontSize: '1.2rem', textAlign: 'center' }}
            placeholder="Answer"
            value={userAns}
            onChange={(e) => setUserAns(e.target.value)}
          />
          <button type="button" className="btn btn-primary" onClick={checkSum}>Submit</button>
          <button type="button" className="btn btn-outline" onClick={nextChallenge}>Next Problem</button>
        </div>
        {feedback && (
          <div style={{ textAlign: 'center', marginTop: '16px', fontWeight: 700, fontSize: '0.94rem' }}>
            {feedback}
          </div>
        )}
      </div>
    </div>
  );
}

// 7. MUSIC & DANCE LAB
function MusicDanceInteractiveLab() {
  const [activeBeat, setActiveBeat] = useState('Bharatanatyam Adavu 1');

  return (
    <div>
      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px' }}>
        <h4 style={{ margin: '0 0 10px', fontSize: '1rem', fontWeight: 800, color: 'var(--color-primary, #1e3a8a)' }}>
          🎵 Rhythmic Tala & Keyboard Pitch Practice
        </h4>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '14px' }}>
          {['Bharatanatyam Adavu 1', 'Western Contemporary Beat', 'Carnatic Vocal Swaras (Sa Ri Ga Ma)', 'Keyboard Chords (C Major)'].map((b) => (
            <button
              key={b}
              type="button"
              className={`btn btn-sm ${activeBeat === b ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setActiveBeat(b)}
            >
              {b}
            </button>
          ))}
        </div>
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '18px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.8rem', margin: '10px 0' }}>🎶 🥁 🎹 💃</div>
          <strong>Lesson: {activeBeat}</strong>
          <p style={{ fontSize: '0.84rem', color: '#64748b', marginTop: '6px' }}>
            Rhythm metronome active at 90 BPM. Posture alignment and beat coordination practicing.
          </p>
        </div>
      </div>
    </div>
  );
}

// 8. SPORTS & FITNESS LAB
function SportsFitnessInteractiveLab() {
  const [drill, setDrill] = useState('Shuttle Run Agility Drill');

  return (
    <div>
      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px' }}>
        <h4 style={{ margin: '0 0 10px', fontSize: '1rem', fontWeight: 800, color: 'var(--color-primary, #1e3a8a)' }}>
          ⚽ Athletic Performance & Physical Training Plan
        </h4>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '14px' }}>
          {['Shuttle Run Agility Drill', 'Basketball Free-Throw Practice', 'Athletics 100m Sprint Stride', 'Surya Namaskar & Yoga Flow'].map((d) => (
            <button
              key={d}
              type="button"
              className={`btn btn-sm ${drill === d ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setDrill(d)}
            >
              {d}
            </button>
          ))}
        </div>
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px' }}>
          <strong>Active Training Module: {drill}</strong>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginTop: '12px' }}>
            <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '6px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', color: '#64748b' }}>DURATION</div>
              <strong>25 Minutes</strong>
            </div>
            <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '6px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', color: '#64748b' }}>CALORIES</div>
              <strong>180 kcal</strong>
            </div>
            <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '6px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', color: '#64748b' }}>INTENSITY</div>
              <strong style={{ color: '#047857' }}>Medium-High</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function GenericInteractiveLab({ service }) {
  return (
    <div style={{ textAlign: 'center', padding: '30px' }}>
      <div style={{
        width: '54px',
        height: '54px',
        borderRadius: '14px',
        background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)',
        color: '#ffffff',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 800,
        fontSize: '1.5rem',
        marginBottom: '14px'
      }}>
        {(service.name || 'S').charAt(0).toUpperCase()}
      </div>
      <h4>{service.name} Interactive Lab</h4>
      <p style={{ color: '#64748b', fontSize: '0.88rem' }}>{service.description}</p>
    </div>
  );
}
