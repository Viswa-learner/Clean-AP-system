import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  name: string;
  aadhaar: string;
  phone: string;
  village: string;
  role: 'citizen' | 'village-staff' | 'cleaning-staff' | 'admin';
}

interface DustbinRequest {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  village: string;
  placeType: string;
  dustbinTypes: string[];
  binSize: string;
  location: string;
  mapLink: string;
  status: 'pending' | 'approved' | 'in-progress' | 'completed' | 'rejected' | 'issue-reported';
  createdAt: Date;
  assignedTo?: string;
  expectedDate?: string;
  expectedTime?: string;
  completedAt?: Date;
  // UPDATE 2, 3: Rating, Feedback, Issue Reporting
  rating?: number;
  feedback?: string;
  issueType?: string;
  issueDescription?: string;
  issueReportedAt?: Date;
}

interface Complaint {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  village: string;
  photo: string;
  location: string;
  mapLink: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'issue-reported';
  assignedTo?: string;
  completionPhoto?: string;
  completionNote?: string;
  createdAt: Date;
  completedAt?: Date;
  expectedDate?: string;
  expectedTime?: string;
  // UPDATE 2, 3: Rating, Feedback, Issue Reporting
  rating?: number;
  feedback?: string;
  issueType?: string;
  issueDescription?: string;
  issueReportedAt?: Date;
}

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  dustbinRequests: DustbinRequest[];
  addDustbinRequest: (request: DustbinRequest) => void;
  complaints: Complaint[];
  addComplaint: (complaint: Complaint) => void;
  updateComplaintStatus: (id: string, status: string, assignedTo?: string) => void;
  completeComplaint: (id: string, completionPhoto: string, completionNote: string) => void;
  // New methods for UPDATE 3, 6
  updateDustbinRequest: (id: string, updates: Partial<DustbinRequest>) => void;
  updateComplaint: (id: string, updates: Partial<Complaint>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [dustbinRequests, setDustbinRequests] = useState<DustbinRequest[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);

  const addDustbinRequest = (request: DustbinRequest) => {
    setDustbinRequests(prev => [...prev, request]);
  };

  const addComplaint = (complaint: Complaint) => {
    setComplaints(prev => [...prev, complaint]);
  };

  const updateComplaintStatus = (id: string, status: string, assignedTo?: string) => {
    setComplaints(prev => prev.map(c => 
      c.id === id ? { ...c, status: status as any, assignedTo } : c
    ));
  };

  const completeComplaint = (id: string, completionPhoto: string, completionNote: string) => {
    setComplaints(prev => prev.map(c => 
      c.id === id ? { 
        ...c, 
        status: 'completed', 
        completionPhoto, 
        completionNote,
        completedAt: new Date()
      } : c
    ));
  };

  const updateDustbinRequest = (id: string, updates: Partial<DustbinRequest>) => {
    setDustbinRequests(prev => prev.map(r => 
      r.id === id ? { ...r, ...updates } : r
    ));
  };

  const updateComplaint = (id: string, updates: Partial<Complaint>) => {
    setComplaints(prev => prev.map(c => 
      c.id === id ? { ...c, ...updates } : c
    ));
  };

  return (
    <AppContext.Provider value={{
      user,
      setUser,
      dustbinRequests,
      addDustbinRequest,
      complaints,
      addComplaint,
      updateComplaintStatus,
      completeComplaint,
      updateDustbinRequest,
      updateComplaint
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};