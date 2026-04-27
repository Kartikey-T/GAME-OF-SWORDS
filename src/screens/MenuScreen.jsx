import kingdomBackground from '../../assets/images/Kingdom.png'
import { playClick } from '../utils/soundManager'

function MenuScreen({ onStartGame }) {
  return (
    <section
      className="menu-screen"
      style={{ backgroundImage: `url(${kingdomBackground})` }}
    >
      {/* Dark overlay improves title/button readability over the image. */}
      <div className="screen-overlay" />

      <div className="menu-content">
        <h1 className="game-title">Game of Swords</h1>

        <button
          type="button"
          className="primary-button"
          onClick={() => {
            playClick()
            onStartGame()
          }}
        >
          Start Game
        </button>
      </div>
    </section>
  )
}

export default MenuScreen
