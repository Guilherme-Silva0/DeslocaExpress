'use client'

import { InputAdornment, TextField, TextFieldProps } from '@mui/material'
import { FormVehicleData } from './FormVehicle'
import { FieldErrors, UseFormRegister } from 'react-hook-form'
import { FC } from 'react'
import { LucideIcon } from 'lucide-react'

type InputProps = TextFieldProps & {
  label: string
  id: keyof FormVehicleData
  type: string
  required?: boolean
  register: UseFormRegister<FormVehicleData>
  errors: FieldErrors<FormVehicleData>
  disabled?: boolean
  icon?: LucideIcon
}

const InputText: FC<InputProps> = ({
  errors,
  id,
  label,
  register,
  type,
  disabled,
  required,
  icon: Icon,
  ...rest
}) => {
  return (
    <TextField
      id={id}
      label={label}
      type={type}
      error={id in errors}
      helperText={id in errors ? errors[id]?.message : undefined}
      disabled={disabled}
      {...register(id)}
      {...rest}
      variant="standard"
      InputProps={{
        startAdornment: Icon && (
          <InputAdornment position="start">
            <Icon size={18} />
          </InputAdornment>
        ),
      }}
    />
  )
}

export default InputText
