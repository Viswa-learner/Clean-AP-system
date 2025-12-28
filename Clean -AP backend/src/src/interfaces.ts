// src/interfaces.ts

// --- USER ROLES ---
// Defines the four types of users in the system.
export type UserRole = 'citizen' | 'village_staff' | 'cleaning_staff' | 'admin';

// --- USER PROFILE ---
export interface User {
  id: string; // Firebase Authentication UID
  role: UserRole;
  name: string;
  phone: string;
  aadhaar?: string; // Optional (Should be masked for privacy)
  village: string; // Primary field used for assigning staff to a location
  createdAt: FirebaseFirestore.Timestamp;
}

// --- DUSTBIN REQUEST STATUS ---
export type DustbinRequestStatus = 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'ISSUE_REPORTED';

// --- DUSTBIN REQUEST DATA ---
export interface DustbinRequest {
  id: string;
  citizenId: string;
  citizenName: string; // Stored for easier display on frontend
  phone: string;
  village: string;
  placeType: 'home' | 'shop' | 'school' | 'hospital' | 'function';
  dustbinsSelected: ('green' | 'blue' | 'red' | 'yellow')[]; // Allows multiple color selection
  binSize: string; 
  location: {
    address: string;
    googleMapLink: string; // Link for navigation
  };
  assignedVillageStaffId?: string; // The ID of the staff member automatically assigned
  status: DustbinRequestStatus;
  createdAt: FirebaseFirestore.Timestamp;
  completedAt?: FirebaseFirestore.Timestamp;
}

// --- COMPLAINT STATUS ---
export type ComplaintStatus = 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'ISSUE_REPORTED';

// --- COMPLAINT DATA ---
export interface Complaint {
  id: string;
  citizenId: string;
  photoUrl: string; // URL of the uploaded garbage photo
  description: string;
  location: {
    address: string;
    googleMapLink: string;
  };
  assignedCleaningStaffId?: string; // The ID of the cleaning staff assigned
  status: ComplaintStatus;
  createdAt: FirebaseFirestore.Timestamp;
  completedAt?: FirebaseFirestore.Timestamp;
}

// --- RATINGS ---
export interface Rating {
  id: string;
  taskId: string; // Links to either a Dustbin Request ID or Complaint ID
  taskType: 'dustbin' | 'complaint';
  rating: 1 | 2 | 3 | 4 | 5; // Star rating
  feedback?: string;
  createdAt: FirebaseFirestore.Timestamp;
}

// --- ISSUES ---
export type IssueStatus = 'OPEN' | 'RESOLVED';

export interface Issue {
  id: string;
  taskId: string;
  taskType: 'dustbin' | 'complaint';
  issueType: string; // E.g., "Staff did not arrive", "Rude behavior"
  description: string;
  status: IssueStatus;
  createdAt: FirebaseFirestore.Timestamp;
  resolvedAt?: FirebaseFirestore.Timestamp;
}