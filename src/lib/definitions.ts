export interface AirportData {
  presentation: { title: string; suggestionTitle: string; subtitle: string };
  navigation: {
    entityID: string;
    entityType: string;
    localizedName: string;
    relevantFlightParams: {
      skyId: string;
      entityId: string;
      flightPlaceType: string;
      localizedName: string;
    };
  };
}

export interface ProcessedItineraries {
  price: string;
  originCode: string;
  destinationCode: string;
  durationInMinutes: number;
  departureTime: string;
  arrivalTime: string;
  logoUrl: string;
  stopCount: number;
  airlineName: string;
}

export interface AirportType {
  label: string;
  skyId: string;
  entityId: string;
}

export interface Itinerary {
  price: { formatted: string };
  legs: [
    {
      origin: { displayCode: string };
      destination: { displayCode: string };
      durationInMinutes: number;
      stopCount: number;
      departure: string;
      arrival: string;
      carriers: {
        marketing: [{ logoUrl: string; name: string }];
      };
    }
  ];
}
