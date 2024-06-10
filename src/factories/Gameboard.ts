import Ship from './Ship'

const SIZE = 10
const BOARD_SIZE = SIZE * SIZE

class Gameboard {
  board: Ship[]
  missedShots: boolean[]

  constructor() {
    this.board = []
    this.missedShots = []
    this.initialize()
  }

  initialize() {
    for (let i = 0; i < BOARD_SIZE; i++) {
      this.board[i] = null
      this.missedShots[i] = false
    }
  }

  placeShip(ship: Ship, row: number, column: number, isVertical: boolean) {
    const index = row * SIZE + column

    if (!this.isPlacementPossible(ship, row, column, isVertical)) return false

    if (isVertical) {
      for (let i = 0; i < ship.length; i++) {
        this.board[index + i * SIZE] = ship
      }
    } else {
      for (let i = 0; i < ship.length; i++) {
        this.board[index + i] = ship
      }
    }
    return true
  }

  placeShipsRandomly() {
    if (!this.isEmpty()) return

    const ships = []
    const carrier = new Ship(5)
    const battleship = new Ship(4)
    const destroyer = new Ship(3)
    const submarine = new Ship(3)
    const patrolBoat = new Ship(2)
    ships.push(carrier, battleship, destroyer, submarine, patrolBoat)

    let succesfulPlacements = 0

    while (succesfulPlacements < 5) {
      const index = Math.floor(Math.random() * BOARD_SIZE)
      const row = Math.floor(index / SIZE)
      const column = index % SIZE
      const isVertical = Math.floor(Math.random() * 2) === 1 ? true : false

      if (this.placeShip(ships[succesfulPlacements], row, column, isVertical))
        succesfulPlacements++
    }
  }

  isPlacementPossible(ship: Ship, row: number, column: number, isVertical: boolean) {
    const index = row * SIZE + column

    // case position is out of gameboard
    if (row < 0 || row >= SIZE || column < 0 || column >= SIZE) return false

    // case ship doesn't fit in gameboard
    if (isVertical && row + ship.length > SIZE) return false
    if (!isVertical && column + ship.length > SIZE) return false

    // case any of the fields is already taken
    if (isVertical) {
      for (let i = 0; i < ship.length; i++) {
        if (this.board[index + i * SIZE]) return false
      }
    } else {
      for (let i = 0; i < ship.length; i++) {
        if (this.board[index + i]) return false
      }
    }

    // case any of the neighbour fields are already taken
    const neighborOffsets = [-SIZE - 1, -SIZE, -SIZE + 1, -1, 1, SIZE - 1, SIZE, SIZE + 1]
    for (let i = 0; i < ship.length; i++) {
      for (const offset of neighborOffsets) {
        const neighborIndex = index + i * SIZE + offset
        if (
          neighborIndex >= 0 &&
          neighborIndex < BOARD_SIZE &&
          this.board[neighborIndex]
        ) {
          return false
        }
      }
    }
    return true
  }

  receiveAttack(row: number, column: number) {
    const index = row * SIZE + column

    if (row < 0 || row >= SIZE || column < 0 || column >= SIZE) return false

    if (this.board[index]) {
      let hitIndex = 0
      // is vertical
      if (column > 0 && this.board[index - 1]) {
        let i = 1
        while (column - i >= 0 && this.board[index - i]) {
          hitIndex++
          i++
        }
      }
      // is horizontal
      else if (row > 0 && this.board[index - SIZE]) {
        let i = 1
        while (row - i >= 0 && this.board[index - i * SIZE]) {
          hitIndex++
          i++
        }
      }
      this.board[index].hit(hitIndex)
      return true
    } else {
      this.missedShots[index] = true
      return false
    }
  }

  isGameOver() {
    let isBoardEmpty = true
    for (let i = 0; i < BOARD_SIZE; i++) {
      if (this.board[i]) {
        isBoardEmpty = false
        if (!this.board[i].isSunk()) {
          return false
        }
      }
    }
    return isBoardEmpty ? false : true
  }

  isEmpty() {
    for (let i = 0; i < BOARD_SIZE; i++) {
      if (this.board[i] !== null) return false
    }
    return true
  }

  getEmptyFieldsAmount() {
    let result = 0
    for (let i = 0; i < BOARD_SIZE; i++) {
      if (this.board[i] === null) result++
    }
    return result
  }
}

export default Gameboard
