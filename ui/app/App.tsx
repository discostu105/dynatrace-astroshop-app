import { Page } from "@dynatrace/strato-components-preview/layouts";
import React from "react";
import { Route, Routes } from "react-router-dom";
import { Header } from "./components/Header";
import { OrderManagementPage } from "./pages/OrderManagement/OrderManagementPage";
import { GeoAnalyticsPage } from "./pages/GeoAnalytics/GeoAnalyticsPage";

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
        </Routes>
      </Page.Main>
    </Page>
  );
};
