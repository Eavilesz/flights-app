export interface airportData {
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

export interface airportType {
  label: string;
  skyId: string;
  entityId: string;
}
