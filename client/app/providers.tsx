"use client";

import type { ThemeProviderProps } from "next-themes";

import * as React from "react";
import { HeroUIProvider } from "@heroui/system";
import { ToastProvider } from "@heroui/toast";
import { useRouter } from "next/navigation";

import { Provider } from "react-redux";
import store from "./lib/redux/store/store";

import { ApolloProvider } from "@apollo/client";
import client from "./lib/apollo/apolloclient";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NonNullable<
      Parameters<ReturnType<typeof useRouter>["push"]>[1]
    >;
  }
}

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();

  return (
    <ApolloProvider client={client}>
      <Provider store={store}>
        <HeroUIProvider navigate={router.push}>
          <ToastProvider placement="top-center" />
          {children}
        </HeroUIProvider>
      </Provider>
    </ApolloProvider>
  );
}
