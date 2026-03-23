import { createContext, useContext, useState, ReactNode } from 'react'
import cep from 'cep-promise'

export interface ShippingOption {
  id: string
  name: string
  days: string
  price: number
}

interface ShippingState {
  cep: string
  address: { city: string; state: string } | null
  selectedOption: ShippingOption | null
}

interface ShippingContextType extends ShippingState {
  calculateShipping: (rawCep: string) => Promise<void>
  setSelectedOption: (option: ShippingOption) => void
  resetShipping: () => void
}

export const MOCK_SHIPPING_OPTIONS: ShippingOption[] = [
  { id: 'pac',     name: 'PAC',      days: '7–12 dias úteis', price: 18.90 },
  { id: 'sedex',   name: 'SEDEX',    days: '1–3 dias úteis',  price: 34.50 },
  { id: 'sedex10', name: 'SEDEX 10', days: '1 dia útil',      price: 52.00 },
]

const STORAGE_KEY = 'lume3d_shipping'
const EMPTY_STATE: ShippingState = { cep: '', address: null, selectedOption: null }

function loadFromStorage(): ShippingState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return EMPTY_STATE
    const parsed = JSON.parse(raw)
    if (typeof parsed.cep !== 'string') return EMPTY_STATE
    if (parsed.address !== null && parsed.address !== undefined) {
      if (typeof parsed.address?.city !== 'string' || typeof parsed.address?.state !== 'string') {
        return EMPTY_STATE
      }
    }
    if (parsed.selectedOption !== null && parsed.selectedOption !== undefined) {
      const valid = MOCK_SHIPPING_OPTIONS.some(o => o.id === parsed.selectedOption?.id)
      if (!valid) return EMPTY_STATE
    }
    return {
      cep: parsed.cep,
      address: parsed.address ?? null,
      selectedOption: parsed.selectedOption ?? null,
    }
  } catch {
    return EMPTY_STATE
  }
}

function saveToStorage(state: ShippingState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export const ShippingContext = createContext<ShippingContextType | undefined>(undefined)

export function ShippingProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ShippingState>(() => loadFromStorage())

  const updateState = (newState: ShippingState) => {
    setState(newState)
    saveToStorage(newState)
  }

  const calculateShipping = async (rawCep: string): Promise<void> => {
    const result = await cep(rawCep) // throws on failure — caller handles error UI
    updateState({
      cep: rawCep,
      address: { city: result.city, state: result.state },
      selectedOption: null,
    })
  }

  const setSelectedOption = (option: ShippingOption) => {
    updateState({ ...state, selectedOption: option })
  }

  const resetShipping = () => {
    setState(EMPTY_STATE)
    localStorage.removeItem(STORAGE_KEY)
  }

  return (
    <ShippingContext.Provider value={{ ...state, calculateShipping, setSelectedOption, resetShipping }}>
      {children}
    </ShippingContext.Provider>
  )
}

export function useShipping(): ShippingContextType {
  const ctx = useContext(ShippingContext)
  if (!ctx) throw new Error('useShipping must be used within ShippingProvider')
  return ctx
}
