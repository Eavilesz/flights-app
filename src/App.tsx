import { ThemeProvider, createTheme } from '@mui/material/styles';
import { AppBar, CssBaseline, Toolbar, Typography } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1a73e8',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static" color="default" elevation={0}>
        <Toolbar>
          <Typography variant="h6" color="inherit" noWrap>
            Google Flights
          </Typography>
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  );
}

export default App;
