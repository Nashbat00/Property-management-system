// Demo data used when Supabase is not configured.
// Mirrors the 6-table schema described in ARCHITECTURE.md.

export const demoUsers = [
  {
    id: 'u-mgr-1',
    email: 'manager@homelink.demo',
    password: 'demo1234',
    fullName: 'Ahmet Yilmaz',
    role: 'manager',
    unitId: null,
  },
  {
    id: 'u-res-1',
    email: 'resident@homelink.demo',
    password: 'demo1234',
    fullName: 'Mehmet Demir',
    role: 'resident',
    unitId: 'unit-101',
  },
  {
    id: 'u-res-2',
    email: 'ayse@homelink.demo',
    password: 'demo1234',
    fullName: 'Ayse Kaya',
    role: 'resident',
    unitId: 'unit-102',
  },
];

export const demoUnits = [
  { id: 'unit-101', unitNumber: '101', floor: 1, currentBalance: 250, residentId: 'u-res-1' },
  { id: 'unit-102', unitNumber: '102', floor: 1, currentBalance: 0, residentId: 'u-res-2' },
  { id: 'unit-201', unitNumber: '201', floor: 2, currentBalance: 500, residentId: null },
  { id: 'unit-202', unitNumber: '202', floor: 2, currentBalance: 250, residentId: null },
];

export const demoDues = [
  { id: 'dues-1', unitId: 'unit-101', amount: 250, month: '2026-04', createdAt: '2026-04-01T09:00:00Z' },
  { id: 'dues-2', unitId: 'unit-102', amount: 250, month: '2026-04', createdAt: '2026-04-01T09:00:00Z' },
  { id: 'dues-3', unitId: 'unit-201', amount: 250, month: '2026-04', createdAt: '2026-04-01T09:00:00Z' },
  { id: 'dues-4', unitId: 'unit-202', amount: 250, month: '2026-04', createdAt: '2026-04-01T09:00:00Z' },
  { id: 'dues-5', unitId: 'unit-201', amount: 250, month: '2026-03', createdAt: '2026-03-01T09:00:00Z' },
];

export const demoPayments = [
  {
    id: 'pay-1',
    unitId: 'unit-102',
    residentId: 'u-res-2',
    amount: 250,
    paymentDate: '2026-04-05',
    month: '2026-04',
    status: 'confirmed',
  },
  {
    id: 'pay-2',
    unitId: 'unit-101',
    residentId: 'u-res-1',
    amount: 250,
    paymentDate: '2026-04-08',
    month: '2026-04',
    status: 'pending',
  },
];

export const demoMaintenanceRequests = [
  {
    id: 'mr-1',
    unitId: 'unit-101',
    residentId: 'u-res-1',
    description: 'Kitchen sink is leaking. Water drips constantly.',
    status: 'pending',
    createdAt: '2026-04-15T10:30:00Z',
    resolvedAt: null,
  },
  {
    id: 'mr-2',
    unitId: 'unit-102',
    residentId: 'u-res-2',
    description: 'Hallway light bulb is broken on the first floor.',
    status: 'resolved',
    createdAt: '2026-04-02T14:00:00Z',
    resolvedAt: '2026-04-04T09:00:00Z',
  },
];

export const demoAnnouncements = [
  {
    id: 'ann-1',
    title: 'Water Maintenance Schedule',
    content: 'The water supply will be temporarily turned off on April 28 between 09:00 and 12:00 for scheduled maintenance.',
    createdAt: '2026-04-20T08:00:00Z',
    createdBy: 'u-mgr-1',
  },
  {
    id: 'ann-2',
    title: 'Monthly Building Meeting',
    content: 'The monthly building meeting will be held on May 5 at 19:00 in the lobby. All residents are welcome.',
    createdAt: '2026-04-18T11:30:00Z',
    createdBy: 'u-mgr-1',
  },
];
