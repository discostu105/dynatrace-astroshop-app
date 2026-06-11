import { Page } from "@dynatrace/strato-components-preview/layouts";
import React from "react";
import { Route, Routes } from "react-router-dom";
import { Header } from "./components/Header";
import { OrderManagementPage } from "./pages/OrderManagement/OrderManagementPage";
import { GeoAnalyticsPage } from "./pages/GeoAnalytics/GeoAnalyticsPage";
import { ActivityTimelinePage } from "./pages/ActivityTimeline/ActivityTimelinePage";

export const App = () => {
  return (
    <Page>
      <Page.Header>
        <Header />
      </Page.Header>
      <Page.Main>
        <Routes>
          <Route path="/" element={<OrderManagementPage />} />
          <Route path="/geo" element={<GeoAnalyticsPage />} />
          <Route path="/projects/:id/activity" element={<ActivityTimelinePage />} />
        </Routes>
      </Page.Main>
    </Page>
  );
};
