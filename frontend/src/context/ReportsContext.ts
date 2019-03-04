import React from 'react';

export interface Report {
  _id: string;
  name: string;
  severity: string;
  message: string;
  date: string;
}

export interface ReportsContextState {
  reports: Report[];
}

const ReportContext = React.createContext<ReportsContextState>({
  reports: []
});

export default ReportContext;
