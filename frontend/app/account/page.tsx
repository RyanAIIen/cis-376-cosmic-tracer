'use client';

import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

import { RequireAuth } from '@/app/components/utils';
import { useRetrieveUserQuery } from '@/redux/features/authApiSlice';

export default function Page() {
  const { data: user } = useRetrieveUserQuery();

  return (
    <RequireAuth>
      <Typography variant='h2' gutterBottom>
        User Account Information
      </Typography>

      {user && (
        <List sx={{ width: '100%', bgcolor: 'background.paper', mb: 2 }}>
          {Object.entries(user as { [key: string]: any }).map(
            ([key, value]) => (
              <ListItem key={key} disableGutters>
                <ListItemText primary={key.toUpperCase()} secondary={value} />
              </ListItem>
            ),
          )}
        </List>
      )}

      <Button href='/reset-password'>Reset My Password</Button>
    </RequireAuth>
  );
}
