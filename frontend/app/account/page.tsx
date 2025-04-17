'use client';

import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

import { RequireAuth } from '@/app/components/utils';
import { useRetrieveUserQuery } from '@/redux/features/authApiSlice';
import { Paper } from '@mui/material';

export default function Page() {
  const { data: user } = useRetrieveUserQuery();

  return (
    <RequireAuth>
      <Typography variant='h2' gutterBottom>
        User Account Information
      </Typography>

      <Paper
        elevation={3}
        sx={{
          width: '100%',
          p: 2,
          bgcolor: '#0d0d2b',
          border: '2px solid #30cfd0',
          borderRadius: '8px',
        }}
      >
        {user && (
          <List>
            {Object.entries(user as { [key: string]: any }).map(
              ([key, value]) => (
                <ListItem key={key} disableGutters>
                  <ListItemText
                    primary={key.toUpperCase()}
                    secondary={value}
                    sx={{
                      '& .MuiListItemText-primary': {
                        fontSize: '2rem',
                        color: '#ff3e9d',
                      },
                      '& .MuiListItemText-secondary': {
                        fontSize: '1.5rem',
                        color: '#ff3e9d',
                      },
                    }}
                  />
                </ListItem>
              ),
            )}
          </List>
        )}

        <Button href='/reset-password'>Reset My Password</Button>
      </Paper>
    </RequireAuth>
  );
}
