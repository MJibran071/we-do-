import React, { useState } from 'react';
import { TeamMember, UserRole, AppMode } from '../types';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { UserPlus, Shield, Trash2, Mail, Check, X, User, Clock } from 'lucide-react';
import { getTheme } from '../utils/theme';
import { toast } from 'sonner';

interface TeamManagementProps {
    teamMembers: TeamMember[];
    setTeamMembers: React.Dispatch<React.SetStateAction<TeamMember[]>>;
    appMode: AppMode;
}

const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
    'Admin': 'Full access to all settings, billing, and team management.',
    'Agent': 'Can access Inbox, Calendar, and Operations. No access to Billing or Settings.',
    'Maintenance': 'Restricted access to Operations for assigned maintenance tasks only.',
    'Owner': 'Read-only access to Dashboards and Reports.'
};

export const TeamManagement: React.FC<TeamManagementProps> = ({ teamMembers, setTeamMembers, appMode }) => {
    const theme = getTheme(appMode);
    const [isInviteOpen, setIsInviteOpen] = useState(false);
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteRole, setInviteRole] = useState<UserRole>('Agent');
    const [isInviting, setIsInviting] = useState(false);

    const handleInvite = () => {
        if (!inviteEmail) return;
        setIsInviting(true);
        
        // Simulate API call
        setTimeout(() => {
            const newMember: TeamMember = {
                id: `tm-${Date.now()}`,
                name: inviteEmail.split('@')[0], // Placeholder name
                email: inviteEmail,
                role: inviteRole,
                status: 'Invited',
                avatar: `https://ui-avatars.com/api/?name=${inviteEmail}&background=random`,
                lastActive: undefined
            };
            
            setTeamMembers(prev => [...prev, newMember]);
            setIsInviting(false);
            setIsInviteOpen(false);
            setInviteEmail('');
            toast.success(`Invitation sent to ${inviteEmail}`);
        }, 1000);
    };

    const handleRemove = (id: string) => {
        if (confirm('Are you sure you want to remove this team member?')) {
            setTeamMembers(prev => prev.filter(m => m.id !== id));
            toast.success('Team member removed');
        }
    };

    const getRoleBadgeStyle = (role: UserRole) => {
        switch (role) {
            case 'Admin': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-800';
            case 'Agent': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800';
            case 'Maintenance': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 border-orange-200 dark:border-orange-800';
            case 'Owner': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <Card className="border-none shadow-sm bg-white dark:bg-gray-900">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div>
                        <CardTitle className="text-lg font-bold text-gray-900 dark:text-white">Team Members</CardTitle>
                        <CardDescription>Manage access and roles for your workspace.</CardDescription>
                    </div>
                    <Button onClick={() => setIsInviteOpen(true)} className={`${theme.bg} ${theme.hover} text-white`}>
                        <UserPlus className="w-4 h-4 mr-2" /> Invite Member
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 font-medium border-b border-gray-200 dark:border-gray-800">
                                <tr>
                                    <th className="px-6 py-3">User</th>
                                    <th className="px-6 py-3">Role</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {teamMembers.map(member => (
                                    <tr key={member.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <img src={member.avatar} alt={member.name} className="w-9 h-9 rounded-full object-cover bg-gray-200" />
                                                <div>
                                                    <div className="font-medium text-gray-900 dark:text-white">{member.name}</div>
                                                    <div className="text-xs text-gray-500">{member.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge variant="outline" className={`border ${getRoleBadgeStyle(member.role)}`}>
                                                {member.role}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-2 h-2 rounded-full ${member.status === 'Online' ? 'bg-green-500' : member.status === 'Busy' ? 'bg-red-500' : member.status === 'Invited' ? 'bg-yellow-500' : 'bg-gray-400'}`} />
                                                    <span className="text-gray-700 dark:text-gray-300">{member.status}</span>
                                                </div>
                                                {member.lastActive && (
                                                    <span className="text-[10px] text-gray-400 flex items-center gap-1 ml-4">
                                                        <Clock className="w-3 h-3" /> {new Date(member.lastActive).toLocaleDateString()}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                className="text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                onClick={() => handleRemove(member.id)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Invite Modal */}
            {isInviteOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
                    <Card className="w-full max-w-md animate-scale-in border-0 shadow-2xl" onClick={e => e.stopPropagation()}>
                        <CardHeader className="border-b border-gray-100 dark:border-gray-800 pb-4">
                            <div className="flex justify-between items-center">
                                <CardTitle>Invite Team Member</CardTitle>
                                <Button variant="ghost" size="icon" onClick={() => setIsInviteOpen(false)}><X className="w-5 h-5" /></Button>
                            </div>
                            <CardDescription>Send an invitation email to add a new user.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase mb-1.5 block">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                                    <Input 
                                        placeholder="colleague@company.com" 
                                        className="pl-9"
                                        value={inviteEmail}
                                        onChange={(e) => setInviteEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase mb-1.5 block">Assign Role</label>
                                <div className="grid grid-cols-1 gap-2">
                                    {(['Admin', 'Agent', 'Maintenance', 'Owner'] as UserRole[]).map((role) => (
                                        <div 
                                            key={role}
                                            onClick={() => setInviteRole(role)}
                                            className={`cursor-pointer p-3 rounded-lg border-2 transition-all flex items-start gap-3 ${inviteRole === role ? `border-${theme.name}-500 bg-${theme.name}-50 dark:bg-${theme.name}-900/10` : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'}`}
                                        >
                                            <div className={`mt-0.5 p-1 rounded-full ${inviteRole === role ? `${theme.bg} text-white` : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>
                                                {inviteRole === role ? <Check className="w-3 h-3" /> : <User className="w-3 h-3" />}
                                            </div>
                                            <div>
                                                <div className="font-semibold text-sm text-gray-900 dark:text-white">{role}</div>
                                                <div className="text-xs text-gray-500 mt-0.5 leading-tight">{ROLE_DESCRIPTIONS[role]}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-2">
                                <Button 
                                    onClick={handleInvite} 
                                    disabled={!inviteEmail || isInviting}
                                    className={`w-full ${theme.bg} ${theme.hover} text-white`}
                                >
                                    {isInviting ? 'Sending...' : 'Send Invitation'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
};