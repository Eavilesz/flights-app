import {
  useState,
  useCallback,
  SyntheticEvent,
  ChangeEvent,
  Dispatch,
  SetStateAction,
} from 'react';
import axios from 'axios';

import debounce from 'just-debounce-it';

import { CustomSelect } from './components/CustomSelect';

import { fetchAirports } from './lib/data';
import {
  AirportType,
  ProcessedItineraries,
  Itinerary,
} from './lib/definitions';
import {
  tripValues,
  passengerValues,
  cabinValues,
} from './lib/placeholder-values';

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
import Autocomplete from '@mui/material/Autocomplete';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Link from '@mui/material/Link';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import FlightLandIcon from '@mui/icons-material/FlightLand';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SearchIcon from '@mui/icons-material/Search';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { CircularProgress } from '@mui/material';
import { Dayjs } from 'dayjs';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1a73e8',
    },
  },
});

export default function GoogleFlights() {
  const [tripType, setTripType] = useState<string>('one');
  const [passengers, setPassengers] = useState<string>('1');
  const [cabinClass, setCabinClass] = useState<string>('economy');
  const [fromAirports, setFromAirports] = useState([]);
  const [toAirports, setToAirports] = useState([]);
  const [fromAirport, setFromAirport] = useState<AirportType | null>(null);
  const [toAirport, setToAirport] = useState<AirportType | null>(null);
  const [departureDate, setDepartureDate] = useState<Dayjs | null>(null);
  const [returnDate, setReturnDate] = useState<Dayjs | null>(null);
  const [itineraryList, setItineraryList] = useState<
    ProcessedItineraries[] | null
  >(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const [errorMessages, setErrorMessages] = useState({
    fromAirport: '',
    toAirport: '',
    departureDate: '',
    returnDate: '',
  });

  const validateFields = (): boolean => {
    const errors = {
      fromAirport: '',
      toAirport: '',
      departureDate: '',
      returnDate: '',
    };

    if (!fromAirport) {
      errors.fromAirport = 'Please select a departure airport.';
    }

    if (!toAirport) {
      errors.toAirport = 'Please select a destination airport.';
    }

    if (!departureDate) {
      errors.departureDate = 'Please select a departure date.';
    }

    if (tripType === 'round' && !returnDate) {
      errors.returnDate = 'Please select a date for round trips.';
    }

    setErrorMessages(errors);

    // Check if any error messages exists
    return Object.values(errors).every((message) => !message);
  };

  const handleFromAirportChange = (
    _event: SyntheticEvent,
    value: AirportType | null
  ) => {
    if (value === toAirport) setToAirport(null);
    setFromAirport(value);
  };

  const handleToAirportChange = (
    _event: SyntheticEvent,
    value: AirportType | null
  ) => {
    if (value === fromAirport) setFromAirport(null);
    setToAirport(value);
  };

  function extractTime(dateString: string) {
    const timePart = new Date(dateString).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    return timePart;
  }

  const handleSubmit = async () => {
    if (!validateFields()) return;
    setIsLoading(true);
    setIsSubmitted(true);

    const formatedDepartureDate = departureDate
      ? `${departureDate.year()}-${
          departureDate.month() + 1
        }-${departureDate.date()}`
      : null;

    const formatedReturnDate = returnDate
      ? `${returnDate.year()}-${returnDate.month() + 1}-${returnDate.date()}`
      : null;

    const options = {
      method: 'GET',
      url: 'https://sky-scrapper.p.rapidapi.com/api/v2/flights/searchFlights',
      params: {
        originSkyId: fromAirport?.skyId,
        destinationSkyId: toAirport ? toAirport.skyId : null,
        originEntityId: fromAirport?.entityId,
        destinationEntityId: toAirport ? toAirport.entityId : null,
        date: formatedDepartureDate,
        returnDate: formatedReturnDate,
        cabinClass: cabinClass,
        adults: passengers,
        sortBy: 'best',
        currency: 'USD',
        market: 'en-US',
        countryCode: 'US',
      },
      headers: {
        'x-rapidapi-key': import.meta.env.VITE_RAPIDAPI_KEY,
        'x-rapidapi-host': 'sky-scrapper.p.rapidapi.com',
      },
    };

    try {
      const response = await axios.request(options);
      const itineraries = response.data.data?.itineraries;

      const processedItineraries = itineraries.map((itinerary: Itinerary) => {
        const legs = itinerary.legs[0];

        return {
          price: itinerary.price.formatted,
          originCode: legs.origin.displayCode,
          destinationCode: legs.destination.displayCode,
          durationInMinutes: legs.durationInMinutes,
          departureTime: extractTime(legs.departure),
          arrivalTime: extractTime(legs.arrival),
          logoUrl: legs.carriers.marketing[0].logoUrl,
          stopCount: legs.stopCount,
          airlineName: legs.carriers.marketing[0].name,
        };
      });

      setItineraryList(processedItineraries);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  };

  // For fetching only when the user stops typing
  const debouncedFetchAirports = useCallback(
    debounce(
      (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        setvalue: Dispatch<SetStateAction<never[]>>
      ) => {
        fetchAirports(event, setvalue);
      },
      200
    ),
    []
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static" color="default" elevation={0}>
        <Toolbar>
          <Link
            href="https://eaviles-portfolio.vercel.app/en"
            underline="hover"
            target="_blank"
            rel="noopener"
          >
            <Typography
              sx={{ fontWeight: '900', fontStyle: 'italic' }}
              fontSize={30}
              color="#2463ec"
              noWrap
            >
              {'<EAV>'}
            </Typography>
          </Link>
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
              disabled
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
                options={fromAirports || []}
                renderInput={(params) => (
                  <TextField
                    value={fromAirport}
                    onChange={(event) =>
                      debouncedFetchAirports(event, setFromAirports)
                    }
                    {...params}
                    label="From"
                    fullWidth
                    error={!!errorMessages.fromAirport}
                    helperText={errorMessages.fromAirport}
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
                options={toAirports || []}
                value={toAirport}
                onChange={handleToAirportChange}
                renderInput={(params) => (
                  <TextField
                    value={toAirport}
                    onChange={(event) =>
                      debouncedFetchAirports(event, setToAirports)
                    }
                    {...params}
                    label="To"
                    fullWidth
                    error={!!errorMessages.toAirport}
                    helperText={errorMessages.toAirport}
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

            {/* Departure date */}
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
                        error={!!errorMessages.departureDate}
                        helperText={errorMessages.departureDate}
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

            {/* Return Date */}
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
                          error={!!errorMessages.returnDate}
                          helperText={errorMessages.returnDate}
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
          </Grid>
          <Grid item xs={12} sm={6} sx={{ textAlign: 'center' }}>
            <Button
              onClick={handleSubmit}
              sx={{ mt: 3 }}
              variant="contained"
              size="large"
              startIcon={<SearchIcon />}
            >
              Search flights
            </Button>
          </Grid>
        </Paper>

        {itineraryList && itineraryList?.length < 1 && isSubmitted && (
          <>
            <Typography gutterBottom>
              Oops! We couldn't find any flights matching your search.
            </Typography>
            <Typography>
              Try changing your dates, destination, or other search options to
              explore more results.
            </Typography>
          </>
        )}

        {isLoading && (
          <Grid container>
            <CircularProgress sx={{ mx: 'auto' }} size={70} />
          </Grid>
        )}

        {itineraryList && itineraryList.length > 0 && (
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Find cheap flights to Anywhere
              </Typography>
              <Paper elevation={2}>
                {itineraryList?.map((item, index) => (
                  <Card key={index} sx={{ mb: 2 }}>
                    <CardContent>
                      <Grid container alignItems="center" spacing={2}>
                        <Grid item>
                          <img
                            style={{ width: '35px' }}
                            src={item.logoUrl}
                            alt="Airline logo."
                          />
                        </Grid>
                        <Grid item xs>
                          <Typography variant="subtitle1">{`${item.originCode} → ${item.destinationCode}`}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {`${item.airlineName} • ${item.durationInMinutes} minutes • ${item.stopCount} stops`}
                          </Typography>
                          <Typography variant="body2">
                            {`Departs: ${item.departureTime} • Arrives:  ${item.arrivalTime}`}
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Typography variant="h6">{item.price}</Typography>
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
        )}
      </Container>
    </ThemeProvider>
  );
}
