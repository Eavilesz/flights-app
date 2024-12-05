import { useState } from 'react';

import Map from './components/Map';
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
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
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
import { Dayjs } from 'dayjs';

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

const cityButtons = ['London', 'Chicago', 'Rome', 'Paris'];

export default function GoogleFlights() {
  const [tripType, setTripType] = useState('');
  const [passengers, setPassengers] = useState('');
  const [cabinClass, setCabinClass] = useState('');
  const [departureDate, setDepartureDate] = useState<Dayjs | null>(null);
  const [returnDate, setReturnDate] = useState<Dayjs | null>(null);
  const [selectedCity, setSelectedCity] = useState('London');

  const handleCityChange = (cityName: string) => {
    setSelectedCity(cityName);
  };

  const handleTripTypeChange = (event: SelectChangeEvent) => {
    setTripType(event.target.value as string);
  };

  const handlePassengersChange = (event: SelectChangeEvent) => {
    setPassengers(event.target.value as string);
  };

  const handleClassChange = (event: SelectChangeEvent) => {
    setCabinClass(event.target.value as string);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static" color="default" elevation={0}>
        <Toolbar>
          <Typography variant="h6" color="inherit" noWrap>
            Flights App
          </Typography>
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
                  onChange={handleTripTypeChange}
                  labelId="trip-type-label"
                  id="trip-type"
                  value={tripType}
                  label="Trip"
                >
                  <MenuItem value="round">Round trip</MenuItem>
                  <MenuItem value="one">One way</MenuItem>
                  {/* <MenuItem value="multi">Multi-city</MenuItem> */}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel id="passengers-label">Passengers</InputLabel>
                <Select
                  onChange={handlePassengersChange}
                  labelId="passengers-label"
                  id="passengers"
                  value={passengers}
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
                  value={cabinClass}
                  label="Cabin class"
                  onChange={handleClassChange}
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
            {tripType === 'round' && (
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
            )}
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
            {tripType === 'round' && (
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
                              <CalendarTodayIcon
                                color="action"
                                sx={{ mr: 1 }}
                              />
                            ),
                          }}
                        />
                      ),
                    }}
                  />
                </LocalizationProvider>
              </Grid>
            )}
            <Button
              sx={{ mt: 3, mx: 'auto' }}
              variant="contained"
              size="large"
              startIcon={<SearchIcon />}
            >
              Search flights
            </Button>
          </Grid>
        </Paper>

        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              {`Find cheap flights from ${selectedCity} to Anywhere`}
            </Typography>
            <Grid item sx={{ mb: 2 }}>
              {cityButtons.map((city) => (
                <Button
                  key={city}
                  onClick={() => handleCityChange(city)}
                  variant={city === selectedCity ? 'contained' : 'outlined'}
                  sx={{ borderRadius: '3rem', ml: 1 }}
                >
                  {city}
                </Button>
              ))}
            </Grid>
            <Map />
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
        </Grid>
      </Container>
    </ThemeProvider>
  );
}
