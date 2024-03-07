import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import UserInfoProvider from "./context/UserInfoProvider.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import FormContextProvider from "./context/RestaurantActiveFormProvider.tsx";
const staleTime = 20 * 60 * 1000;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: staleTime,
      retry: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <UserInfoProvider>
        <FormContextProvider>
          <App />
        </FormContextProvider>
        <ToastContainer
          position="top-center"
          autoClose={3000}
          stacked
          draggable
        />
      </UserInfoProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  </React.StrictMode>
);
