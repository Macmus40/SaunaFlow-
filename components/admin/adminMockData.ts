
import type { User, SubscriptionPlan } from '../../types';

export const MOCK_USERS: User[] = [
  {
    id: 'user-001',
    name: 'Alice Johnson',
    email: 'alice.j@example.com',
    joinDate: '2024-05-10',
    subscriptionStatus: 'Active',
    group: 'Individual',
    sessionCount: 25,
  },
  {
    id: 'user-002',
    name: 'Bob Williams',
    email: 'bob.w@corporate.com',
    joinDate: '2024-03-22',
    subscriptionStatus: 'Active',
    group: 'Corporate',
    sessionCount: 42,
  },
  {
    id: 'user-003',
    name: 'Charlie Brown',
    email: 'charlie.b@example.com',
    joinDate: '2023-11-05',
    subscriptionStatus: 'Expired',
    group: 'Individual',
    sessionCount: 8,
  },
  {
    id: 'user-004',
    name: 'Diana Prince',
    email: 'diana.p@example.com',
    joinDate: '2024-01-15',
    subscriptionStatus: 'Lifetime',
    group: 'Friends',
    sessionCount: 78,
  },
  {
    id: 'user-005',
    name: 'Ethan Hunt',
    email: 'ethan.h@corporate.com',
    joinDate: '2024-03-22',
    subscriptionStatus: 'Active',
    group: 'Corporate',
    sessionCount: 35,
  },
];

export const MOCK_PLANS: SubscriptionPlan[] = [
    {
        id: 'plan-monthly',
        name: 'Monthly Subscription',
        price: 9.99,
        billingCycle: 'monthly',
    },
    {
        id: 'plan-yearly',
        name: 'Yearly Subscription',
        price: 99.99,
        billingCycle: 'yearly',
    },
    {
        id: 'plan-lifetime',
        name: 'Lifetime License',
        price: 249.99,
        billingCycle: 'once',
    },
];
