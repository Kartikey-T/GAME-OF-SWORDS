import clickSound from '../../assets/audio/click.mp3'
import attackSound from '../../assets/audio/attack.mp3'
import battleSound from '../../assets/audio/battle.mp3'
import victorySound from '../../assets/audio/victory.mp3'
import defeatSound from '../../assets/audio/defeat.mp3'

// Shared base audio elements keep loading centralized and predictable.
const sounds = {
  click: new Audio(clickSound),
  attack: new Audio(attackSound),
  battle: new Audio(battleSound),
  victory: new Audio(victorySound),
  defeat: new Audio(defeatSound),
}

const volumes = {
  click: 0.4,
  attack: 0.65,
  battle: 0.55,
  victory: 0.7,
  defeat: 0.6,
}

function playSound(name) {
  const base = sounds[name]

  if (!base) {
    return
  }

  // Clone for fast repeated triggers so sounds can overlap naturally.
  const instance = base.cloneNode(true)
  instance.volume = volumes[name] ?? 0.5
  instance.currentTime = 0
  instance.play().catch(() => {
    // Ignore browser autoplay rejections; user interaction usually unlocks audio.
  })
}

export function playClick() {
  playSound('click')
}

export function playAttack() {
  playSound('attack')
}

export function playBattle() {
  playSound('battle')
}

export function playVictory() {
  playSound('victory')
}

export function playDefeat() {
  playSound('defeat')
}
