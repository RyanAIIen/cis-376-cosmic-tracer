'use client';

import * as React from 'react';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';

import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Image from 'next/image';
import Link, { LinkProps } from '@mui/material/Link';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { useRouter } from 'next/navigation';

import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { useLogoutMutation } from '@/redux/features/authApiSlice';
import { logout as setLogout } from '@/redux/features/authSlice';

const LOG_OUT = 'Log out';

const guestNavItems = [
  { name: 'Login', href: '/login', icon: <LoginIcon /> },
  { name: 'Sign Up', href: '/register', icon: <AppRegistrationIcon /> },
];

const authenticatedNavItems = [
  { name: 'Dashboard', href: '/dashboard', icon: <DashboardIcon /> },
];

// Always visible navigation items regardless of auth status
const alwaysVisibleNavItems = [
  { name: 'Play Game', href: '/game', icon: <SportsEsportsIcon /> },
];

const userMenu = [
  { name: 'Account', href: '/account', icon: <AccountCircleIcon /> },
  { name: LOG_OUT, icon: <LogoutIcon /> },
];

const Logo = ({ sx }: { sx: LinkProps['sx'] }) => (
  <Link href='/dashboard' sx={sx}>
    <Box display='flex' flexGrow={1} gap={1} alignItems='center'>
      <Image
        src='/cosmic-tracer-logo.png'
        alt='Cosmic Tracer Logo'
        width={40}
        height={40}
      />

      <Typography
        variant='h1'
        sx={{
          fontWeight: 'bold',
          background: 'linear-gradient(45deg, #2BBAD0 30%, #ff3e9d 90%)',
          backgroundClip: 'text',
          textFillColor: 'transparent',
        }}
      >
        Cosmic Tracer
      </Typography>
    </Box>
  </Link>
);

export default function Navigation() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [logout] = useLogoutMutation();

  const { isAuthenticated, isLoading, user } = useAppSelector(
    (state) => state.auth,
  );

  const navItems = isLoading
    ? []
    : isAuthenticated
      ? [...authenticatedNavItems, ...alwaysVisibleNavItems]
      : [...guestNavItems, ...alwaysVisibleNavItems];

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null,
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null,
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    logout(undefined)
      .unwrap()
      .then(() => {
        dispatch(setLogout());
      })
      .finally(() => {
        router.push('/login');
      });
  };

  return (
    <AppBar position='static'>
      <Container maxWidth='xl'>
        <Toolbar disableGutters>
          <Logo sx={{ display: { xs: 'none', md: 'flex' } }} />
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: 'flex', md: 'none' },
            }}
          >
            <IconButton
              size='large'
              aria-label='navigation menu'
              aria-controls='menu-appbar'
              aria-haspopup='true'
              onClick={handleOpenNavMenu}
              color='inherit'
            >
              <MenuIcon />
            </IconButton>

            <Menu
              id='menu-appbar'
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {navItems.map(({ name, icon, href }) => (
                <MenuItem
                  key={name}
                  onClick={handleCloseNavMenu}
                  component={Link}
                  href={href}
                >
                  <ListItemIcon>{icon}</ListItemIcon>
                  <ListItemText>{name}</ListItemText>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Logo sx={{ display: { xs: 'flex', md: 'none' }, mr: 3 }} />
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: 'none', md: 'flex' },
              justifyContent: 'flex-end',
              gap: 3,
              px: 3,
            }}
          >
            {navItems.map(({ name, icon, href }) => (
              <Button
                key={name}
                variant='text'
                onClick={handleCloseNavMenu}
                href={href}
                startIcon={icon}
                sx={{
                  my: 2,
                  color: 'text.primary',

                  '@media (prefers-color-scheme: dark)': { color: 'white' },
                  display: 'flex',
                }}
              >
                {name}
              </Button>
            ))}
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            {isAuthenticated && (
              <Tooltip title='Open settings'>
                <IconButton
                  aria-label='account menu'
                  aria-controls='menu-appbar'
                  aria-haspopup='true'
                  onClick={handleOpenUserMenu}
                  sx={{ p: 0 }}
                >
                  <Avatar
                    alt={user?.display_name}
                    src={`https://picsum.photos/seed/seed-${encodeURIComponent(String(user?.display_name))}/50/50`}
                    sx={{ bgcolor: '#555' }}
                  />
                </IconButton>
              </Tooltip>
            )}

            <Menu
              sx={{ mt: '45px' }}
              id='menu-appbar'
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {user?.display_name && (
                <div>
                  <Typography sx={{ pt: 0, pb: 1, px: 2 }}>
                    <strong>{user?.display_name}</strong>
                  </Typography>
                  <Divider />
                </div>
              )}

              {userMenu.map(({ name, icon, href }) => (
                <MenuItem
                  key={name}
                  onClick={() => {
                    if (name === LOG_OUT) handleLogout();
                    handleCloseUserMenu();
                  }}
                  component={Link}
                  href={href}
                >
                  <ListItemIcon>{icon}</ListItemIcon>
                  <ListItemText>{name}</ListItemText>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
