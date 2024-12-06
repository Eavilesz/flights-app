import {
  useState,
  ChangeEvent,
  SyntheticEvent,
  useEffect,
  Dispatch,
  SetStateAction,
} from 'react';
import axios from 'axios';

import Map from './components/Map';
import { CustomSelect } from './components/CustomSelect';

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

interface airportData {
  presentation: { title: string; suggestionTitle: string; subtitle: string };
  navigation: {};
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#1a73e8',
    },
  },
});

const tripValues = [
  { value: 'round', text: 'Round trip' },
  { value: 'one', text: 'One Way' },
];

const passengerValues = [
  { value: 1, text: '1 passenger' },
  { value: 2, text: '2 passengers' },
  { value: 3, text: '3 passengers' },
  { value: 4, text: '4 passengers' },
];

const cabinValues = [
  { value: 'economy', text: 'Economy' },
  { value: 'premium', text: 'Premium' },
  { value: 'business', text: 'Business' },
  { value: 'first', text: 'First' },
];

const cityButtons = ['London', 'Chicago', 'Rome', 'Paris'];

export default function GoogleFlights() {
  const [tripType, setTripType] = useState('round');
  const [passengers, setPassengers] = useState('');
  const [cabinClass, setCabinClass] = useState('');
  const [fromAirports, setFromAirports] = useState([]);
  const [toAirports, setToAirports] = useState([]);
  const [fromAirport, setFromAirport] = useState<{
    label: string;
  } | null>(null);
  const [toAirport, setToAirport] = useState<{
    label: string;
  } | null>(null);
  const [departureDate, setDepartureDate] = useState<Dayjs | null>(null);
  const [returnDate, setReturnDate] = useState<Dayjs | null>(null);
  const [selectedCity, setSelectedCity] = useState('London');

  const handleCityChange = (cityName: string) => {
    setSelectedCity(cityName);
  };

  const handleFromAirportChange = (
    _event: SyntheticEvent,
    value: { label: string } | null
  ) => {
    if (value === toAirport) setToAirport(null);
    setFromAirport(value);
  };

  const handleToAirportChange = (
    _event: SyntheticEvent,
    value: { label: string } | null
  ) => {
    if (value === fromAirport) setFromAirport(null);
    setToAirport(value);
  };

  const handleFromAirportQueryChange = async (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    setValue: Dispatch<SetStateAction<never[]>>
  ) => {
    const query = event.target.value;

    const options = {
      method: 'GET',
      url: 'https://sky-scrapper.p.rapidapi.com/api/v1/flights/searchAirport',
      params: {
        query: query,
        locale: 'en-US',
      },
      headers: {
        'x-rapidapi-key': import.meta.env.VITE_RAPIDAPI_KEY,
        'x-rapidapi-host': 'sky-scrapper.p.rapidapi.com',
      },
    };

    try {
      const response = await axios.request(options);
      const data = response.data?.data;

      setValue(
        data?.map((airport: airportData) => {
          return { label: airport.presentation.suggestionTitle };
        })
      );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    console.log('departureDate:', departureDate);
    console.log('returnDate:', returnDate);
  }, [departureDate, returnDate]);

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
            <CustomSelect
              setValue={setTripType}
              value={tripType}
              labelId="trip-type-label"
              labelText="Trip"
              selectId="trip-type"
              menuItems={tripValues}
            />

            <CustomSelect
              setValue={setPassengers}
              value={passengers}
              labelId="passengers-label"
              labelText="Passengers"
              selectId="passengers"
              menuItems={passengerValues}
            />

            <CustomSelect
              setValue={setCabinClass}
              value={cabinClass}
              labelId="cabin-class-label"
              labelText="Cabin class"
              selectId="cabin-class"
              menuItems={cabinValues}
            />

            {/* From Airport */}
            <Grid item xs={12} sm={6}>
              <Autocomplete
                value={fromAirport}
                onChange={handleFromAirportChange}
                options={fromAirports}
                renderInput={(params) => (
                  <TextField
                    value={fromAirport}
                    onChange={(event) =>
                      handleFromAirportQueryChange(event, setFromAirports)
                    }
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

            {/* To Airport */}

            <Grid item xs={12} sm={6}>
              <Autocomplete
                options={toAirports}
                value={toAirport}
                onChange={handleToAirportChange}
                renderInput={(params) => (
                  <TextField
                    value={toAirport}
                    onChange={(event) =>
                      handleFromAirportQueryChange(event, setToAirports)
                    }
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
