import Box from '@mui/material/Box';

interface FormBoxProps {
  form: React.ReactNode;
  children?: React.ReactNode;
}

export default function FormBox({ form, children }: FormBoxProps) {
  return (
    <Box m={-2} mx={-3}>
      <Box display='flex' flexDirection='column' rowGap={2} p={3}>
        {form}

        {children}
      </Box>
    </Box>
  );
}
