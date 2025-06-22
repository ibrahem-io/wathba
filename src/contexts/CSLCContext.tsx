import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CSLCContextType {
  // Global state for cross-solution data flows
  complaints: any[];
  cases: any[];
  networkData: any[];
  complianceIssues: any[];
  sentimentData: any[];
  
  // Actions
  addComplaint: (complaint: any) => void;
  addCase: (case_: any) => void;
  updateNetworkData: (data: any) => void;
  addComplianceIssue: (issue: any) => void;
  updateSentimentData: (data: any) => void;
  
  // Cross-solution triggers
  triggerCrossAnalysis: (sourceSystem: string, data: any) => void;
}

const CSLCContext = createContext<CSLCContextType | undefined>(undefined);

export function CSLCProvider({ children }: { children: ReactNode }) {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [cases, setCases] = useState<any[]>([]);
  const [networkData, setNetworkData] = useState<any[]>([]);
  const [complianceIssues, setComplianceIssues] = useState<any[]>([]);
  const [sentimentData, setSentimentData] = useState<any[]>([]);

  const addComplaint = (complaint: any) => {
    setComplaints(prev => [complaint, ...prev]);
  };

  const addCase = (case_: any) => {
    setCases(prev => [case_, ...prev]);
  };

  const updateNetworkData = (data: any) => {
    setNetworkData(prev => [data, ...prev]);
  };

  const addComplianceIssue = (issue: any) => {
    setComplianceIssues(prev => [issue, ...prev]);
  };

  const updateSentimentData = (data: any) => {
    setSentimentData(prev => [data, ...prev]);
  };

  const triggerCrossAnalysis = (sourceSystem: string, data: any) => {
    // Simulate cross-system analysis triggers
    console.log(`Cross-analysis triggered from ${sourceSystem}:`, data);
    
    // Example: If multiple complaints about same issue, trigger network analysis
    if (sourceSystem === 'resolve-ai' && data.category === 'network') {
      // Trigger network forecasting analysis
      updateNetworkData({
        id: Date.now(),
        source: 'complaint-pattern',
        region: data.region,
        issue: data.issue,
        timestamp: new Date().toISOString()
      });
    }
  };

  const value = {
    complaints,
    cases,
    networkData,
    complianceIssues,
    sentimentData,
    addComplaint,
    addCase,
    updateNetworkData,
    addComplianceIssue,
    updateSentimentData,
    triggerCrossAnalysis,
  };

  return <CSLCContext.Provider value={value}>{children}</CSLCContext.Provider>;
}

export function useCSLC() {
  const context = useContext(CSLCContext);
  if (context === undefined) {
    throw new Error('useCSLC must be used within a CSLCProvider');
  }
  return context;
}