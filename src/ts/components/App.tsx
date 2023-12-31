import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import {
  Outlet,
  RootRoute,
  Router,
  Route,
  RouterProvider,
} from "@tanstack/react-router";

import { GlobalContextProvider, useGlobalContext } from "../GlobalContext";
import { Initialize } from "../Views/Initialize";
import { Home } from "../Views/Home";
import { ExerciseRunner } from "../Views/ExerciseRunner";

const rootRoute = new RootRoute({
  component: () => {
    const { isInitialized } = useGlobalContext();
    return <>{isInitialized() ? <Outlet /> : <Initialize />}</>;
  },
});

// @ts-ignore
const BASE_PATH = process.env.BASE_PATH;

const homeRoute = new Route({
  getParentRoute: () => rootRoute,
  path: BASE_PATH,
  component: Home,
});

const runnerRoute = new Route({
  getParentRoute: () => rootRoute,
  path: BASE_PATH + "/exercise",
  component: ExerciseRunner,
});

const routeTree = rootRoute.addChildren([homeRoute, runnerRoute]);

const router = new Router({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const theme = extendTheme({
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
  },
  styles: {
    global: {
      "html, body, #app": {
        height: "100%",
        margin: 0,
        padding: 0,
      },
      // body: {
      //   backgroundColor: "#1f1711",
      //   color: "#eeeeee",
      // },
    },
  },
});

export function App() {
  return (
    <GlobalContextProvider>
      <ChakraProvider theme={theme}>
        <RouterProvider router={router} />
      </ChakraProvider>
    </GlobalContextProvider>
  );
}
