import { useEffect, useMemo, useState } from 'react'
import CastlePanel from '../components/CastlePanel'
import mapImage from '../../assets/images/map.png'
import { playClick } from '../utils/soundManager'

function MapScreen({ territories, onGoToMenu, onAttack }) {
  const [attackerId, setAttackerId] = useState(territories[0]?.id ?? '')
  const [defenderId, setDefenderId] = useState(territories[1]?.id ?? territories[0]?.id ?? '')

  // Keep the selected ids valid if territory list changes.
  useEffect(() => {
    if (!territories.some((territory) => territory.id === attackerId)) {
      setAttackerId(territories[0]?.id ?? '')
    }

    if (!territories.some((territory) => territory.id === defenderId)) {
      setDefenderId(territories[1]?.id ?? territories[0]?.id ?? '')
    }
  }, [territories, attackerId, defenderId])

  // Prevent attacker and defender from being the same territory.
  useEffect(() => {
    if (attackerId !== defenderId) {
      return
    }

    const fallbackDefender = territories.find((territory) => territory.id !== attackerId)?.id

    if (fallbackDefender) {
      setDefenderId(fallbackDefender)
    }
  }, [attackerId, defenderId, territories])

  const attacker = useMemo(
    () => territories.find((territory) => territory.id === attackerId) ?? null,
    [territories, attackerId],
  )

  const defender = useMemo(
    () => territories.find((territory) => territory.id === defenderId) ?? null,
    [territories, defenderId],
  )

  const canAttack = Boolean(attacker && defender && attacker.id !== defender.id)

  const handleLocationClick = (location) => {
    // Map click quickly selects a defender target.
    console.log(`Selected target: ${location.name}`)
    setDefenderId(location.id)
  }

  return (
    <section className="map-screen">
      <header className="map-header">
        <h2>World Map</h2>
        <p>Choose attacker and defender, then launch the battle.</p>
      </header>

      <div className="map-layout">
        <div className="map-wrapper">
          <img src={mapImage} alt="World map of the Game of Swords realm" className="map-image" />

          {/* Markers represent all playable territories on the map. */}
          {territories.map((location) => (
            <div
              key={location.id}
              className={[
                'map-point',
                `map-point-${location.type}`,
                location.id === attackerId ? 'is-attacker' : '',
                location.id === defenderId ? 'is-defender' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              style={{ top: location.top, left: location.left }}
              onClick={() => handleLocationClick(location)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  handleLocationClick(location)
                }
              }}
              role="button"
              tabIndex={0}
              title={location.name}
            >
              <span className="map-pin-dot" />
              <span className="map-point-label">{location.mapLabel}</span>
            </div>
          ))}
        </div>

        <CastlePanel
          territories={territories}
          attackerId={attackerId}
          defenderId={defenderId}
          onChangeAttacker={setAttackerId}
          onChangeDefender={setDefenderId}
          onAttack={() => onAttack({ attackerId, defenderId })}
          canAttack={canAttack}
        />
      </div>

      <div className="map-actions">
        <button
          type="button"
          className="secondary-button"
          style={{ marginBottom: '14px' }}
          onClick={() => {
            window.location.href = '/index.html'
          }}
        >
          Enter Duel Arena ⚔️
        </button>

        <button
          type="button"
          className="secondary-button"
          onClick={() => {
            playClick()
            onGoToMenu()
          }}
        >
          Back to Menu
        </button>
      </div>
    </section>
  )
}

export default MapScreen
