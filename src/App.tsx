import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Autocomplete from '@mui/material/Autocomplete';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import FlightLandIcon from '@mui/icons-material/FlightLand';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SearchIcon from '@mui/icons-material/Search';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import dayjs, { Dayjs } from 'dayjs';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1a73e8',
    },
  },
});

const airports = [
  { label: 'New York (JFK)' },
  { label: 'Los Angeles (LAX)' },
  { label: 'Chicago (ORD)' },
  { label: 'San Francisco (SFO)' },
  { label: 'London (LHR)' },
  { label: 'Paris (CDG)' },
  { label: 'Tokyo (HND)' },
  { label: 'Dubai (DXB)' },
];

export default function GoogleFlights() {
  const [tabValue, setTabValue] = useState(0);
  const [departureDate, setDepartureDate] = useState<Dayjs | null>(null);
  const [returnDate, setReturnDate] = useState<Dayjs | null>(null);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <AppBar position="static" color="default" elevation={0}>
        <Toolbar>
          <Typography variant="h6" color="inherit" noWrap>
            Flights App
          </Typography>
          <Tabs value={tabValue} onChange={handleTabChange} sx={{ ml: 4 }}>
            <Tab label="Flights" />
            <Tab label="Hotels" />
            <Tab label="Packages" />
          </Tabs>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <img src="https://www.gstatic.com/travel-frontend/animation/hero/flights_nc_4.svg" />
        <Typography variant="h3" sx={{ textAlign: 'center', mb: 1 }}>
          Flights
        </Typography>
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel id="trip-type-label">Trip</InputLabel>
                <Select
                  labelId="trip-type-label"
                  id="trip-type"
                  value="round"
                  label="Trip"
                >
                  <MenuItem value="round">Round trip</MenuItem>
                  <MenuItem value="one">One way</MenuItem>
                  <MenuItem value="multi">Multi-city</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel id="passengers-label">Passengers</InputLabel>
                <Select
                  labelId="passengers-label"
                  id="passengers"
                  value={1}
                  label="Passengers"
                >
                  <MenuItem value={1}>1 passenger</MenuItem>
                  <MenuItem value={2}>2 passengers</MenuItem>
                  <MenuItem value={3}>3 passengers</MenuItem>
                  <MenuItem value={4}>4 passengers</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel id="cabin-class-label">Cabin class</InputLabel>
                <Select
                  labelId="cabin-class-label"
                  id="cabin-class"
                  value="economy"
                  label="Cabin class"
                >
                  <MenuItem value="economy">Economy</MenuItem>
                  <MenuItem value="premium">Premium economy</MenuItem>
                  <MenuItem value="business">Business</MenuItem>
                  <MenuItem value="first">First</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                options={airports}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="From"
                    fullWidth
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <FlightTakeoffIcon color="action" sx={{ mr: 1 }} />
                      ),
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                options={airports}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="To"
                    fullWidth
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <FlightLandIcon color="action" sx={{ mr: 1 }} />
                      ),
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Departure"
                  value={departureDate}
                  onChange={(newValue) => setDepartureDate(newValue)}
                  slots={{
                    textField: (params) => (
                      <TextField
                        {...params}
                        fullWidth
                        InputProps={{
                          ...params.InputProps,
                          startAdornment: (
                            <CalendarTodayIcon color="action" sx={{ mr: 1 }} />
                          ),
                        }}
                      />
                    ),
                  }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Return"
                  value={returnDate}
                  onChange={(newValue) => setReturnDate(newValue)}
                  slots={{
                    textField: (params) => (
                      <TextField
                        {...params}
                        fullWidth
                        InputProps={{
                          ...params.InputProps,
                          startAdornment: (
                            <CalendarTodayIcon color="action" sx={{ mr: 1 }} />
                          ),
                        }}
                      />
                    ),
                  }}
                />
              </LocalizationProvider>
            </Grid>
            {/* <Grid item xs={12}> */}
            <Button
              sx={{ mt: 3, mx: 'auto' }}
              variant="contained"
              size="large"
              startIcon={<SearchIcon />}
              // fullWidth
            >
              Search flights
            </Button>
            {/* </Grid> */}
          </Grid>
        </Paper>

        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Typography variant="h6" gutterBottom>
              Cheap flights
            </Typography>
            <Paper elevation={2}>
              {[1, 2, 3].map((i) => (
                <Card key={i} sx={{ mb: 2 }}>
                  <CardContent>
                    <Grid container alignItems="center" spacing={2}>
                      <Grid item>
                        <Box
                          sx={{
                            width: 50,
                            height: 50,
                            backgroundColor: 'grey.200',
                            borderRadius: 1,
                          }}
                        />
                      </Grid>
                      <Grid item xs>
                        <Typography variant="subtitle1">JFK → LHR</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Delta Airlines • 7h 25m • Direct
                        </Typography>
                        <Typography variant="body2">
                          Departs: 9:30 AM • Arrives: 4:55 PM
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="h6">$749</Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      color="primary"
                      endIcon={<ArrowForwardIcon />}
                    >
                      Select
                    </Button>
                  </CardActions>
                </Card>
              ))}
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Price Graph
            </Typography>
            <Paper
              elevation={2}
              sx={{ height: 200, mb: 4, backgroundColor: 'grey.100' }}
            />
            <Typography variant="h6" gutterBottom>
              Map View
            </Typography>
            <Paper
              elevation={2}
              sx={{ height: 200, backgroundColor: 'grey.100' }}
            />
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
}
