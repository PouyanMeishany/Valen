import { memo } from 'react'

interface GameStats {
  score: number
  highScore: number
  heartsCollected: number
  timeAlive: number
}

interface GameOverOverlayProps {
  visible: boolean
  stats: GameStats
  onRetry: () => void
}

const GameOverOverlay = memo(function GameOverOverlay({ visible, stats, onRetry }: GameOverOverlayProps) {
  console.log('[GameOverOverlay] Render - visible:', visible)
  if (!visible) return null

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      pointerEvents: 'auto'
    }}>
      <div style={{
        backgroundColor: '#1a1a2e',
        border: '4px solid #000',
        padding: '30px 50px',
        borderRadius: '0',
        fontFamily: 'Courier New, monospace',
        minWidth: '400px',
        textAlign: 'center'
      }}>
        <h1 style={{
          color: '#ff4444',
          fontSize: '40px',
          fontWeight: 'bold',
          letterSpacing: '2px',
          margin: '0 0 30px 0'
        }}>
          GAME OVER
        </h1>

        <div style={{ marginBottom: '30px' }}>
          {[
            { label: 'SCORE', value: stats.score.toString(), highlight: false },
            { label: 'HIGH SCORE', value: stats.highScore.toString(), highlight: stats.score >= stats.highScore },
            { label: 'HEARTS', value: stats.heartsCollected.toString(), highlight: false },
            { label: 'TIME', value: `${stats.timeAlive}s`, highlight: false }
          ].map((stat, index) => (
            <div key={index} style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '15px',
              fontSize: '20px'
            }}>
              <span style={{ color: '#aaaaaa' }}>{stat.label}</span>
              <span style={{
                color: stat.highlight ? '#ffdd00' : '#ffffff',
                fontWeight: stat.highlight ? 'bold' : 'normal'
              }}>
                {stat.value}
              </span>
            </div>
          ))}
        </div>

        <button
          onClick={() => {
            console.log('[GameOverOverlay] Retry button clicked!')
            onRetry()
          }}
          style={{
            padding: '15px 60px',
            fontSize: '24px',
            fontWeight: 'bold',
            backgroundColor: '#44aa44',
            color: 'white',
            border: '3px solid #000',
            borderRadius: '0',
            cursor: 'pointer',
            fontFamily: 'Courier New, monospace',
            letterSpacing: '3px',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#55cc55'
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#44aa44'
          }}
        >
          RETRY
        </button>
      </div>
    </div>
  )
})

export default GameOverOverlay
