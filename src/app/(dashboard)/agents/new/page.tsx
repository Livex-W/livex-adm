'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui';
import { ArrowLeft, UserPlus, Link as LinkIcon } from 'lucide-react';
import { useResortStore } from '@/lib/resort-store';
import NewAgentForm from '@/components/agent/NewAgentForm';
import AgentLinkTable from '@/components/agent/AgentLinkTable';

export default function NewAgentPage() {
    const router = useRouter();
    const { resort, fetchMyResort, isLoading: resortLoading } = useResortStore();
    const [activeTab, setActiveTab] = useState<'create' | 'link'>('create');

    // Fetch resort if not available
    useEffect(() => {
        if (!resort) {
            fetchMyResort();
        }
    }, [resort, fetchMyResort]);

    if (resortLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-10 w-10 p-0"
                    onClick={() => router.back()}
                >
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                        Gestión de Agentes
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        Registra o vincula vendedores para tus experiencias.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                <button
                    onClick={() => setActiveTab('create')}
                    className={`
                        flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-md transition-all
                        ${activeTab === 'create'
                            ? 'bg-white dark:bg-slate-900 text-primary shadow-sm'
                            : 'cursor-pointer text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}
                    `}
                >
                    <UserPlus className="h-4 w-4" />
                    Crear Nuevo
                </button>
                <button
                    onClick={() => setActiveTab('link')}
                    className={`
                        flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-md transition-all
                        ${activeTab === 'link'
                            ? 'bg-white dark:bg-slate-900 text-primary shadow-sm'
                            : 'cursor-pointer text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}
                    `}
                >
                    <LinkIcon className="h-4 w-4" />
                    Vincular Existente
                </button>
            </div>

            <div className="min-h-[400px]">
                {activeTab === 'create' ? <NewAgentForm /> : <AgentLinkTable />}
            </div>
        </div>
    );
}
