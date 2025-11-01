
import React, { useState } from 'react';
import type { SubscriptionPlan } from '../../types';
import { MOCK_PLANS } from './adminMockData';
import { PencilIcon } from '../icons/Icons';

export const SubscriptionManagement: React.FC = () => {
    const [plans, setPlans] = useState<SubscriptionPlan[]>(MOCK_PLANS);

    const handleEdit = (plan: SubscriptionPlan) => {
        const newPrice = prompt(`Simulating price change for "${plan.name}".\nEnter new price:`, String(plan.price));
        if (newPrice && !isNaN(parseFloat(newPrice))) {
            const updatedPrice = parseFloat(newPrice);
            setPlans(prevPlans => prevPlans.map(p => p.id === plan.id ? { ...p, price: updatedPrice } : p));
        }
    };
    
    const handleAddPlan = () => {
        alert("Simulating adding a new plan. In a real app, this would open a detailed form.");
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-slate-100">Subscription Plans</h2>
                <button
                    onClick={handleAddPlan}
                    className="bg-amber-500 text-slate-900 font-semibold py-2 px-5 rounded-lg hover:bg-amber-400 transition-colors"
                >
                    Add New Plan
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {plans.map(plan => (
                    <div key={plan.id} className="bg-slate-800 border border-slate-700 rounded-xl p-6 flex flex-col">
                        <div className="flex-grow">
                            <h3 className="text-xl font-bold text-amber-400 mb-2">{plan.name}</h3>
                            <div className="text-4xl font-bold mb-4">
                                ${plan.price.toFixed(2)}
                                <span className="text-base font-normal text-slate-400 ml-1">
                                    / {plan.billingCycle === 'once' ? 'lifetime' : plan.billingCycle}
                                </span>
                            </div>
                        </div>
                        <button 
                            onClick={() => handleEdit(plan)}
                            className="mt-6 w-full bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold py-3 px-5 rounded-lg transition-colors flex items-center justify-center space-x-2"
                        >
                            <PencilIcon className="w-5 h-5" />
                            <span>Edit Plan</span>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};
