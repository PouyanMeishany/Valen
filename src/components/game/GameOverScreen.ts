import * as PIXI from 'pixi.js'

export interface GameStats {
  score: number
  highScore: number
  heartsCollected: number
  timeAlive: number // in seconds
}

export class GameOverScreen {
  private container: PIXI.Container
  private stage: PIXI.Container
  private onRetry: () => void
  private retryButton?: PIXI.Graphics
  private retryText?: PIXI.Text

  constructor(stage: PIXI.Container, width: number, height: number, onRetry: () => void) {
    this.stage = stage
    this.onRetry = onRetry
    this.container = new PIXI.Container()
    this.container.visible = false
    this.container.eventMode = 'static' // Make container interactive
    
    // Semi-transparent dark overlay
    const overlay = new PIXI.Graphics()
    overlay.rect(0, 0, width, height)
    overlay.fill({ color: 0x000000, alpha: 0.7 })
    overlay.eventMode = 'none' // Don't block clicks - let them pass through to children
    this.container.addChild(overlay)

    stage.addChild(this.container)
    
    // Ensure stage is interactive
    if (stage.eventMode === 'auto' || stage.eventMode === 'passive') {
      stage.eventMode = 'static'
    }
  }

  /**
   * Show game over screen with stats
   */
  show(gameStats: GameStats): void {
    // Bring container to the top of the display list so it's clickable
    this.stage.setChildIndex(this.container, this.stage.children.length - 1)
    
    // Clear previous content (except overlay)
    while (this.container.children.length > 1) {
      this.container.removeChildAt(1)
    }

    const centerX = this.container.width / 2
    const centerY = this.container.height / 2

    // Main panel background (pixelated border style)
    const panel = new PIXI.Graphics()
    const panelWidth = 400
    const panelHeight = 320
    const panelX = centerX - panelWidth / 2
    const panelY = centerY - panelHeight / 2
    
    // Outer border (thick retro style)
    panel.rect(panelX - 4, panelY - 4, panelWidth + 8, panelHeight + 8)
    panel.fill(0x000000)
    
    // Inner panel
    panel.rect(panelX, panelY, panelWidth, panelHeight)
    panel.fill(0x1a1a2e)
    panel.eventMode = 'none' // Don't block button clicks
    
    this.container.addChild(panel)

    let yOffset = panelY + 30

    // "GAME OVER" title
    const titleText = new PIXI.Text({
      text: 'GAME OVER',
      style: {
        fontFamily: 'Courier New, monospace',
        fontSize: 40,
        fontWeight: 'bold',
        fill: 0xff4444,
        letterSpacing: 2
      }
    })
    titleText.anchor.set(0.5, 0)
    titleText.x = centerX
    titleText.y = yOffset
    titleText.eventMode = 'none' // Don't block button clicks
    this.container.addChild(titleText)

    yOffset += 70

    // Stats section
    const statStyle = {
      fontFamily: 'Courier New, monospace',
      fontSize: 20,
      fill: 0xffffff
    }

    const stats = [
      { label: 'SCORE', value: gameStats.score.toString() },
      { label: 'HIGH SCORE', value: gameStats.highScore.toString(), highlight: gameStats.score >= gameStats.highScore },
      { label: 'HEARTS', value: gameStats.heartsCollected.toString() },
      { label: 'TIME', value: `${gameStats.timeAlive}s` }
    ]

    stats.forEach((stat, index) => {
      // Label
      const labelText = new PIXI.Text({
        text: stat.label,
        style: { ...statStyle, fill: 0xaaaaaa }
      })
      labelText.x = centerX - 120
      labelText.y = yOffset + (index * 35)
      labelText.eventMode = 'none' // Don't block button clicks
      this.container.addChild(labelText)

      // Value
      const valueText = new PIXI.Text({
        text: stat.value,
        style: { 
          ...statStyle, 
          fill: stat.highlight ? 0xffdd00 : 0xffffff,
          fontWeight: stat.highlight ? 'bold' : 'normal'
        }
      })
      valueText.anchor.set(1, 0)
      valueText.x = centerX + 120
      valueText.y = yOffset + (index * 35)
      valueText.eventMode = 'none' // Don't block button clicks
      this.container.addChild(valueText)
    })

    yOffset += 170

    // Retry button
    this.createRetryButton(centerX, yOffset)

    this.container.visible = true
  }

  /**
   * Create pixelated retry button
   */
  private createRetryButton(x: number, y: number): void {
    const buttonWidth = 200
    const buttonHeight = 50

    // Button background
    this.retryButton = new PIXI.Graphics()
    this.retryButton.rect(x - buttonWidth / 2 - 3, y - 3, buttonWidth + 6, buttonHeight + 6)
    this.retryButton.fill(0x000000)
    this.retryButton.rect(x - buttonWidth / 2, y, buttonWidth, buttonHeight)
    this.retryButton.fill(0x44aa44)
    
    this.retryButton.eventMode = 'static'
    this.retryButton.cursor = 'pointer'
    
    console.log('[GameOverScreen] Button created with eventMode:', this.retryButton.eventMode)
    
    // Button text
    this.retryText = new PIXI.Text({
      text: 'RETRY',
      style: {
        fontFamily: 'Courier New, monospace',
        fontSize: 24,
        fontWeight: 'bold',
        fill: 0xffffff,
        letterSpacing: 3
      }
    })
    this.retryText.anchor.set(0.5, 0.5)
    this.retryText.x = x
    this.retryText.y = y + buttonHeight / 2
    this.retryText.eventMode = 'none' // Don't block button clicks

    // Hover effects
    this.retryButton.on('pointerover', () => {
      if (this.retryButton) {
        this.retryButton.clear()
        this.retryButton.rect(x - buttonWidth / 2 - 3, y - 3, buttonWidth + 6, buttonHeight + 6)
        this.retryButton.fill(0xffffff)
        this.retryButton.rect(x - buttonWidth / 2, y, buttonWidth, buttonHeight)
        this.retryButton.fill(0x55cc55)
      }
    })

    this.retryButton.on('pointerout', () => {
      if (this.retryButton) {
        this.retryButton.clear()
        this.retryButton.rect(x - buttonWidth / 2 - 3, y - 3, buttonWidth + 6, buttonHeight + 6)
        this.retryButton.fill(0x000000)
        this.retryButton.rect(x - buttonWidth / 2, y, buttonWidth, buttonHeight)
        this.retryButton.fill(0x44aa44)
      }
    })

    this.retryButton.on('pointerdown', () => {
      console.log('[GameOverScreen] Retry button clicked!')
      this.hide()
      this.onRetry()
    })
    
    // Also try click event as fallback
    this.retryButton.on('click', () => {
      console.log('[GameOverScreen] Retry button click event!')
      this.hide()
      this.onRetry()
    })

    this.container.addChild(this.retryButton)
    this.container.addChild(this.retryText)
  }

  /**
   * Hide game over screen
   */
  hide(): void {
    this.container.visible = false
  }

  /**
   * Check if game over screen is visible
   */
  get isVisible(): boolean {
    return this.container.visible
  }

  destroy(): void {
    this.container.destroy({ children: true })
  }
}
