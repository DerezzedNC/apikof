"use client"

import type React from "react"

import { useState } from "react"

interface LoginPageProps {
  mode: "login" | "register"
  onLogin: (userData: any) => void
  onBack: () => void
}

export default function LoginPage({ mode, onLogin, onBack }: LoginPageProps) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState<any>({})
  const [isLoading, setIsLoading] = useState(false)

  const validateForm = () => {
    const newErrors: any = {}

    if (!formData.username.trim()) {
      newErrors.username = "El nombre de usuario es requerido"
    }

    if (mode === "register" && !formData.email.trim()) {
      newErrors.email = "El email es requerido"
    }

    if (!formData.password) {
      newErrors.password = "La contraseña es requerida"
    } else if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres"
    }

    if (mode === "register" && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    // Simular llamada a API
    setTimeout(() => {
      onLogin({
        username: formData.username,
        email: formData.email,
        level: Math.floor(Math.random() * 50) + 1,
        wins: Math.floor(Math.random() * 100),
        losses: Math.floor(Math.random() * 50),
      })
      setIsLoading(false)
    }, 1500)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev: any) => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={onBack}
            className="absolute top-6 left-6 text-[#FFD700] hover:text-white transition-colors arcade-font text-sm"
          >
            ← VOLVER
          </button>
          <h1 className="arcade-font text-3xl md:text-4xl text-glow-red text-[#FF0000] mb-2">
            {mode === "login" ? "INICIAR SESIÓN" : "REGISTRO"}
          </h1>
          <p className="text-white/70 text-sm">
            {mode === "login" ? "Accede a tu cuenta de luchador" : "Crea tu cuenta de luchador"}
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="character-card p-6 rounded-lg">
            {/* Username */}
            <div className="mb-4">
              <label className="block text-[#FFD700] text-sm font-bold mb-2 arcade-font">USUARIO</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => handleInputChange("username", e.target.value)}
                className={`w-full px-4 py-3 bg-black/50 border-2 rounded-lg text-white focus:outline-none transition-all ${
                  errors.username ? "border-red-500" : "border-[#FFD700]/50 focus:border-[#FF0000]"
                }`}
                placeholder="Ingresa tu nombre de usuario"
              />
              {errors.username && <p className="text-red-400 text-xs mt-1 arcade-font">{errors.username}</p>}
            </div>

            {/* Email (solo registro) */}
            {mode === "register" && (
              <div className="mb-4">
                <label className="block text-[#FFD700] text-sm font-bold mb-2 arcade-font">EMAIL</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={`w-full px-4 py-3 bg-black/50 border-2 rounded-lg text-white focus:outline-none transition-all ${
                    errors.email ? "border-red-500" : "border-[#FFD700]/50 focus:border-[#FF0000]"
                  }`}
                  placeholder="tu@email.com"
                />
                {errors.email && <p className="text-red-400 text-xs mt-1 arcade-font">{errors.email}</p>}
              </div>
            )}

            {/* Password */}
            <div className="mb-4">
              <label className="block text-[#FFD700] text-sm font-bold mb-2 arcade-font">CONTRASEÑA</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className={`w-full px-4 py-3 bg-black/50 border-2 rounded-lg text-white focus:outline-none transition-all ${
                  errors.password ? "border-red-500" : "border-[#FFD700]/50 focus:border-[#FF0000]"
                }`}
                placeholder="••••••••"
              />
              {errors.password && <p className="text-red-400 text-xs mt-1 arcade-font">{errors.password}</p>}
            </div>

            {/* Confirm Password (solo registro) */}
            {mode === "register" && (
              <div className="mb-6">
                <label className="block text-[#FFD700] text-sm font-bold mb-2 arcade-font">CONFIRMAR CONTRASEÑA</label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  className={`w-full px-4 py-3 bg-black/50 border-2 rounded-lg text-white focus:outline-none transition-all ${
                    errors.confirmPassword ? "border-red-500" : "border-[#FFD700]/50 focus:border-[#FF0000]"
                  }`}
                  placeholder="••••••••"
                />
                {errors.confirmPassword && (
                  <p className="text-red-400 text-xs mt-1 arcade-font">{errors.confirmPassword}</p>
                )}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full arcade-button py-4 text-lg arcade-font rounded-lg transition-all ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "CARGANDO..." : mode === "login" ? "ENTRAR AL COMBATE" : "CREAR LUCHADOR"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
