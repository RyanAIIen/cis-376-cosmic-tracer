import { ChangeEvent, FormEvent } from 'react';

import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Box from '@mui/material/Box';
import { Button } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

interface FormInput {
  name: TextFieldProps['name'];
  label: TextFieldProps['label'];
  value: TextFieldProps['value'];
  type?: TextFieldProps['type'];
  required?: TextFieldProps['required'];
  InputProps?: TextFieldProps['InputProps'];
}

interface FormProps {
  header?: string;
  inputs: FormInput[];
  isLoading?: boolean;
  submitText?: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export default function Form({
  header,
  inputs,
  isLoading,
  submitText = 'Submit',
  onChange,
  onSubmit,
}: FormProps) {
  return (
    <form onSubmit={onSubmit}>
      <Box display='flex' flexDirection='column' gap={2}>
        {header && <Typography variant='h2'>{header}</Typography>}

        {inputs.map(
          ({ label, name, value, type, required, InputProps }, index) => (
            <FormControl key={name} required={required}>
              <TextField
                label={label}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                InputProps={InputProps}
                autoFocus={!index}
              />
            </FormControl>
          ),
        )}

        <Button
          type='submit'
          endIcon={<ArrowForwardIcon />}
          variant='contained'
          color='primary'
          loading={isLoading}
        >
          {submitText}
        </Button>
      </Box>
    </form>
  );
}
