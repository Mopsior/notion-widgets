'use client'

import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Minus, Plus } from "lucide-react"

type NumberInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> & {
  value: number | '' | undefined
  onChange?: (value: number | '') => void
  min?: number
};

export const NumberInput = ({ value, onChange, min = 0, ...props }: NumberInputProps) => {
  const numValue = value === '' || value === 0 ? '' : Number(value)

  const setValue = (val: number | '') => {
    if (onChange) onChange(val)
  }

  return (
    <div className="flex">
      <Button
        type="button"
        variant="secondary"
        className="border border-input rounded-notion rounded-r-none border-r-0"
        onClick={() => setValue(Math.max(min, (typeof numValue === 'number' ? numValue : 0) - 1))}
        tabIndex={-1}
      >
        <Minus />
      </Button>
      <Input
        type="number"
        value={numValue}
        onChange={e => {
          const val = e.target.value
          setValue(val === '' ? '' : Number(val))
        }}
        className="rounded-none"
        {...props}
      />
      <Button
        type="button"
        variant="secondary"
        className="border border-input rounded-notion rounded-l-none border-l-0"
        onClick={() => setValue(Math.max(min, (typeof numValue === 'number' ? numValue : 0) + 1))}
        tabIndex={-1}
      >
        <Plus />
      </Button>
    </div>
  )
}
