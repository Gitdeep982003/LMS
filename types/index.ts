export type PropertyType = 'Apartment' | 'Villa' | 'Plot' | 'Commercial' | 'Penthouse';

export type LeadSource =
  | 'Website'
  | 'MagicBricks'
  | '99acres'
  | 'Housing.com'
  | 'Referral'
  | 'Google Ads'
  | 'Walk-in'
  | 'Facebook Ads';

export type LeadStatus =
  | 'New'
  | 'Assigned'
  | 'Contacted'
  | 'Interested'
  | 'Follow-up'
  | 'Site Visit Scheduled'
  | 'Site Visited'
  | 'Negotiation'
  | 'Booked'
  | 'Converted'
  | 'Lost';

export type LeadPriority = 'High' | 'Medium' | 'Low';

export interface LeadNote {
  id: string;
  text: string;
  createdAt: string;
  authorName: string;
  stage?: LeadStatus | string;
}

export interface LeadActivity {
  id: string;
  type: 'status_change' | 'assigned' | 'note_added' | 'followup_created' | 'visit_scheduled' | 'booked' | string;
  description: string;
  timestamp: string;
  userName: string;
}

export interface Lead {
  id: string; // e.g. "LMS-1001"
  name: string;
  mobile: string;
  email: string;
  interestedPropertyId?: string;
  interestedPropertyName?: string;
  preferredLocation: string;
  budget: number; // In INR e.g. 8500000 (85 Lakhs)
  propertyType: PropertyType;
  leadSource: LeadSource;
  status: LeadStatus;
  assignedAgentId?: string;
  assignedAgentName?: string;
  followUpDate?: string; // YYYY-MM-DD
  remarks: string;
  priority: LeadPriority;
  createdAt: string;
  updatedAt: string;
  notes: LeadNote[];
  activities: LeadActivity[];
}

export type PropertyStatus = 'Available' | 'Booked' | 'Sold' | 'Under Offer';

export interface Property {
  id: string; // e.g. "PROP-201"
  name: string;
  projectName: string;
  type: PropertyType;
  location: string;
  city: string;
  address: string;
  sqft: number;
  price: number; // In INR
  bedrooms: number;
  bathrooms: number;
  description: string;
  images: string[];
  status: PropertyStatus;
  featured?: boolean;
  amenities: string[];
  reraNumber?: string;
}

export type UserRole = 'Admin' | 'Sales Manager' | 'Sales Executive';

export interface SalesAgent {
  id: string; // e.g. "AGT-101"
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar: string;
  activeLeadsCount: number;
  convertedLeadsCount: number;
  totalSalesValue: number; // In INR
  status: 'Active' | 'On Leave' | 'Inactive';
  maxLeadCapacity: number;
  department: string;
}

export type FollowUpType = 'Call' | 'Meeting' | 'Site Visit' | 'WhatsApp' | 'Email';
export type FollowUpStatus = 'Pending' | 'Completed' | 'Overdue' | 'Cancelled';

export interface FollowUp {
  id: string; // e.g. "FLP-501"
  leadId: string;
  leadName: string;
  propertyName?: string;
  agentId: string;
  agentName: string;
  scheduledDate: string; // YYYY-MM-DD
  scheduledTime: string; // e.g. "11:30 AM"
  type: FollowUpType;
  status: FollowUpStatus;
  notes: string;
  feedback?: string;
  nextFollowUpDate?: string;
  createdAt: string;
}

export type SiteVisitStatus = 'Scheduled' | 'Completed' | 'Cancelled' | 'Rescheduled' | 'No Show';

export interface SiteVisit {
  id: string; // e.g. "VISIT-801"
  leadId: string;
  leadName: string;
  propertyId: string;
  propertyName: string;
  agentId: string;
  agentName: string;
  visitDate: string; // YYYY-MM-DD
  visitTime: string; // e.g. "03:00 PM"
  status: SiteVisitStatus;
  customerFeedback?: string;
  rating?: number; // 1-5
  remarks?: string;
  createdAt: string;
}

export type PaymentStatus = 'Pending' | 'Partial' | 'Completed';
export type BookingStatus = 'Confirmed' | 'Under Review' | 'Cancelled';

export interface Booking {
  id: string; // e.g. "BKG-901"
  leadId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  propertyId: string;
  propertyName: string;
  propertyPrice: number;
  bookingAmount: number;
  paymentStatus: PaymentStatus;
  agentId: string;
  agentName: string;
  bookingDate: string; // YYYY-MM-DD
  status: BookingStatus;
  agreementNumber: string;
  paymentMethod: 'Bank Transfer' | 'Cheque' | 'UPI' | 'Demand Draft';
  notes?: string;
}

export interface Customer {
  id: string;
  name: string;
  mobile: string;
  email: string;
  location: string;
  totalLeads: number;
  activeBookings: number;
  totalSpent: number;
  status: 'Active' | 'Prospect' | 'VIP';
  firstInteractionDate: string;
}

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  phone: string;
}
