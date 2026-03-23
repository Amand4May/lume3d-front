import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import React from 'react'

// Mock cep-promise before importing context
vi.mock('cep-promise', () => ({ default: vi.fn() }))
import cep from 'cep-promise'
const mockCep = vi.mocked(cep)

import {
  ShippingProvider,
  useShipping,
  MOCK_SHIPPING_OPTIONS,
  STORAGE_KEY,
} from '@/contexts/ShippingContext'

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ShippingProvider>{children}</ShippingProvider>
)

describe('ShippingContext', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('initializes with empty state when localStorage is empty', () => {
    const { result } = renderHook(() => useShipping(), { wrapper })
    expect(result.current.cep).toBe('')
    expect(result.current.address).toBeNull()
    expect(result.current.selectedOption).toBeNull()
  })

  it('hydrates from valid localStorage data', () => {
    const saved = {
      cep: '01310100',
      address: { city: 'São Paulo', state: 'SP' },
      selectedOption: MOCK_SHIPPING_OPTIONS[0],
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved))
    const { result } = renderHook(() => useShipping(), { wrapper })
    expect(result.current.cep).toBe('01310100')
    expect(result.current.address).toEqual({ city: 'São Paulo', state: 'SP' })
    expect(result.current.selectedOption).toEqual(MOCK_SHIPPING_OPTIONS[0])
  })

  it('resets to empty state on invalid JSON in localStorage', () => {
    localStorage.setItem(STORAGE_KEY, 'not-valid-json')
    const { result } = renderHook(() => useShipping(), { wrapper })
    expect(result.current.address).toBeNull()
    expect(result.current.cep).toBe('')
  })

  it('resets to empty state when cep field is missing', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ address: null, selectedOption: null }))
    const { result } = renderHook(() => useShipping(), { wrapper })
    expect(result.current.cep).toBe('')
    expect(result.current.address).toBeNull()
  })

  it('resets to empty state when selectedOption id is not in MOCK_SHIPPING_OPTIONS', () => {
    const saved = {
      cep: '01310100',
      address: { city: 'São Paulo', state: 'SP' },
      selectedOption: { id: 'obsolete-carrier', name: 'Old', days: '5 dias', price: 10 },
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved))
    const { result } = renderHook(() => useShipping(), { wrapper })
    expect(result.current.selectedOption).toBeNull()
    expect(result.current.address).toBeNull()
  })

  it('calculateShipping sets address, saves cep, and clears selectedOption', async () => {
    mockCep.mockResolvedValueOnce({ city: 'São Paulo', state: 'SP' } as any)
    const { result } = renderHook(() => useShipping(), { wrapper })

    // Pre-set a selected option to verify it gets cleared
    act(() => { result.current.setSelectedOption(MOCK_SHIPPING_OPTIONS[0]) })

    await act(async () => {
      await result.current.calculateShipping('01310100')
    })

    expect(result.current.address).toEqual({ city: 'São Paulo', state: 'SP' })
    expect(result.current.cep).toBe('01310100')
    expect(result.current.selectedOption).toBeNull()
  })

  it('calculateShipping rejects when cep-promise rejects', async () => {
    mockCep.mockRejectedValueOnce(new Error('CEP not found'))
    const { result } = renderHook(() => useShipping(), { wrapper })
    await expect(
      act(async () => { await result.current.calculateShipping('99999999') })
    ).rejects.toThrow()
  })

  it('calculateShipping persists state to localStorage on success', async () => {
    mockCep.mockResolvedValueOnce({ city: 'Rio de Janeiro', state: 'RJ' } as any)
    const { result } = renderHook(() => useShipping(), { wrapper })
    await act(async () => { await result.current.calculateShipping('20040020') })
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!)
    expect(stored.cep).toBe('20040020')
    expect(stored.address.city).toBe('Rio de Janeiro')
  })

  it('setSelectedOption updates selectedOption and persists to localStorage', () => {
    const { result } = renderHook(() => useShipping(), { wrapper })
    act(() => { result.current.setSelectedOption(MOCK_SHIPPING_OPTIONS[1]) })
    expect(result.current.selectedOption).toEqual(MOCK_SHIPPING_OPTIONS[1])
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!)
    expect(stored.selectedOption.id).toBe('sedex')
  })

  it('resetShipping clears state and removes localStorage entry', async () => {
    mockCep.mockResolvedValueOnce({ city: 'SP', state: 'SP' } as any)
    const { result } = renderHook(() => useShipping(), { wrapper })
    await act(async () => { await result.current.calculateShipping('01310100') })
    act(() => { result.current.setSelectedOption(MOCK_SHIPPING_OPTIONS[0]) })

    act(() => { result.current.resetShipping() })

    expect(result.current.cep).toBe('')
    expect(result.current.address).toBeNull()
    expect(result.current.selectedOption).toBeNull()
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
  })
})
