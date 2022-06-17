// Copyright 2020-2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { FC } from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import {
  lightTheme,
  MeetingProvider,
  NotificationProvider,
  darkTheme,
  GlobalStyles
} from "amazon-chime-sdk-component-library-react";

import { AppStateProvider, useAppState } from "./providers/AppStateProvider";
import ErrorProvider from "./providers/ErrorProvider";
import routes from "./constants/routes";
import { NavigationProvider } from "./providers/NavigationProvider";
import { Meeting, Home, DeviceSetup } from "./views";
import Notifications from "./containers/Notifications";
import NoMeetingRedirect from "./containers/NoMeetingRedirect";
import meetingConfig from "./meetingConfig";

const Theme: React.FC = ({ children }) => {
  const { theme } = useAppState();

  return (
    <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
      <GlobalStyles />
      {children}
    </ThemeProvider>
  );
};

const App: FC = () => (
  <Router>
    <AppStateProvider>
      <Theme>
        <NotificationProvider>
          <Notifications />
          <ErrorProvider>
            {/* <MeetingProvider {...meetingConfig}> */}
            <MeetingProvider>
              <NavigationProvider>
                <Switch>
                  <Route exact path={routes.HOME} >
                    <Redirect to={routes.STAFF} />
                  </Route>
                  <Route exact path={routes.STAFF} component={Home} />
                  <Route exact path={routes.CUSTOMER} component={Home} />
                  <Route path={routes.DEVICE}>
                    <NoMeetingRedirect>
                      <DeviceSetup />
                    </NoMeetingRedirect>
                  </Route>
                  <Route path={routes.CUSTOMERDEVICE}>
                    <NoMeetingRedirect>
                      <DeviceSetup />
                    </NoMeetingRedirect>
                  </Route>
                  <Route path={routes.MEETING}>
                    <NoMeetingRedirect>
                      <Meeting />
                    </NoMeetingRedirect>
                  </Route>
                  <Route path={routes.CUSTOMERMEETING}>
                    <NoMeetingRedirect>
                      <Meeting />
                    </NoMeetingRedirect>
                  </Route>
                  {/* <Route path={routes.CLIENTMEETING}>
                    <NoMeetingRedirect>
                      <Meeting />
                    </NoMeetingRedirect>
                  </Route> */}
                </Switch>
              </NavigationProvider>
            </MeetingProvider>
          </ErrorProvider>
        </NotificationProvider>
      </Theme>
    </AppStateProvider>
  </Router>
);

export default App;
