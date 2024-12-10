# Flight Search Application

## Overview

This Flight Search Application is a modern and responsive tool that allows users to search for flights between two airports. It leverages the **Sky-Scrapper API** from RapidAPI for real-time airport lookups and flight data retrieval. The app provides a smooth user experience with validations for input fields, debouncing to optimize API calls, and visually appealing designs powered by **Material UI**.

## Features

- **Airport Search**: Dynamically search for airports in the "From" and "To" fields using the Sky-Scrapper API.
- **Flight Search**: Retrieve available flights based on user input for airports and dates.
- **Input Validation**: Ensures valid data for all input fields, including date range validation.
- **Debouncing**: Reduces API call frequency by introducing a delay between user input and API fetch.
- **Material UI Styling**: Elegant and responsive user interface.
- **PNPM Initialization**: Efficient dependency management and fast builds.

---

## Technologies Used

- **React**: Framework for building the user interface.
- **Material UI**: Library for pre-styled React components.
- **Sky-Scrapper API**: API for airport and flight data.
- **PNPM**: Package manager for project initialization and dependency management.

---

## Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [PNPM](https://pnpm.io/) (v7+)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/flight-search-app.git
   cd flight-search-app
   pnpm install
   ```

1. **Set up the API Key:**

- Visit the [Sky-Scrapper API](https://rapidapi.com/apiheya/api/sky-scrapper) on RapidAPI.

- Obtain your API key.

- Create a .env file in the root directory and add the following

```
VITE_RAPIDAPI_KEY=your_api_key_here
```

## Running the application

1. Start the development server:

```
pnpm start
```

2. Open your browser to navigate to:

```
http://localhost:3000
```
