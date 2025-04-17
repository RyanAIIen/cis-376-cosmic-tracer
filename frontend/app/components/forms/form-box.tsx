import { Container } from '@mui/material';
import Box from '@mui/material/Box';

interface FormBoxProps {
  form: React.ReactNode;
  children?: React.ReactNode;
}

export default function FormBox({ form, children }: FormBoxProps) {
  return (
    <Container maxWidth='sm'>
      <Box display='flex' flexDirection='column' gap={2} p={2}>
        {form}

        {children}
      </Box>
    </Container>
  );
}
