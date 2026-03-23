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
  const { cep, address, selectedOption, calculateShipping, setSelectedOption, resetShipping } =
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

  // Result state: address has been found
  if (address !== null) {
    return (
      <div className="space-y-4">
        <div className="flex gap-2">
          <Input value={formatCep(cep)} readOnly className="max-w-[160px]" />
          <Button type="button" variant="outline" onClick={handleReset}>
            Recalcular
          </Button>
        </div>
        <div className="rounded-md bg-green-50 border border-green-200 px-3 py-2 text-sm text-green-800 dark:bg-green-950 dark:border-green-800 dark:text-green-300">
          📍 Entregando para: <strong>{address.city} - {address.state}</strong>
        </div>
        <RadioGroup
          value={selectedOption?.id ?? ''}
          onValueChange={(id) => {
            const opt = MOCK_SHIPPING_OPTIONS.find(o => o.id === id)
            if (opt) setSelectedOption(opt)
          }}
          className="space-y-0"
        >
          {MOCK_SHIPPING_OPTIONS.map((opt) => (
            <div key={opt.id} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
              <RadioGroupItem value={opt.id} id={opt.id} />
              <Label htmlFor={opt.id} className="flex-1 cursor-pointer">
                <span className="font-medium">{opt.name}</span>
                <span className="text-muted-foreground"> — {opt.days}</span>
              </Label>
              <span className="font-semibold text-sm">
                R$ {opt.price.toFixed(2).replace('.', ',')}
              </span>
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
      {isLoading && (
        <p className="text-sm text-muted-foreground">Buscando endereço...</p>
      )}
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  )
}
