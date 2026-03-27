import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import React from 'react'
import { ShippingContext, MOCK_SHIPPING_OPTIONS } from '@/contexts/ShippingContext'
import type { ShippingOption } from '@/contexts/ShippingContext'
import ShippingCalculator from '@/components/ShippingCalculator'

function makeContext(overrides: Partial<{
  cep: string
  address: { city: string; state: string } | null
  selectedOption: ShippingOption | null
  calculateShipping: ReturnType<typeof vi.fn>
  setSelectedOption: ReturnType<typeof vi.fn>
  resetShipping: ReturnType<typeof vi.fn>
}> = {}) {
  return {
    cep: '',
    address: null,
    selectedOption: null,
    calculateShipping: vi.fn().mockResolvedValue(undefined),
    setSelectedOption: vi.fn(),
    resetShipping: vi.fn(),
    ...overrides,
  }
}

function renderWithContext(contextValue: ReturnType<typeof makeContext>) {
  return render(
    <ShippingContext.Provider value={contextValue as any}>
      <ShippingCalculator />
    </ShippingContext.Provider>
  )
}

describe('ShippingCalculator', () => {
  describe('Empty state', () => {
    it('renders CEP input and disabled calculate button when no address', () => {
      renderWithContext(makeContext())
      expect(screen.getByPlaceholderText('00000-000')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /calcular frete/i })).toBeDisabled()
    })

    it('enables button when 8 digits are entered', () => {
      renderWithContext(makeContext())
      fireEvent.change(screen.getByPlaceholderText('00000-000'), { target: { value: '01310100' } })
      expect(screen.getByRole('button', { name: /calcular frete/i })).not.toBeDisabled()
    })

    it('formats CEP input with hyphen mask', () => {
      renderWithContext(makeContext())
      fireEvent.change(screen.getByPlaceholderText('00000-000'), { target: { value: '01310100' } })
      expect((screen.getByPlaceholderText('00000-000') as HTMLInputElement).value).toBe('01310-100')
    })
  })

  describe('Loading state', () => {
    it('shows loading text and disables button while calculating', async () => {
      let resolveCalc!: () => void
      const calculateShipping = vi.fn(() => new Promise<void>(r => { resolveCalc = r }))
      renderWithContext(makeContext({ calculateShipping }))

      fireEvent.change(screen.getByPlaceholderText('00000-000'), { target: { value: '01310100' } })
      fireEvent.click(screen.getByRole('button', { name: /calcular frete/i }))

      expect(screen.getByRole('button', { name: /calculando/i })).toBeDisabled()

      // Resolve and flush so the component can finish its async work cleanly
      await act(async () => { resolveCalc() })
    })
  })

  describe('Error state', () => {
    it('shows error message when calculateShipping rejects', async () => {
      const calculateShipping = vi.fn().mockRejectedValue(new Error('Not found'))
      renderWithContext(makeContext({ calculateShipping }))

      fireEvent.change(screen.getByPlaceholderText('00000-000'), { target: { value: '99999999' } })
      fireEvent.click(screen.getByRole('button', { name: /calcular frete/i }))

      await waitFor(() => {
        expect(screen.getByText(/CEP não encontrado/i)).toBeInTheDocument()
      })
    })
  })

  describe('Result state', () => {
    const addressCtx = {
      cep: '01310100',
      address: { city: 'São Paulo', state: 'SP' },
      selectedOption: null,
    }

    it('shows address banner when address is set', () => {
      renderWithContext(makeContext(addressCtx))
      expect(screen.getByText(/São Paulo/i)).toBeInTheDocument()
      expect(screen.getByText(/SP/)).toBeInTheDocument()
    })

    it('renders radio buttons for all mock shipping options', () => {
      renderWithContext(makeContext(addressCtx))
      expect(screen.getByText('PAC')).toBeInTheDocument()
      expect(screen.getByText('SEDEX')).toBeInTheDocument()
      expect(screen.getByText('SEDEX 10')).toBeInTheDocument()
    })

    it('calls setSelectedOption when radio is clicked', () => {
      const setSelectedOption = vi.fn()
      renderWithContext(makeContext({ ...addressCtx, setSelectedOption }))
      // Click the PAC radio
      const radios = screen.getAllByRole('radio')
      fireEvent.click(radios[0])
      expect(setSelectedOption).toHaveBeenCalledWith(MOCK_SHIPPING_OPTIONS[0])
    })

    it('Calculate button is present and can trigger calculateShipping', () => {
      const calculateShipping = vi.fn().mockResolvedValue(undefined)
      renderWithContext(makeContext({ ...addressCtx, calculateShipping }))
      const btn = screen.getByRole('button', { name: /calcular frete/i })
      fireEvent.click(btn)
      expect(calculateShipping).toHaveBeenCalled()
    })
  })

  describe('On mount with existing context', () => {
    it('renders Result state immediately if address is non-null', () => {
      renderWithContext(makeContext({
        cep: '01310100',
        address: { city: 'Curitiba', state: 'PR' },
        selectedOption: null,
      }))
      expect(screen.getByText(/Curitiba/i)).toBeInTheDocument()
    })
  })
})
