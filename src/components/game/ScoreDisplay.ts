import * as PIXI from 'pixi.js'

export class ScoreDisplay {
  private scoreText: PIXI.Text
  private highScoreText: PIXI.Text
  private score: number = 0
  private highScore: number = 0
  private maxScore: number

  constructor(maxScore: number, stage: PIXI.Container, x: number = 20, y: number = 20, screenWidth: number = 800) {
    this.maxScore = maxScore
    
    // Current score (left side)
    this.scoreText = new PIXI.Text({
      text: this.formatScoreText(),
      style: {
        fontSize: 24,
        fill: 0xffd700,
        fontWeight: 'bold'
      }
    })
    this.scoreText.x = x
    this.scoreText.y = y
    stage.addChild(this.scoreText)

    // High score (right side)
    this.highScoreText = new PIXI.Text({
      text: this.formatHighScoreText(),
      style: {
        fontSize: 20,
        fill: 0xff8800,
        fontWeight: 'bold'
      }
    })
    this.highScoreText.anchor.set(1, 0)
    this.highScoreText.x = screenWidth - 20
    this.highScoreText.y = y
    stage.addChild(this.highScoreText)
  }

  private formatScoreText(): string {
    return `Coins: ${this.score}/${this.maxScore}`
  }

  private formatHighScoreText(): string {
    return `HIGH: ${this.highScore}`
  }

  /**
   * Increment the score by 1
   */
  increment(): void {
    this.score++
    this.scoreText.text = this.formatScoreText()
    
    // Update high score if current score exceeds it
    if (this.score > this.highScore) {
      this.highScore = this.score
      this.highScoreText.text = this.formatHighScoreText()
    }
  }

  /**
   * Get the current score
   */
  getScore(): number {
    return this.score
  }

  /**
   * Get the high score
   */
  getHighScore(): number {
    return this.highScore
  }

  /**
   * Reset current score (keeps high score)
   */
  reset(): void {
    this.score = 0
    this.scoreText.text = this.formatScoreText()
  }

  /**
   * Check if all coins have been collected
   */
  isComplete(): boolean {
    return this.score >= this.maxScore
  }

  destroy(): void {
    this.scoreText.destroy()
    this.highScoreText.destroy()
  }
}
