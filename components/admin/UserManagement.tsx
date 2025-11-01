
import React, { useState, useMemo } from 'react';
import type { User, SubscriptionStatus, UserGroup } from '../../types';
import { MOCK_USERS } from './adminMockData';
import { PencilIcon, TrashIcon } from '../icons/Icons';

const getStatusColor = (status: SubscriptionStatus) => {
    switch (status) {
        case 'Active': return 'bg-green-500/20 text-green-300';
        case 'Expired': return 'bg-rose-500/20 text-rose-300';
        case 'Lifetime': return 'bg-amber-500/20 text-amber-300';
    }
}

export const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<User[]>(MOCK_USERS);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredUsers = useMemo(() => {
        return users.filter(user =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [users, searchTerm]);

    const handleEdit = (user: User) => {
        alert(`Simulating edit for user: ${user.name}. In a real app, this would open a form.`);
    };
    
    const handleDelete = (userId: string) => {
        if (window.confirm("Are you sure you want to delete this user? This is a simulation.")) {
            setUsers(prev => prev.filter(u => u.id !== userId));
        }
    };

    return (
        <div>
            <h2 className="text-3xl font-bold text-slate-100 mb-6">Client Management</h2>
            
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full max-w-md bg-slate-800 border border-slate-700 rounded-lg p-3 focus:ring-amber-500 focus:border-amber-500 placeholder-slate-500"
                />
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="border-b border-slate-700 text-sm text-slate-400">
                        <tr>
                            <th className="p-4">Name</th>
                            <th className="p-4">Email</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Group</th>
                            <th className="p-4">Sessions</th>
                            <th className="p-4">Join Date</th>
                            <th className="p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                        {filteredUsers.map(user => (
                            <tr key={user.id} className="hover:bg-slate-800">
                                <td className="p-4 font-semibold">{user.name}</td>
                                <td className="p-4 text-slate-400">{user.email}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.subscriptionStatus)}`}>
                                        {user.subscriptionStatus}
                                    </span>
                                </td>
                                <td className="p-4 text-slate-400">{user.group}</td>
                                <td className="p-4 text-center">{user.sessionCount}</td>
                                <td className="p-4 text-slate-400">{user.joinDate}</td>
                                <td className="p-4">
                                    <div className="flex space-x-2">
                                        <button onClick={() => handleEdit(user)} className="text-slate-400 hover:text-amber-400 p-2"><PencilIcon className="w-5 h-5"/></button>
                                        <button onClick={() => handleDelete(user.id)} className="text-slate-400 hover:text-rose-400 p-2"><TrashIcon className="w-5 h-5"/></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
