import { useState } from 'react'
import BackgroundMusic from './components/BackgroundMusic'
import MenuScreen from './screens/MenuScreen'
import MapScreen from './screens/MapScreen'
import BattleScreen from './screens/BattleScreen'
import { playAttack } from './utils/soundManager'

const initialTerritories = [
  {
    id: 'kingdom-aetherion',
    type: 'kingdom',
    mapLabel: 'Kingdom',
    name: 'Aetherion',
    owner: 'Crown of Aetherion',
    rulerTitle: 'King',
    ruler: 'Aldric Vorn',
    army: 5200,
    top: '47%',
    left: '45%',
  },
  {
    id: 'castle-frosthold',
    type: 'castle',
    mapLabel: 'Castle I',
    name: 'Frosthold Castle',
    rulerTitle: 'Lord',
    ruler: 'Vaelor',
    owner: 'House Frost',
    army: 3800,
    top: '17%',
    left: '28%',
  },
  {
    id: 'castle-elarion',
    type: 'castle',
    mapLabel: 'Castle II',
    name: 'Elarion Grove Castle',
    rulerTitle: 'Lady',
    ruler: 'Seraphine',
    owner: 'House Elarion',
    army: 4100,
    top: '19%',
    left: '68%',
  },
  {
    id: 'castle-drakmor',
    type: 'castle',
    mapLabel: 'Castle III',
    name: 'Drakmor Castle',
    rulerTitle: 'Warlord',
    ruler: 'Kael',
    owner: 'Clan Drakmor',
    army: 3600,
    top: '53%',
    left: '14%',
  },
  {
    id: 'castle-solkaris',
    type: 'castle',
    mapLabel: 'Castle IV',
    name: 'Solkaris Castle',
    rulerTitle: 'Lord',
    ruler: 'Zephar',
    owner: 'House Solkaris',
    army: 3950,
    top: '76%',
    left: '64%',
  },
]

function App() {
  // Controls which screen is currently shown to the player.
  const [currentScreen, setCurrentScreen] = useState('menu')
  // Single state source for kingdom + all castles.
  const [territories, setTerritories] = useState(initialTerritories)
  // Stores the currently selected attacker + defender battle setup.
  const [selectedBattle, setSelectedBattle] = useState(null)

  const handleAttack = ({ attackerId, defenderId }) => {
    const attacker = territories.find((territory) => territory.id === attackerId)
    const defender = territories.find((territory) => territory.id === defenderId)

    if (!attacker || !defender || attacker.id === defender.id) {
      return
    }

    // Save both sides into selectedBattle, then move to battle screen.
    playAttack()
    setSelectedBattle({
      attacker,
      defender,
    })

    setCurrentScreen('battle')
  }

  const handleBattleResolved = ({ winnerSide, attackerId, defenderId }) => {
    // Apply battle outcome directly in map state.
    setTerritories((previousTerritories) => {
      const attacker = previousTerritories.find((territory) => territory.id === attackerId)

      if (!attacker) {
        return previousTerritories
      }

      return previousTerritories.map((territory) => {
        if (winnerSide === 'attacker') {
          // Winner gains momentum and conquered land changes owner.
          if (territory.id === attackerId) {
            return { ...territory, army: territory.army + 250 }
          }

          if (territory.id === defenderId) {
            return {
              ...territory,
              owner: attacker.owner,
              army: Math.max(900, territory.army - 300),
            }
          }
        } else {
          // Failed attack weakens attacker; defender stabilizes.
          if (territory.id === attackerId) {
            return { ...territory, army: Math.max(900, territory.army - 350) }
          }

          if (territory.id === defenderId) {
            return { ...territory, army: territory.army + 120 }
          }
        }

        return territory
      })
    })
  }

  // Small screen switcher so beginners can clearly follow navigation flow.
  const renderCurrentScreen = () => {
    if (currentScreen === 'menu') {
      return <MenuScreen onStartGame={() => setCurrentScreen('map')} />
    }

    if (currentScreen === 'map') {
      return (
        <MapScreen
          territories={territories}
          onGoToMenu={() => setCurrentScreen('menu')}
          onAttack={handleAttack}
        />
      )
    }

    return (
      <BattleScreen
        battleData={selectedBattle}
        onBattleResolved={handleBattleResolved}
        onReturnToMap={() => setCurrentScreen('map')}
      />
    )
  }

  return (
    <div className="app-shell">
      {/* Menu music is active only when the menu screen is visible. */}
      <BackgroundMusic isActive={currentScreen === 'menu'} />
      {renderCurrentScreen()}
    </div>
  )
}

export default App
