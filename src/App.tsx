
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { WebSocketProvider } from "./services/WebSocketService";

import Index from "./pages/Index";
import Weather from "./pages/Weather";
import WeatherDetails from "./pages/WeatherDetails";
import Crypto from "./pages/Crypto";
import CryptoDetails from "./pages/CryptoDetails";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <WebSocketProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/weather" element={<Weather />} />
              <Route path="/weather/:cityId" element={<WeatherDetails />} />
              <Route path="/crypto" element={<Crypto />} />
              <Route path="/crypto/:cryptoId" element={<CryptoDetails />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </WebSocketProvider>
    </QueryClientProvider>
  </Provider>
);

export default App;
