import { createContext, useContext, useState, ReactNode } from 'react'
import cep from 'cep-promise'

export interface ShippingOption {
  id: string
  name: string
  days: string
  price: number
}

export const MOCK_SHIPPING_OPTIONS: ShippingOption[] = [
  { id: 'pac',     name: 'PAC',      days: '7–12 dias úteis', price: 18.9 },
  { id: 'sedex',   name: 'SEDEX',    days: '1–3 dias úteis',  price: 34.5 },
  { id: 'sedex10', name: 'SEDEX 10', days: '1 dia útil',      price: 52.0 },
]

interface ShippingState {
  cep: string
  address: { city: string; state: string } | null
  selectedOption: ShippingOption | null
  shippingOptions: ShippingOption[]
}

interface ShippingContextType extends ShippingState {
  calculateShipping: (rawCep: string) => Promise<void>
  setSelectedOption: (option: ShippingOption) => void
  resetShipping: () => void
}

const ORIGIN = { city: 'Sorocaba', state: 'SP' }

function computeOptionsFor(address: { city: string; state: string }): ShippingOption[] {
  const state = address.state?.toUpperCase?.() ?? ''
  const city = address.city ?? ''

  // Base PAC price logic: Sorocaba -> R$8.90, same state SP -> R$12.90, neighbors -> R$29.90, distant -> R$120
  let pac = 49.9
  if (state === ORIGIN.state && city.toLowerCase().includes(ORIGIN.city.toLowerCase())) pac = 8.9
  else if (state === ORIGIN.state) pac = 12.9
  else if (['MG', 'RJ', 'PR', 'MS', 'GO', 'MT'].includes(state)) pac = 29.9
  else if (['AM', 'AC', 'RR', 'AP', 'PA', 'RO'].includes(state)) pac = 120
  else pac = 49.9

  // Ensure cap
  const cap = 150
  pac = Math.min(pac, cap)

  const sedex = Math.min(pac * 2, cap)
  const sedex10 = Math.min(pac * 3, cap)

  // Adjust delivery days based on geographic region. States in Sul, Sudeste e Centro-Oeste have no extra delay.
  const southeast = ['SP', 'RJ', 'MG', 'ES']
  const south = ['RS', 'SC', 'PR']
  const centerWest = ['DF', 'GO', 'MT', 'MS']
  const northeast = ['BA','SE','AL','PE','PB','RN','CE','PI','MA']
  const north = ['AM','AC','RR','AP','PA','RO']

  let extra = 0
  if (southeast.includes(state) || south.includes(state) || centerWest.includes(state)) {
    extra = 0
  } else if (northeast.includes(state)) {
    extra = 5
  } else if (north.includes(state)) {
    extra = 10
  } else {
    extra = 7
  }

  // Base delivery windows
  const pacMin = 7 + extra
  const pacMax = 12 + extra
  // sedex increases less proportionally
  const sedexMin = 1 + Math.ceil(extra / 3)
  const sedexMax = 3 + Math.ceil(extra / 3)
  const sedex10Days = 1 + Math.ceil(extra / 6)

  const sedex10Label = sedex10Days === 1 ? `${sedex10Days} dia útil` : `${sedex10Days} dias úteis`

  return [
    { id: 'pac', name: 'PAC', days: `${pacMin}–${pacMax} dias úteis`, price: Number(pac.toFixed(2)) },
    { id: 'sedex', name: 'SEDEX', days: `${sedexMin}–${sedexMax} dias úteis`, price: Number(sedex.toFixed(2)) },
    { id: 'sedex10', name: 'SEDEX 10', days: sedex10Label, price: Number(sedex10.toFixed(2)) },
  ]
}

export const STORAGE_KEY = 'lume3d_shipping'
const EMPTY_STATE: ShippingState = { cep: '', address: null, selectedOption: null, shippingOptions: [] }

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
      // validate selectedOption id against stored shippingOptions or the mock list
      const id = parsed.selectedOption?.id
      const inStored = Array.isArray(parsed.shippingOptions) && parsed.shippingOptions.some((o: any) => o.id === id)
      const inMock = MOCK_SHIPPING_OPTIONS.some(o => o.id === id)
      if (!inStored && !inMock) return EMPTY_STATE
    }
    return {
      cep: parsed.cep,
      address: parsed.address ?? null,
      selectedOption: parsed.selectedOption ?? null,
      shippingOptions: parsed.shippingOptions ?? [],
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
    const normalizedCep = rawCep.replace(/\D/g, '').trim()
    const result = await cep(normalizedCep) // throws on failure — caller handles error UI
    const address = { city: result.city, state: result.state }
    const options = computeOptionsFor(address)
    updateState({
      cep: normalizedCep,
      address,
      // keep compatibility: do not auto-select an option — let UI/ user pick
      selectedOption: null,
      shippingOptions: options,
    })
  }

  const setSelectedOption = (option: ShippingOption) => {
    setState(prev => {
      const next = { ...prev, selectedOption: option }
      saveToStorage(next)
      return next
    })
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
