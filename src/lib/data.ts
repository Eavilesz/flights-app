import { ChangeEvent, Dispatch, SetStateAction } from 'react';
import { AirportData } from './definitions';
import axios from 'axios';

export const fetchAirports = async (
  event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  setValue: Dispatch<SetStateAction<never[]>>,
  setIsAirportLoading: Dispatch<SetStateAction<boolean>>
) => {
  const query = event.target.value.trim();
  setIsAirportLoading(true);

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

  try {
    const response = await axios.request(options);
    const data = response.data?.data;

    setIsAirportLoading(false);

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
    setIsAirportLoading(false);
    console.error(error);
  }
};
