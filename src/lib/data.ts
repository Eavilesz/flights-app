import { ChangeEvent, Dispatch, SetStateAction } from 'react';
import { AirportData } from './definitions';
import axios from 'axios';

export const fetchAirports = async (
  event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  setValue: Dispatch<SetStateAction<never[]>>
) => {
  const query = event.target.value.trim();

  if (!query) {
    setValue([]);
    return;
  }

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
  console.log('FETCHING');

  try {
    const response = await axios.request(options);
    const data = response.data?.data;

    setValue(
      data?.map((airport: AirportData) => {
        return {
          label: airport.presentation.suggestionTitle,
          skyId: airport.navigation.relevantFlightParams.skyId,
          entityId: airport.navigation.relevantFlightParams.entityId,
        };
      })
    );
  } catch (error) {
    console.error(error);
  }
};
