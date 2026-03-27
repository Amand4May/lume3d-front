import { useState } from 'react'
import { useShipping, MOCK_SHIPPING_OPTIONS } from '@/contexts/ShippingContext'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'

function formatCep(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 8)
  if (digits.length <= 5) return digits
  return `${digits.slice(0, 5)}-${digits.slice(5)}`
}

export default function ShippingCalculator() {
  const { cep, address, selectedOption, shippingOptions, calculateShipping, setSelectedOption, resetShipping } =
    useShipping()

  const [inputCep, setInputCep] = useState(() => (cep ? formatCep(cep) : ''))
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const rawDigits = inputCep.replace(/\D/g, '')
  const canSubmit = rawDigits.length === 8 && !isLoading

  const handleCalculate = async () => {
    setIsLoading(true)
    setError(null)
    try {
      await calculateShipping(rawDigits)
    } catch {
      setError('CEP não encontrado. Verifique e tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    resetShipping()
    setInputCep('')
    setError(null)
  }

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputCep(formatCep(e.target.value))
    if (error) setError(null)
  }

  // When address present show editable CEP, calculate button and options coming from context
  if (address !== null) {
    return (
      <div className="space-y-4">
        <div className="flex gap-2">
          <Input value={inputCep} onChange={handleCepChange} placeholder="00000-000" maxLength={9} className={error ? 'border-destructive max-w-[160px]' : 'max-w-[160px]'} />
          <Button type="button" onClick={handleCalculate} disabled={!canSubmit}>
            {isLoading ? 'Calculando...' : 'Calcular frete'}
          </Button>
        </div>
        <div className="rounded-md bg-success/10 border border-success/20 px-3 py-2 text-sm text-success dark:bg-success-900 dark:border-success-700 dark:text-success/200 flex items-center gap-2">
          <span>📍 Entregando para:</span>
          <strong>{address.city} - {address.state}</strong>
        </div>
        <RadioGroup
          value={selectedOption?.id ?? ''}
          onValueChange={(id) => {
            const opts = (shippingOptions && shippingOptions.length) ? shippingOptions : MOCK_SHIPPING_OPTIONS
            const opt = opts.find(o => o.id === id)
            if (opt) setSelectedOption(opt)
          }}
          className="space-y-0"
        >
          {((shippingOptions && shippingOptions.length) ? shippingOptions : MOCK_SHIPPING_OPTIONS).map((opt) => (
            <div
              key={opt.id}
              role="button"
              tabIndex={0}
              onClick={() => setSelectedOption(opt)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedOption(opt) }}
              className={`flex items-center gap-3 py-2 border-b border-border last:border-0 ${selectedOption?.id === opt.id ? 'bg-surface/90 rounded-md' : ''}`}
            >
              <RadioGroupItem value={opt.id} id={opt.id} />
              <Label htmlFor={opt.id} className="flex-1 cursor-pointer">
                <span className="font-medium">{opt.name}</span>
                <span className="text-muted-foreground"> — {opt.days}</span>
              </Label>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm">R$ {opt.price.toFixed(2).replace('.', ',')}</span>
                {/* keep only color highlight; no extra selected label */}
              </div>
            </div>
          ))}
        </RadioGroup>
      </div>
    )
  }

  // Empty / Loading / Error state
  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          value={inputCep}
          onChange={handleCepChange}
          placeholder="00000-000"
          maxLength={9}
          className={error ? 'border-destructive max-w-[160px]' : 'max-w-[160px]'}
        />
        <Button
          type="button"
          onClick={handleCalculate}
          disabled={!canSubmit}
        >
          {isLoading ? 'Calculando...' : 'Calcular frete'}
        </Button>
      </div>
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  )
}
