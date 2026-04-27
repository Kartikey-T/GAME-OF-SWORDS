import { useEffect, useRef } from 'react'
import themeMusic from '../../assets/audio/theme.mp3'

const SEGMENT_START = 17
const SEGMENT_END = 97 // 1 minute 37 seconds

function BackgroundMusic({ isActive }) {
  // Keep one shared audio object for this component's full lifecycle.
  const audioRef = useRef(null)
  const segmentRef = useRef({ start: SEGMENT_START, end: SEGMENT_END })

  useEffect(() => {
    // Load theme track once and configure volume.
    const audio = new Audio(themeMusic)
    audio.volume = 0.3
    audioRef.current = audio

    // Ensure start/end stay valid even if the track is shorter than expected.
    const setValidSegmentRange = () => {
      const duration = Number.isFinite(audio.duration) ? audio.duration : SEGMENT_END
      const start = Math.min(SEGMENT_START, Math.max(0, duration - 0.25))
      const end = Math.max(start + 0.25, Math.min(SEGMENT_END, duration))
      segmentRef.current = { start, end }
    }

    // Loop only inside the requested segment (00:17 -> 01:37).
    const loopSegment = () => {
      const { start, end } = segmentRef.current

      if (audio.currentTime >= end) {
        audio.currentTime = start
      }
    }

    audio.addEventListener('loadedmetadata', setValidSegmentRange)
    audio.addEventListener('timeupdate', loopSegment)

    // Stop music when component unmounts to avoid leaks.
    return () => {
      audio.removeEventListener('loadedmetadata', setValidSegmentRange)
      audio.removeEventListener('timeupdate', loopSegment)
      audio.pause()
      audio.currentTime = 0
    }
  }, [])

  useEffect(() => {
    const audio = audioRef.current

    if (!audio) {
      return
    }

    if (isActive) {
      const { start, end } = segmentRef.current

      // Always begin playback from the requested segment start.
      if (audio.currentTime < start || audio.currentTime >= end) {
        audio.currentTime = start
      }

      // Autoplay can be blocked by browser policy until user interaction.
      audio.play().catch(() => {
        console.info('Autoplay is blocked until user interaction.')
      })
      return
    }

    // Pause and reset back to segment start when menu is no longer active.
    const { start } = segmentRef.current
    audio.pause()
    audio.currentTime = start
  }, [isActive])

  // This component has no UI; it only manages sound.
  return null
}

export default BackgroundMusic
