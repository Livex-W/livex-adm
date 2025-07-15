'use client';

import { User } from '@/stores/useUsersStore';
import { useToggleVip } from '@/hooks/users/useToggleVip';

export default function UserRow({ u }: { u: User }) {
    const toggleVip = useToggleVip();
    return (
        <tr className="bg-white border-b border-gray-200 hover:bg-gray-50">
            {/* Usuario + avatar */}
            <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                    <div
                        className="w-10 h-10 rounded-full bg-gray-200 bg-center bg-cover"
                        style={{ backgroundImage: `url('${u.avatar}')` }}
                    />
                    <div>
                        <div className="font-semibold text-[var(--text-primary)]">
                            {u.name}
                        </div>
                        <div className="text-sm text-[var(--text-secondary)]">
                            {u.email}
                        </div>
                    </div>
                </div>
            </td>

            <td className="px-6 py-4">{u.nationality}</td>
            <td className="px-6 py-4">{u.createdAt}</td>

            {/* Chip VIP */}
            <td className="px-6 py-4">
                {toggleVip.isPending && toggleVip.variables?.id === u.id ? (
                    <span className="text-gray-400 text-sm">Saving…</span>
                ) : u.vip === 'VIP' ? (
                    <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        VIP
                    </span>
                ) : (
                    <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        Standard
                    </span>
                )}
            </td>

            {/* Acción */}
            <td className="px-6 py-4 text-right">
                {u.vip === 'VIP' ? (
                    <button
                        className="font-medium text-red-500 hover:cursor-pointer"
                        onClick={() => toggleVip.mutate({ id: u.id, isVip: false })}
                    >
                        Revoke VIP Status
                    </button>
                ) : (
                    <button
                        className="font-medium text-[var(--primary-color)] hover:cursor-pointer"
                        onClick={() => toggleVip.mutate({ id: u.id, isVip: true })}
                    >
                        Assign VIP Status
                    </button>
                )}
            </td>
        </tr>
    );
}
