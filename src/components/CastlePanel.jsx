import { playClick } from '../utils/soundManager'

function TerritorySummary({ title, territory }) {
  if (!territory) {
    return null
  }

  return (
    <div className="side-card">
      <h4>{title}</h4>
      <p>
        <strong>Territory:</strong> {territory.name}
      </p>
      <p>
        <strong>Owner:</strong> {territory.owner}
      </p>
      <p>
        <strong>Ruler:</strong> {territory.rulerTitle} {territory.ruler}
      </p>
      <p>
        <strong>Army:</strong> {territory.army.toLocaleString()}
      </p>
    </div>
  )
}

function CastlePanel({
  territories,
  attackerId,
  defenderId,
  onChangeAttacker,
  onChangeDefender,
  onAttack,
  canAttack,
}) {
  const attacker = territories.find((territory) => territory.id === attackerId) ?? null
  const defender = territories.find((territory) => territory.id === defenderId) ?? null

  return (
    <aside className="castle-panel">
      <h3>War Council</h3>

      <div className="panel-field">
        <label htmlFor="attacker-select">Attacker</label>
        <select
          id="attacker-select"
          className="panel-select"
          value={attackerId}
          onChange={(event) => onChangeAttacker(event.target.value)}
        >
          {territories.map((territory) => (
            <option key={territory.id} value={territory.id}>
              {territory.name}
            </option>
          ))}
        </select>
      </div>

      <div className="panel-field">
        <label htmlFor="defender-select">Defender</label>
        <select
          id="defender-select"
          className="panel-select"
          value={defenderId}
          onChange={(event) => onChangeDefender(event.target.value)}
        >
          {territories.map((territory) => (
            <option key={territory.id} value={territory.id} disabled={territory.id === attackerId}>
              {territory.name}
            </option>
          ))}
        </select>
      </div>

      <div className="duel-sides">
        <TerritorySummary title="Attacker" territory={attacker} />
        <TerritorySummary title="Defender" territory={defender} />
      </div>

      {/* Attack works for any selected pair: kingdom or castle. */}
      <button
        type="button"
        className="primary-button"
        onClick={() => {
          playClick()
          onAttack()
        }}
        disabled={!canAttack}
      >
        Attack
      </button>
    </aside>
  )
}

export default CastlePanel
