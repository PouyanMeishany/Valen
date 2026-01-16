// Character configuration types for modularity
export interface CharacterConfig {
  body: {
    width: number
    height: number
    color: number
    x: number
    y: number
  }
  arm: {
    shoulderOffset: { x: number; y: number }
    upperArmLength: number
    forearmLength: number
    handRadius: number
    colors: {
      upperArm: number
      forearm: number
      hand: number
    }
  }
  animation: {
    baseLength: number
    maxStretch: number
    easing: number
  }
}

export const defaultCharacterConfig: CharacterConfig = {
  body: {
    width: 80,
    height: 160,
    color: 0xffcc99,
    x: 400,
    y: 300,
  },
  arm: {
    shoulderOffset: { x: 40, y: -40 },
    upperArmLength: 90,
    forearmLength: 70,
    handRadius: 10,
    colors: {
      upperArm: 0xff9999,
      forearm: 0xff6666,
      hand: 0xffffff,
    },
  },
  animation: {
    baseLength: 160,
    maxStretch: 2.4,
    easing: 0.12,
  },
}
