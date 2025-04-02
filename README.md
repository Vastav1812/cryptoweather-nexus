
# CryptoWeather Nexus

A modern, multi-page dashboard combining weather data, cryptocurrency information, and real-time notifications via WebSocket.

## Project Info

**URL**: https://lovable.dev/projects/5c87eaa5-55b7-4208-a703-8193b084d018

## Overview

CryptoWeather Nexus is a comprehensive dashboard application that provides:

- Real-time weather information for major global cities
- Live cryptocurrency price tracking with WebSocket integration
- Latest cryptocurrency news headlines
- Detailed analytics and historical data for both weather and crypto
- User preference system for favorite cities and cryptocurrencies
- Real-time notifications for significant price changes and weather alerts

## Technologies Used

- React with TypeScript
- Redux with Redux Toolkit for state management
- WebSocket for real-time data updates
- Chart visualizations with Recharts
- Responsive UI with Tailwind CSS and shadcn/ui components
- React Router for navigation
- API integrations with:
  - OpenWeatherMap for weather data
  - CoinGecko for cryptocurrency data
  - NewsData.io for cryptocurrency news
  - CoinCap WebSocket for real-time price updates

## Features

### Dashboard
- Combined overview of weather, cryptocurrency prices, and news
- Tabs for viewing all items or just favorites
- Real-time updates indicator

### Weather
- Current weather conditions for major cities
- Temperature, humidity, and wind data
- Historical weather data visualization
- Customizable temperature units (Celsius/Fahrenheit)

### Cryptocurrency
- Real-time price tracking for Bitcoin, Ethereum, and Solana
- Price change indicators and market metrics
- Historical price charts
- WebSocket integration for live updates

### Notifications
- Real-time alerts for significant cryptocurrency price changes
- Simulated weather alerts for demonstration purposes
- Notification management system with read/unread state

### User Preferences
- Favorite cities and cryptocurrencies
- Persisted preferences using local storage
- Temperature unit selection

## Setup Instructions

1. Clone the repository
2. Install dependencies with `npm install`
3. Create a `.env` file in the root directory with the following API keys:
   ```
   NEXT_PUBLIC_OPENWEATHER_API_KEY=your_openweather_api_key
   NEXT_PUBLIC_NEWSDATA_API_KEY=your_newsdata_api_key
   NEXT_PUBLIC_COINCAP_API_KEY=your_coincap_api_key
   ```
4. Start the development server with `npm run dev`

## Design Decisions

### State Management
- Redux is used for global state management
- Separate slices for different data domains (weather, crypto, news)
- WebSocket integration for real-time updates
- Local storage for persisting user preferences

### User Interface
- Responsive design that works on all device sizes
- Card-based layout for clear data presentation
- Tabs for switching between all items and favorites
- Consistent color scheme and component styling
- Toast notifications for important events

### Data Handling
- Periodic data refresh to ensure up-to-date information
- Error handling for API failures
- Loading states with skeleton loaders
- Data transformation for chart visualization

### Performance Considerations
- Efficient re-renders using React hooks
- WebSocket connection management
- Throttled updates to prevent UI jank

## License

This project is licensed under the MIT License - see the LICENSE file for details.
