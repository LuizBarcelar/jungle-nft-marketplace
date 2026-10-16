
import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RouterProvider } from "@tanstack/react-router";

import { queryClient } from "@/providers/query-client";
import { router } from "@/routes";

import "./index.css";

async function enableMocking() {
  if (import.meta.env.DEV || import.meta.env.VITE_ENABLE_MSW === "true") {
    const { worker } = await import("./mocks/browser");

    await worker.start({
      onUnhandledRequest: "bypass",
    });
  }
}

async function bootstrap() {
  await enableMocking();

  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </React.StrictMode>,
  );
}

bootstrap().catch(console.error);
