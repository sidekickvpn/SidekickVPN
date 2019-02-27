import React from 'react';

export interface Report {
  name: string;
  severity: string;
  message: string;
}

export interface ReportsContextState {
  reports: Report[];
}

const ReportContext = React.createContext<ReportsContextState>({
  reports: []
});

export default ReportContext;
