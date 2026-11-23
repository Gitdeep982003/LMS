import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  Lead,
  Property,
  SalesAgent,
  FollowUp,
  SiteVisit,
  Booking,
  UserSession,
  LeadStatus,
} from '@/types';
import {
  initialLeads,
  initialProperties,
  initialSalesAgents,
  initialFollowUps,
  initialSiteVisits,
  initialBookings,
  defaultUserSessions,
} from '@/data/initialData';
import { generateId } from '@/lib/utils';

interface LmsState {
  leads: Lead[];
  properties: Property[];
  agents: SalesAgent[];
  followUps: FollowUp[];
  siteVisits: SiteVisit[];
  bookings: Booking[];
  currentUser: UserSession;
  
  // UI filter states
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Actions
  setCurrentUser: (user: UserSession) => void;
  switchUserRole: (roleKey: 'admin' | 'manager' | 'executive') => void;
  
  // Lead actions
  addLead: (leadData: Partial<Lead>) => Lead;
  updateLead: (id: string, updates: Partial<Lead>) => void;
  deleteLead: (id: string) => void;
  assignLead: (leadId: string, agentId: string, agentName: string) => void;
  bulkAssignLeads: (leadIds: string[], agentId: string, agentName: string) => void;
  addLeadNote: (leadId: string, noteText: string, authorName?: string) => void;
  updateLeadStatus: (leadId: string, newStatus: LeadStatus) => void;
  importLeads: (imported: Partial<Lead>[]) => number;

  // Property actions
  addProperty: (propertyData: Partial<Property>) => Property;
  updateProperty: (id: string, updates: Partial<Property>) => void;
  deleteProperty: (id: string) => void;

  // Follow-up actions
  addFollowUp: (followUpData: Partial<FollowUp>) => FollowUp;
  updateFollowUp: (id: string, updates: Partial<FollowUp>) => void;
  deleteFollowUp: (id: string) => void;

  // Site Visit actions
  addSiteVisit: (visitData: Partial<SiteVisit>) => SiteVisit;
  updateSiteVisit: (id: string, updates: Partial<SiteVisit>) => void;
  deleteSiteVisit: (id: string) => void;

  // Booking actions
  addBooking: (bookingData: Partial<Booking>) => Booking;
  updateBooking: (id: string, updates: Partial<Booking>) => void;
  deleteBooking: (id: string) => void;

  // Agent actions
  addAgent: (agentData: Partial<SalesAgent>) => SalesAgent;
  updateAgent: (id: string, updates: Partial<SalesAgent>) => void;
  deleteAgent: (id: string) => void;

  // System actions
  resetDemoData: () => void;
}

