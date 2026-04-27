import { useEffect, useState } from 'react'
import battleBackground from '../../assets/images/battle.png'
import { playBattle, playClick, playDefeat, playVictory } from '../utils/soundManager'

function getRandomBonus() {
  // random(0-500), inclusive.
  return Math.floor(Math.random() * 501)
}

function BattleScreen({ battleData, onBattleResolved, onReturnToMap }) {
  const [battleResult, setBattleResult] = useState(null)

  // Clear old result when a new battle setup arrives.
  useEffect(() => {
    setBattleResult(null)
  }, [battleData?.attacker?.id, battleData?.defender?.id, battleData?.attacker?.army, battleData?.defender?.army])

  // Play battle ambience as soon as this screen becomes active with valid battle data.
  useEffect(() => {
    if (!battleData) {
      return
    }

    playBattle()
  }, [battleData])

  // Trigger emotional result sound once outcome is available.
  useEffect(() => {
    if (!battleResult) {
      return
    }

    if (battleResult.winnerSide === 'attacker') {
      playVictory()
      return
    }

    playDefeat()
  }, [battleResult])

  if (!battleData) {
    return (
      <section
        className="battle-screen cinematic-screen"
        style={{ backgroundImage: `url(${battleBackground})` }}
      >
        <div className="screen-overlay battle-overlay" />

        <div className="battle-card cinematic-card">
          <h2>No Battle Selected</h2>
          <p>Go to map, choose attacker and defender, then press Attack.</p>
          <button
            type="button"
            className="primary-button"
            onClick={() => {
              playClick()
              onReturnToMap()
            }}
          >
            Return to Map
          </button>
        </div>
      </section>
    )
  }

  const { attacker, defender } = battleData

  const startBattle = () => {
    if (battleResult) {
      return
    }

    const attackerPower = attacker.army + getRandomBonus()
    const defenderPower = defender.army + getRandomBonus()
    const attackerWins = attackerPower > defenderPower

    const nextResult = {
      attackerId: attacker.id,
      defenderId: defender.id,
      attackerPower,
      defenderPower,
      winnerSide: attackerWins ? 'attacker' : 'defender',
      winnerName: attackerWins ? attacker.name : defender.name,
      resultLabel: attackerWins ? 'Victory' : 'Defeat',
    }

    setBattleResult(nextResult)
    onBattleResolved(nextResult)
  }

  return (
    <section
      className="battle-screen cinematic-screen"
      style={{ backgroundImage: `url(${battleBackground})` }}
    >
      <div className="screen-overlay battle-overlay" />

      <div className="battle-card cinematic-card">
        <h2>
          {attacker.name} vs {defender.name}
        </h2>

        <div className="battle-info-grid">
          <p>
            <strong>Attacker:</strong> {attacker.name}
          </p>
          <p>
            <strong>Defender:</strong> {defender.name}
          </p>
          <p>
            <strong>Attacker Ruler:</strong> {attacker.rulerTitle} {attacker.ruler}
          </p>
          <p>
            <strong>Defender Ruler:</strong> {defender.rulerTitle} {defender.ruler}
          </p>
          <p>
            <strong>Attacker Owner:</strong> {attacker.owner}
          </p>
          <p>
            <strong>Defender Owner:</strong> {defender.owner}
          </p>
          <p>
            <strong>Attacker Army:</strong> {attacker.army.toLocaleString()}
          </p>
          <p>
            <strong>Defender Army:</strong> {defender.army.toLocaleString()}
          </p>
        </div>

        {!battleResult && (
          <button
            type="button"
            className="primary-button battle-start-button"
            onClick={() => {
              playClick()
              startBattle()
            }}
          >
            Start Battle
          </button>
        )}

        {battleResult && (
          <div className="battle-result-wrap">
            <h3
              className={[
                'battle-result-title',
                battleResult.winnerSide === 'attacker' ? 'battle-result-victory' : 'battle-result-defeat',
              ].join(' ')}
            >
              {battleResult.resultLabel}
            </h3>
            <p>
              <strong>Winning Side:</strong> {battleResult.winnerName}
            </p>
            <p>
              <strong>Attacker Power:</strong> {battleResult.attackerPower.toLocaleString()}
            </p>
            <p>
              <strong>Defender Power:</strong> {battleResult.defenderPower.toLocaleString()}
            </p>

            <button
              type="button"
              className="primary-button"
              onClick={() => {
                playClick()
                onReturnToMap()
              }}
            >
              Return to Map
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

export default BattleScreen
