"\"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import "./combat.css"

interface Fighter {
  id: string
  name: string
  health: number
  maxHealth: number
  attack: number
  defense: number
  position: number
}

interface DamageNumber {
  id: string
  damage: number
  x: number
  y: number
}

interface CombatArenaProps {
  playerA: any
  playerB: any
  onBack: () => void
  mode?: "1v1" | "3v3"
  teamA?: any[]
  teamB?: any[]
}

export default function CombatArena({ 
  playerA: initialPlayerA, 
  playerB: initialPlayerB, 
  onBack, 
  mode = "1v1",
  teamA = [],
  teamB = []
}: CombatArenaProps) {
  // Estado de los luchadores
  const [playerA, setPlayerA] = useState<Fighter>({
    id: "playerA",
    name: initialPlayerA?.name || "RYU",
    health: initialPlayerA?.health || 100,
    maxHealth: initialPlayerA?.health || 100,
    attack: initialPlayerA?.attack || 25,
    defense: initialPlayerA?.defense || 10,
    position: 20, // porcentaje desde la izquierda
  })

  const [playerB, setPlayerB] = useState<Fighter>({
    id: "playerB",
    name: initialPlayerB?.name || "KEN",
    health: initialPlayerB?.health || 100,
    maxHealth: initialPlayerB?.health || 100,
    attack: initialPlayerB?.attack || 23,
    defense: initialPlayerB?.defense || 12,
    position: 70, // porcentaje desde la izquierda
  })

  // Estado del juego
  const [gameState, setGameState] = useState<"playing" | "finished">("playing")
  const [winner, setWinner] = useState<string | null>(null)
  const [currentTurn, setCurrentTurn] = useState<"playerA" | "playerB">("playerA")
  const [isExecutingTurn, setIsExecutingTurn] = useState(false)
  const [battleLog, setBattleLog] = useState<string[]>([])
  const [damageNumbers, setDamageNumbers] = useState<DamageNumber[]>([])
  const [movingPlayers, setMovingPlayers] = useState<Set<string>>(new Set())
  const [attackingPlayers, setAttackingPlayers] = useState<Set<string>>(new Set())
  
  // Estado para equipos 3vs3
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0)
  const [currentEnemyIndex, setCurrentEnemyIndex] = useState(0)
  const [playerTeam, setPlayerTeam] = useState(teamA)
  const [enemyTeam, setEnemyTeam] = useState(teamB)

  // Referencias para el manejo de teclas
  const keysPressed = useRef<Set<string>>(new Set())

  // Función para agregar entrada al log de batalla
  const addToBattleLog = useCallback((message: string, type: "system" | "damage" | "normal" = "normal") => {
    setBattleLog((prev) => [...prev.slice(-9), message])
  }, [])

  // Función para mostrar número de daño
  const showDamageNumber = useCallback(
    (damage: number, targetPlayer: "playerA" | "playerB") => {
      const target = targetPlayer === "playerA" ? playerA : playerB
      const x = targetPlayer === "playerA" ? target.position + 10 : target.position - 5
      const y = 40 + Math.random() * 20

      const damageId = `damage-${Date.now()}-${Math.random()}`
      setDamageNumbers((prev) => [
        ...prev,
        {
          id: damageId,
          damage,
          x,
          y,
        },
      ])

      // Remover el número después de la animación
      setTimeout(() => {
        setDamageNumbers((prev) => prev.filter((d) => d.id !== damageId))
      }, 1500)
    },
    [playerA, playerB],
  )

  // Función para calcular daño
  const calculateDamage = useCallback((attacker: Fighter, defender: Fighter): number => {
    const baseDamage = attacker.attack
    const defense = defender.defense
    const randomFactor = 0.8 + Math.random() * 0.4 // 80% - 120%
    const finalDamage = Math.max(1, Math.floor((baseDamage - defense * 0.3) * randomFactor))
    return finalDamage
  }, [])

  // Función principal para ejecutar turno
  const ejecutarTurno = useCallback(async () => {
    if (isExecutingTurn || gameState === "finished") return

    setIsExecutingTurn(true)

    const attacker = currentTurn === "playerA" ? playerA : playerB
    const defender = currentTurn === "playerA" ? playerB : playerA
    const attackerSetter = currentTurn === "playerA" ? setPlayerA : setPlayerB
    const defenderSetter = currentTurn === "playerA" ? setPlayerB : setPlayerA

    // Animación de ataque
    setAttackingPlayers((prev) => new Set([...prev, attacker.id]))
    addToBattleLog(`${attacker.name} prepara su ataque...`, "system")

    // Simular llamada a API (aquí puedes conectar con tu backend)
    try {
      // Simulación de llamada a API
      const apiResponse = await simulateAPICall({
        attacker: attacker.id,
        defender: defender.id,
        attackType: "basic",
      })

      // Procesar respuesta de la API
      const damage = apiResponse.damage || calculateDamage(attacker, defender)
      const newHealth = Math.max(0, defender.health - damage)

      setTimeout(() => {
        // Aplicar daño
        defenderSetter((prev) => ({ ...prev, health: newHealth }))
        showDamageNumber(damage, currentTurn === "playerA" ? "playerB" : "playerA")
        addToBattleLog(`${attacker.name} inflige ${damage} de daño a ${defender.name}!`, "damage")

        // Verificar si hay ganador
        if (newHealth <= 0) {
          if (mode === "3v3") {
            // En modo 3vs3, cambiar al siguiente personaje del equipo derrotado
            if (currentTurn === "playerA") {
              // El enemigo fue derrotado, cambiar al siguiente enemigo
              if (currentEnemyIndex < enemyTeam.length - 1) {
                setCurrentEnemyIndex(prev => prev + 1)
                const nextEnemy = enemyTeam[currentEnemyIndex + 1]
                setPlayerB({
                  id: "playerB",
                  name: nextEnemy.name,
                  health: nextEnemy.health,
                  maxHealth: nextEnemy.health,
                  attack: nextEnemy.attack,
                  defense: nextEnemy.defense,
                  position: 70,
                })
                addToBattleLog(`${defender.name} ha sido derrotado! ${nextEnemy.name} entra al combate!`, "system")
              } else {
                // No hay más enemigos, victoria del equipo A
                setGameState("finished")
                setWinner("Equipo A")
                addToBattleLog("¡Equipo A gana la batalla!", "system")
              }
            } else {
              // El jugador fue derrotado, cambiar al siguiente jugador
              if (currentPlayerIndex < playerTeam.length - 1) {
                setCurrentPlayerIndex(prev => prev + 1)
                const nextPlayer = playerTeam[currentPlayerIndex + 1]
                setPlayerA({
                  id: "playerA",
                  name: nextPlayer.name,
                  health: nextPlayer.health,
                  maxHealth: nextPlayer.health,
                  attack: nextPlayer.attack,
                  defense: nextPlayer.defense,
                  position: 20,
                })
                addToBattleLog(`${defender.name} ha sido derrotado! ${nextPlayer.name} entra al combate!`, "system")
              } else {
                // No hay más jugadores, victoria del equipo B
                setGameState("finished")
                setWinner("Equipo B")
                addToBattleLog("¡Equipo B gana la batalla!", "system")
              }
            }
          } else {
            // Modo 1vs1, fin de batalla
            setGameState("finished")
            setWinner(attacker.name)
            addToBattleLog(`¡${attacker.name} gana la batalla!`, "system")
          }
        } else {
          // Cambiar turno
          setCurrentTurn(currentTurn === "playerA" ? "playerB" : "playerA")
          addToBattleLog(`Turno de ${currentTurn === "playerA" ? playerB.name : playerA.name}`, "system")
        }

        // Remover animación de ataque
        setAttackingPlayers((prev) => {
          const newSet = new Set(prev)
          newSet.delete(attacker.id)
          return newSet
        })

        setIsExecutingTurn(false)
      }, 600)
    } catch (error) {
      console.error("Error en la llamada a la API:", error)
      addToBattleLog("Error en la conexión. Intenta de nuevo.", "system")
      setIsExecutingTurn(false)
      setAttackingPlayers((prev) => {
        const newSet = new Set(prev)
        newSet.delete(attacker.id)
        return newSet
      })
    }
  }, [isExecutingTurn, gameState, currentTurn, playerA, playerB, addToBattleLog, showDamageNumber, calculateDamage, mode, currentPlayerIndex, currentEnemyIndex, playerTeam, enemyTeam])

  // Simulación de llamada a API REST
  const simulateAPICall = async (battleData: any): Promise<any> => {
    // Aquí puedes reemplazar con tu llamada real a la API
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          damage: Math.floor(Math.random() * 30) + 15,
          message: "Ataque ejecutado correctamente",
        })
      }, 500)
    })
  }

  // Función para mover jugadores
  const movePlayer = useCallback(
    (playerId: string, direction: "left" | "right") => {
      if (isExecutingTurn || gameState === "finished") return

      const setter = playerId === "playerA" ? setPlayerA : setPlayerB
      const moveAmount = 5

      setter((prev) => {
        let newPosition = prev.position
        if (direction === "left") {
          newPosition = Math.max(5, prev.position - moveAmount)
        } else {
          newPosition = Math.min(85, prev.position + moveAmount)
        }
        return { ...prev, position: newPosition }
      })

      // Mostrar animación de movimiento
      setMovingPlayers((prev) => new Set([...prev, playerId]))
      setTimeout(() => {
        setMovingPlayers((prev) => {
          const newSet = new Set(prev)
          newSet.delete(playerId)
          return newSet
        })
      }, 300)
    },
    [isExecutingTurn, gameState],
  )

  // Manejo de eventos de teclado
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase()
      keysPressed.current.add(key)

      // Controles del Jugador A
      if (key === "a") {
        movePlayer("playerA", "left")
      } else if (key === "d") {
        movePlayer("playerA", "right")
      }

      // Controles del Jugador B
      if (key === "arrowleft") {
        movePlayer("playerB", "left")
      } else if (key === "arrowright") {
        movePlayer("playerB", "right")
      }

      // Ejecutar turno con barra espaciadora
      if (key === " ") {
        event.preventDefault()
        ejecutarTurno()
      }
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      keysPressed.current.delete(event.key.toLowerCase())
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [movePlayer, ejecutarTurno])

  // Función para reiniciar el juego
  const restartGame = () => {
    setPlayerA({
      id: "playerA",
      name: initialPlayerA?.name || "RYU",
      health: initialPlayerA?.health || 100,
      maxHealth: initialPlayerA?.health || 100,
      attack: initialPlayerA?.attack || 25,
      defense: initialPlayerA?.defense || 10,
      position: 20,
    })
    setPlayerB({
      id: "playerB",
      name: initialPlayerB?.name || "KEN",
      health: initialPlayerB?.health || 100,
      maxHealth: initialPlayerB?.health || 100,
      attack: initialPlayerB?.attack || 23,
      defense: initialPlayerB?.defense || 12,
      position: 70,
    })
    setGameState("playing")
    setWinner(null)
    setCurrentTurn("playerA")
    setIsExecutingTurn(false)
    setBattleLog(["¡Nueva batalla comenzada!"])
    setDamageNumbers([])
    setMovingPlayers(new Set())
    setAttackingPlayers(new Set())
  }

  // Función para obtener el color de la barra de vida
  const getHealthBarColor = (health: number, maxHealth: number): string => {
    const percentage = (health / maxHealth) * 100
    if (percentage > 60) return "high"
    if (percentage > 30) return "medium"
    return "low"
  }

  // Inicializar log de batalla
  useEffect(() => {
    addToBattleLog("¡Batalla iniciada! Presiona ESPACIO para atacar.", "system")
    addToBattleLog(`Turno de ${playerA.name}`, "system")
  }, [addToBattleLog, playerA.name])

  return (
    <div className="combat-arena">
      {/* Header con botón de volver y título */}
      <div className="absolute top-4 left-4 right-4 z-50 flex justify-between items-center">
        <button
          onClick={onBack}
          className="arcade-button px-4 py-2 text-sm arcade-font"
        >
          VOLVER
        </button>
        <div className="text-center">
          <h1 className="arcade-font text-lg text-[#FFD700] header-title">
            {mode === "3v3" ? "BATALLA 3VS3" : "BATALLA 1VS1"}
          </h1>
          <div className="text-xs text-white/80">
            Turno: {currentTurn === "playerA" ? playerA.name : playerB.name}
          </div>
        </div>
        <div className="w-20"></div> {/* Espaciador para centrar el título */}
      </div>

      {/* Fondo del escenario */}
      <div className="stage-background" />
      <div className="stage-floor" />

      {/* Partículas de combate */}
      <div className="combat-particles">
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="combat-particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Barras de vida */}
      <div className="health-bar-container player-a">
        <div className="player-name">{playerA.name}</div>
        <div className="health-bar">
          <div
            className={`health-fill ${getHealthBarColor(playerA.health, playerA.maxHealth)}`}
            style={{ width: `${(playerA.health / playerA.maxHealth) * 100}%` }}
          />
          <div className="health-text">
            {playerA.health}/{playerA.maxHealth}
          </div>
        </div>
      </div>

      <div className="health-bar-container player-b">
        <div className="player-name">{playerB.name}</div>
        <div className="health-bar">
          <div
            className={`health-fill ${getHealthBarColor(playerB.health, playerB.maxHealth)}`}
            style={{ width: `${(playerB.health / playerB.maxHealth) * 100}%` }}
          />
          <div className="health-text">
            {playerB.health}/{playerB.maxHealth}
          </div>
        </div>
      </div>

      {/* Luchadores */}
      <div
        className={`fighter player-a ${movingPlayers.has("playerA") ? "moving" : ""} ${
          attackingPlayers.has("playerA") ? "attacking" : ""
        }`}
        style={{ left: `${playerA.position}%` }}
      >
        <div className="fighter-sprite">
          <img 
            src={playerA.name === "RYU" ? "/assets/ryu.Gif" : 
                 playerA.name === "KEN" ? "/assets/ken.gif" :
                 playerA.name === "CHUN-LI" ? "/assets/chunli.gif" :
                 playerA.name === "BLANKA" ? "/assets/blanka.gif" :
                 playerA.name === "DHALSIM" ? "/assets/dhal.gif" :
                 playerA.name === "GUILE" ? "/assets/guile.gif" :
                 "/placeholder.svg"}
            alt={playerA.name}
            className="fighter-image"
          />
          <div className="fighter-stats">
            {playerA.name}
            <br />
            ATK: {playerA.attack}
            <br />
            DEF: {playerA.defense}
          </div>
        </div>
      </div>

      <div
        className={`fighter player-b ${movingPlayers.has("playerB") ? "moving" : ""} ${
          attackingPlayers.has("playerB") ? "attacking" : ""
        }`}
        style={{ left: `${playerB.position}%` }}
      >
        <div className="fighter-sprite player-b">
          <img 
            src={playerB.name === "RYU" ? "/assets/ryu.Gif" : 
                 playerB.name === "KEN" ? "/assets/ken.gif" :
                 playerB.name === "CHUN-LI" ? "/assets/chunli.gif" :
                 playerB.name === "BLANKA" ? "/assets/blanka.gif" :
                 playerB.name === "DHALSIM" ? "/assets/dhal.gif" :
                 playerB.name === "GUILE" ? "/assets/guile.gif" :
                 "/placeholder.svg"}
            alt={playerB.name}
            className="fighter-image"
          />
          <div className="fighter-stats">
            {playerB.name}
            <br />
            ATK: {playerB.attack}
            <br />
            DEF: {playerB.defense}
          </div>
        </div>
      </div>

      {/* Números de daño */}
      {damageNumbers.map((damage) => (
        <div
          key={damage.id}
          className="damage-number"
          style={{
            left: `${damage.x}%`,
            top: `${damage.y}%`,
          }}
        >
          -{damage.damage}
        </div>
      ))}

      {/* UI de combate simplificada */}
      <div className="combat-ui-simple">
        <button className="turn-button" onClick={ejecutarTurno} disabled={isExecutingTurn || gameState === "finished"}>
          {isExecutingTurn ? "EJECUTANDO..." : "¡ATACAR!"}
        </button>
      </div>

      {/* Overlay de ganador */}
      {gameState === "finished" && winner && (
        <div className="winner-overlay">
          <div className="winner-content">
            <div className="winner-title">¡GANADOR!</div>
            <div className="winner-subtitle">{winner}</div>
            <button className="restart-button" onClick={restartGame}>
              NUEVA BATALLA
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