export const useLmsStore = create<LmsState>()(
  persist(
    (set, get) => ({
      leads: initialLeads,
      properties: initialProperties,
      agents: initialSalesAgents,
      followUps: initialFollowUps,
      siteVisits: initialSiteVisits,
      bookings: initialBookings,
      currentUser: defaultUserSessions.admin,
      searchQuery: '',

      setSearchQuery: (query) => set({ searchQuery: query }),

      setCurrentUser: (user) => set({ currentUser: user }),

      switchUserRole: (roleKey) => {
        const user = defaultUserSessions[roleKey] || defaultUserSessions.admin;
        set({ currentUser: user });
      },

      // Leads
      addLead: (leadData) => {
        const id = generateId('LMS');
        const now = new Date().toISOString();
        const currentUserName = get().currentUser.name;

        const newLead: Lead = {
          id,
          name: leadData.name || 'New Lead',
          mobile: leadData.mobile || '+91 90000 00000',
          email: leadData.email || 'lead@example.com',
          interestedPropertyId: leadData.interestedPropertyId,
          interestedPropertyName: leadData.interestedPropertyName,
          preferredLocation: leadData.preferredLocation || 'Bengaluru',
          budget: leadData.budget || 5000000,
          propertyType: leadData.propertyType || 'Apartment',
          leadSource: leadData.leadSource || 'Website',
          status: leadData.status || (leadData.assignedAgentId ? 'Contacted' : 'New'),
          assignedAgentId: leadData.assignedAgentId,
          assignedAgentName: leadData.assignedAgentName,
          followUpDate: leadData.followUpDate,
          remarks: leadData.remarks || '',
          priority: leadData.priority || 'Medium',
          createdAt: now,
          updatedAt: now,
          notes: leadData.remarks
            ? [
                {
                  id: `note-${Date.now()}`,
                  text: leadData.remarks,
                  createdAt: now,
                  authorName: currentUserName,
                  stage: leadData.status || 'New',
                },
              ]
            : [],
          activities: [
            {
              id: `act-${Date.now()}`,
              type: 'status_change',
              description: `Lead created with status: ${leadData.status || 'New'}`,
              timestamp: now,
              userName: currentUserName,
            },
          ],
        };

        set((state) => {
          // If agent assigned, update agent's active lead count
          let updatedAgents = state.agents;
          if (newLead.assignedAgentId) {
            updatedAgents = state.agents.map((ag) =>
              ag.id === newLead.assignedAgentId
                ? { ...ag, activeLeadsCount: ag.activeLeadsCount + 1 }
                : ag
            );
          }
          return {
            leads: [newLead, ...state.leads],
            agents: updatedAgents,
          };
        });

        return newLead;
      },

      updateLead: (id, updates) => {
        const now = new Date().toISOString();
        const currentUserName = get().currentUser.name;

        set((state) => {
          const prevLead = state.leads.find((l) => l.id === id);
          if (!prevLead) return state;

          const updatedActivities = [...prevLead.activities];
          if (updates.status && updates.status !== prevLead.status) {
            updatedActivities.unshift({
              id: `act-${Date.now()}`,
              type: 'status_change',
              description: `Status changed from ${prevLead.status} to ${updates.status}`,
              timestamp: now,
              userName: currentUserName,
            });
          }

          if (updates.assignedAgentId && updates.assignedAgentId !== prevLead.assignedAgentId) {
            updatedActivities.unshift({
              id: `act-${Date.now() + 1}`,
              type: 'assigned',
              description: `Reassigned to ${updates.assignedAgentName || 'Agent'}`,
              timestamp: now,
              userName: currentUserName,
            });
          }

          return {
            leads: state.leads.map((l) =>
              l.id === id
                ? { ...l, ...updates, updatedAt: now, activities: updatedActivities }
                : l
            ),
          };
        });
      },

      deleteLead: (id) => {
        set((state) => ({
          leads: state.leads.filter((l) => l.id !== id),
          followUps: state.followUps.filter((f) => f.leadId !== id),
          siteVisits: state.siteVisits.filter((s) => s.leadId !== id),
        }));
      },

      assignLead: (leadId, agentId, agentName) => {
        const now = new Date().toISOString();
        const currentUserName = get().currentUser.name;

        set((state) => {
          const lead = state.leads.find((l) => l.id === leadId);
          if (!lead) return state;

          const oldAgentId = lead.assignedAgentId;
          const newStatus = lead.status;

          const updatedActivities = [
            {
              id: `act-${Date.now()}`,
              type: 'assigned' as const,
              description: `Assigned to ${agentName}`,
              timestamp: now,
              userName: currentUserName,
            },
            ...lead.activities,
          ];

          const updatedAgents = state.agents.map((ag) => {
            if (ag.id === agentId) {
              return { ...ag, activeLeadsCount: ag.activeLeadsCount + 1 };
            }
            if (oldAgentId && ag.id === oldAgentId) {
              return { ...ag, activeLeadsCount: Math.max(0, ag.activeLeadsCount - 1) };
            }
            return ag;
          });

          return {
            agents: updatedAgents,
            leads: state.leads.map((l) =>
              l.id === leadId
                ? {
                    ...l,
                    assignedAgentId: agentId,
                    assignedAgentName: agentName,
                    status: newStatus,
                    updatedAt: now,
                    activities: updatedActivities,
                  }
                : l
            ),
          };
        });
      },

      bulkAssignLeads: (leadIds, agentId, agentName) => {
        const now = new Date().toISOString();
        const currentUserName = get().currentUser.name;

        set((state) => {
          const leadIdSet = new Set(leadIds);
          let assignedCount = 0;

          const updatedLeads = state.leads.map((l) => {
            if (leadIdSet.has(l.id)) {
              assignedCount++;
              return {
                ...l,
                assignedAgentId: agentId,
                assignedAgentName: agentName,
                status: l.status,
                updatedAt: now,
                activities: [
                  {
                    id: `act-${Date.now()}-${l.id}`,
                    type: 'assigned' as const,
                    description: `Assigned in bulk to ${agentName}`,
                    timestamp: now,
                    userName: currentUserName,
                  },
                  ...l.activities,
                ],
              };
            }
            return l;
          });

          const updatedAgents = state.agents.map((ag) =>
            ag.id === agentId
              ? { ...ag, activeLeadsCount: ag.activeLeadsCount + assignedCount }
              : ag
          );

          return {
            leads: updatedLeads,
            agents: updatedAgents,
          };
        });
      },

      addLeadNote: (leadId, noteText, authorName) => {
        const now = new Date().toISOString();
        const author = authorName || get().currentUser.name;

        set((state) => ({
          leads: state.leads.map((l) => {
            if (l.id !== leadId) return l;
            return {
              ...l,
              updatedAt: now,
              notes: [
                {
                  id: `note-${Date.now()}`,
                  text: noteText,
                  createdAt: now,
                  authorName: author,
                  stage: l.status,
                },
                ...l.notes,
              ],
              activities: [
                {
                  id: `act-${Date.now()}`,
                  type: 'note_added',
                  description: `Note added by ${author}: "${noteText.slice(0, 40)}${noteText.length > 40 ? '...' : ''}"`,
                  timestamp: now,
                  userName: author,
                },
                ...l.activities,
              ],
            };
          }),
        }));
      },

      updateLeadStatus: (leadId, newStatus) => {
        const now = new Date().toISOString();
        const currentUserName = get().currentUser.name;

        set((state) => {
          const lead = state.leads.find((l) => l.id === leadId);
          if (!lead || lead.status === newStatus) return state;

          const isNowConverted = newStatus === 'Won' && lead.status !== 'Won';

          let updatedAgents = state.agents;
          if (isNowConverted && lead.assignedAgentId) {
            updatedAgents = state.agents.map((ag) =>
              ag.id === lead.assignedAgentId
                ? {
                    ...ag,
                    convertedLeadsCount: ag.convertedLeadsCount + 1,
                    totalSalesValue: ag.totalSalesValue + (lead.budget || 0),
                  }
                : ag
            );
          }

          return {
            agents: updatedAgents,
            leads: state.leads.map((l) =>
              l.id === leadId
                ? {
                    ...l,
                    status: newStatus,
                    updatedAt: now,
                    activities: [
                      {
                        id: `act-${Date.now()}`,
                        type: 'status_change',
                        description: `Status changed to ${newStatus}`,
                        timestamp: now,
                        userName: currentUserName,
                      },
                      ...l.activities,
                    ],
                  }
                : l
            ),
          };
        });
      },

      importLeads: (imported) => {
        const now = new Date().toISOString();
        const currentUserName = get().currentUser.name;
        let count = 0;

        const newLeads: Lead[] = imported.map((item, idx) => {
          count++;
          const id = `LMS-${2000 + Math.floor(Math.random() * 8000)}`;
          return {
            id,
            name: item.name || `Imported Lead ${idx + 1}`,
            mobile: item.mobile || '+91 98000 00000',
            email: item.email || `lead${idx + 1}@imported.com`,
            interestedPropertyName: item.interestedPropertyName || 'General Inquiry',
            preferredLocation: item.preferredLocation || 'Bengaluru',
            budget: item.budget || 6000000,
            propertyType: item.propertyType || 'Apartment',
            leadSource: item.leadSource || 'Website',
            status: item.status || 'New',
            priority: item.priority || 'Medium',
            remarks: item.remarks || 'Imported via CSV batch',
            createdAt: now,
            updatedAt: now,
            notes: [],
            activities: [
              {
                id: `act-${Date.now()}-${idx}`,
                type: 'status_change',
                description: 'Imported via CSV file',
                timestamp: now,
                userName: currentUserName,
              },
            ],
          };
        });

        set((state) => ({
          leads: [...newLeads, ...state.leads],
        }));

        return count;
      },

      // Properties
      addProperty: (propertyData) => {
        const id = generateId('PROP');
        const newProp: Property = {
          id,
          name: propertyData.name || 'New Property',
          projectName: propertyData.projectName || 'Project',
          type: propertyData.type || 'Apartment',
          location: propertyData.location || 'Bengaluru',
          city: propertyData.city || 'Bengaluru',
          address: propertyData.address || '',
          sqft: propertyData.sqft || 1200,
          price: propertyData.price || 8500000,
          bedrooms: propertyData.bedrooms || 2,
          bathrooms: propertyData.bathrooms || 2,
          description: propertyData.description || '',
          images:
            propertyData.images && propertyData.images.length > 0
              ? propertyData.images
              : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80'],
          status: propertyData.status || 'Available',
          amenities: propertyData.amenities || ['24/7 Security', 'Power Backup'],
          reraNumber: propertyData.reraNumber,
        };

        set((state) => ({
          properties: [newProp, ...state.properties],
        }));

        return newProp;
      },

      updateProperty: (id, updates) => {
        set((state) => ({
          properties: state.properties.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        }));
      },

      deleteProperty: (id) => {
        set((state) => ({
          properties: state.properties.filter((p) => p.id !== id),
        }));
      },

      // Follow-ups
      addFollowUp: (data) => {
        const id = generateId('FLP');
        const now = new Date().toISOString();
        const newFlp: FollowUp = {
          id,
          leadId: data.leadId || '',
          leadName: data.leadName || 'Lead',
          propertyName: data.propertyName,
          agentId: data.agentId || get().currentUser.id,
          agentName: data.agentName || get().currentUser.name,
          scheduledDate: data.scheduledDate || now.split('T')[0],
          scheduledTime: data.scheduledTime || '11:00 AM',
          type: data.type || 'Call',
          status: data.status || 'Pending',
          notes: data.notes || '',
          createdAt: now,
        };

        set((state) => {
          // Also update lead's follow-up date and add note
          const updatedLeads = state.leads.map((l) =>
            l.id === newFlp.leadId
              ? {
                  ...l,
                  followUpDate: newFlp.scheduledDate,
                  status: l.status === 'New' ? ('Contacted' as LeadStatus) : l.status,
                  notes: [
                    {
                      id: `note-${Date.now()}`,
                      text: `Follow-up scheduled (${newFlp.type}) for ${newFlp.scheduledDate} ${newFlp.scheduledTime}: ${newFlp.notes}`,
                      createdAt: now,
                      authorName: newFlp.agentName,
                      stage: 'Contacted',
                    },
                    ...l.notes,
                  ],
                }
              : l
          );

          return {
            followUps: [newFlp, ...state.followUps],
            leads: updatedLeads,
          };
        });

        return newFlp;
      },

      updateFollowUp: (id, updates) => {
        set((state) => ({
          followUps: state.followUps.map((f) => (f.id === id ? { ...f, ...updates } : f)),
        }));
      },

      deleteFollowUp: (id) => {
        set((state) => ({
          followUps: state.followUps.filter((f) => f.id !== id),
        }));
      },

      // Site Visits
      addSiteVisit: (data) => {
        const id = generateId('VISIT');
        const now = new Date().toISOString();
        const newVisit: SiteVisit = {
          id,
          leadId: data.leadId || '',
          leadName: data.leadName || 'Lead',
          propertyId: data.propertyId || '',
          propertyName: data.propertyName || 'Property',
          agentId: data.agentId || get().currentUser.id,
          agentName: data.agentName || get().currentUser.name,
          visitDate: data.visitDate || now.split('T')[0],
          visitTime: data.visitTime || '11:00 AM',
          status: data.status || 'Scheduled',
          remarks: data.remarks || '',
          customerFeedback: data.customerFeedback,
          rating: data.rating,
          createdAt: now,
        };

        set((state) => {
          // Update lead status to Site Visit Scheduled
          const updatedLeads = state.leads.map((l) =>
            l.id === newVisit.leadId
              ? {
                  ...l,
                  status: 'Site Visit' as LeadStatus,
                  interestedPropertyId: newVisit.propertyId,
                  interestedPropertyName: newVisit.propertyName,
                  notes: [
                    {
                      id: `note-${Date.now()}`,
                      text: `Site visit scheduled at ${newVisit.propertyName} for ${newVisit.visitDate} at ${newVisit.visitTime}. ${newVisit.remarks || ''}`,
                      createdAt: now,
                      authorName: newVisit.agentName,
                      stage: 'Site Visit',
                    },
                    ...l.notes,
                  ],
                }
              : l
          );

          return {
            siteVisits: [newVisit, ...state.siteVisits],
            leads: updatedLeads,
          };
        });

        return newVisit;
      },

      updateSiteVisit: (id, updates) => {
        set((state) => {
          const visit = state.siteVisits.find((v) => v.id === id);
          if (!visit) return state;

          let updatedLeads = state.leads;
          if (updates.status === 'Completed' && visit.leadId) {
            updatedLeads = state.leads.map((l) =>
              l.id === visit.leadId ? { ...l, status: 'Site Visit' as LeadStatus } : l
            );
          }

          return {
            siteVisits: state.siteVisits.map((v) => (v.id === id ? { ...v, ...updates } : v)),
            leads: updatedLeads,
          };
        });
      },

      deleteSiteVisit: (id) => {
        set((state) => ({
          siteVisits: state.siteVisits.filter((s) => s.id !== id),
        }));
      },

      // Bookings
      addBooking: (data) => {
        const id = generateId('BKG');
        const now = new Date().toISOString();
        const agreementNumber = data.agreementNumber || `AGR-${Date.now().toString().slice(-6)}`;

        const newBooking: Booking = {
          id,
          leadId: data.leadId || '',
          customerName: data.customerName || 'Customer',
          customerPhone: data.customerPhone || '+91 90000 00000',
          customerEmail: data.customerEmail || 'customer@example.com',
          propertyId: data.propertyId || '',
          propertyName: data.propertyName || 'Property',
          propertyPrice: data.propertyPrice || 10000000,
          bookingAmount: data.bookingAmount || 500000,
          paymentStatus: data.paymentStatus || 'Completed',
          agentId: data.agentId || get().currentUser.id,
          agentName: data.agentName || get().currentUser.name,
          bookingDate: data.bookingDate || now.split('T')[0],
          status: data.status || 'Confirmed',
          agreementNumber,
          paymentMethod: data.paymentMethod || 'Bank Transfer',
          notes: data.notes,
        };

        set((state) => {
          // CRITICAL REQUIREMENT:
          // 1. Mark Property as "Booked"
          // 2. Mark Lead as "Booked"
          // 3. Update agent stats
          const updatedProperties = state.properties.map((p) =>
            p.id === newBooking.propertyId ? { ...p, status: 'Booked' as const } : p
          );

          const updatedLeads = state.leads.map((l) =>
            l.id === newBooking.leadId
              ? {
                  ...l,
                  status: 'Won' as LeadStatus,
                  notes: [
                    {
                      id: `note-${Date.now()}`,
                      text: `Booking confirmed! Agreement #${agreementNumber}. Booking Amount: ₹${newBooking.bookingAmount.toLocaleString('en-IN')}`,
                      createdAt: now,
                      authorName: newBooking.agentName,
                      stage: 'Won',
                    },
                    ...l.notes,
                  ],
                }
              : l
          );

          const updatedAgents = state.agents.map((ag) =>
            ag.id === newBooking.agentId
              ? {
                  ...ag,
                  convertedLeadsCount: ag.convertedLeadsCount + 1,
                  totalSalesValue: ag.totalSalesValue + newBooking.propertyPrice,
                }
              : ag
          );

          return {
            bookings: [newBooking, ...state.bookings],
            properties: updatedProperties,
            leads: updatedLeads,
            agents: updatedAgents,
          };
        });

        return newBooking;
      },

      updateBooking: (id, updates) => {
        set((state) => {
          const booking = state.bookings.find((b) => b.id === id);
          if (!booking) return state;

          // If booking status becomes Cancelled, reset property to Available
          let updatedProperties = state.properties;
          if (updates.status === 'Cancelled' && booking.propertyId) {
            updatedProperties = state.properties.map((p) =>
              p.id === booking.propertyId ? { ...p, status: 'Available' as const } : p
            );
          }

          return {
            bookings: state.bookings.map((b) => (b.id === id ? { ...b, ...updates } : b)),
            properties: updatedProperties,
          };
        });
      },

      deleteBooking: (id) => {
        set((state) => {
          const booking = state.bookings.find((b) => b.id === id);
          let updatedProps = state.properties;
          if (booking && booking.propertyId) {
            updatedProps = state.properties.map((p) =>
              p.id === booking.propertyId ? { ...p, status: 'Available' as const } : p
            );
          }

          return {
            bookings: state.bookings.filter((b) => b.id !== id),
            properties: updatedProps,
          };
        });
      },

      // Agents
      addAgent: (data) => {
        const id = generateId('AGT');
        const newAgent: SalesAgent = {
          id,
          name: data.name || 'New Executive',
          email: data.email || 'agent@kalaivani.in',
          phone: data.phone || '+91 90000 00000',
          role: data.role || 'Sales Executive',
          avatar:
            data.avatar ||
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          activeLeadsCount: 0,
          convertedLeadsCount: 0,
          totalSalesValue: 0,
          status: data.status || 'Active',
          maxLeadCapacity: data.maxLeadCapacity || 25,
          department: data.department || 'Residential Sales',
        };

        set((state) => ({
          agents: [...state.agents, newAgent],
        }));

        return newAgent;
      },

      updateAgent: (id, updates) => {
        set((state) => ({
          agents: state.agents.map((ag) => (ag.id === id ? { ...ag, ...updates } : ag)),
        }));
      },

      deleteAgent: (id) => {
        set((state) => ({
          agents: state.agents.filter((ag) => ag.id !== id),
        }));
      },

      // Reset Demo Data
      resetDemoData: () => {
        set({
          leads: initialLeads,
          properties: initialProperties,
          agents: initialSalesAgents,
          followUps: initialFollowUps,
          siteVisits: initialSiteVisits,
          bookings: initialBookings,
          currentUser: defaultUserSessions.admin,
          searchQuery: '',
        });
      },
    }),
    {
      name: 'real-estate-lms-storage',
      storage: createJSONStorage(() =>
        typeof window !== 'undefined'
          ? window.localStorage
          : {
              getItem: () => null,
              setItem: () => {},
              removeItem: () => {},
            }
      ),
    }
  )
);
