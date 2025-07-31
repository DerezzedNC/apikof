// Configuración para conectar con API REST
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"

export interface BattleRequest {
  attacker: string
  defender: string
  attackType: string
  gameId?: string
}

export interface BattleResponse {
  success: boolean
  damage: number
  message: string
  gameState?: "playing" | "finished"
  winner?: string
}

export interface GameState {
  gameId: string
  playerA: {
    id: string
    name: string
    health: number
    maxHealth: number
    attack: number
    defense: number
    position: number
  }
  playerB: {
    id: string
    name: string
    health: number
    maxHealth: number
    attack: number
    defense: number
    position: number
  }
  currentTurn: "playerA" | "playerB"
  gameState: "playing" | "finished"
  winner?: string
}

// Función para ejecutar turno via API
export async function executeTurn(battleData: BattleRequest): Promise<BattleResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/battle/execute-turn`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(battleData),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data: BattleResponse = await response.json()
    return data
  } catch (error) {
    console.error("Error executing turn:", error)
    throw error
  }
}

// Función para iniciar nueva batalla
export async function startNewBattle(): Promise<GameState> {
  try {
    const response = await fetch(`${API_BASE_URL}/battle/start`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data: GameState = await response.json()
    return data
  } catch (error) {
    console.error("Error starting battle:", error)
    throw error
  }
}

// Función para obtener estado del juego
export async function getGameState(gameId: string): Promise<GameState> {
  try {
    const response = await fetch(`${API_BASE_URL}/battle/${gameId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data: GameState = await response.json()
    return data
  } catch (error) {
    console.error("Error getting game state:", error)
    throw error
  }
}

// Función para mover jugador via API
export async function movePlayer(gameId: string, playerId: string, direction: "left" | "right"): Promise<GameState> {
  try {
    const response = await fetch(`${API_BASE_URL}/battle/${gameId}/move`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ playerId, direction }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data: GameState = await response.json()
    return data
  } catch (error) {
    console.error("Error moving player:", error)
    throw error
  }
}
