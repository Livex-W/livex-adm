'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAdminStore } from '@/lib/admin-store';
import { Card, CardContent, CardHeader, CardTitle, StatusBadge, Button } from '@/components/ui';
import {
    ArrowLeft,
    Building2,
    Mail,
    Phone,
    MapPin,
    Globe,
    FileText,
    CheckCircle,
    XCircle,
    Loader2,
    ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import { ROUTES } from '@/routes';
import { ResortProfile } from '@/types';
import { formatDate } from '@/lib/utils';

export default function ResortDetailPage() {
    const params = useParams();
    const resortId = params.id as string;

    const { fetchResortById, approveResort, rejectResort, approveDocument, rejectDocument } = useAdminStore();

    const [resort, setResort] = useState<ResortProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectReason, setRejectReason] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [showDocRejectModal, setShowDocRejectModal] = useState(false);
    const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
    const [docRejectReason, setDocRejectReason] = useState('');

    useEffect(() => {
        const loadResort = async () => {
            try {
                const data = await fetchResortById(resortId);
                setResort(data);
            } catch (err) {
                setError('Error al cargar el resort');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadResort();
    }, [resortId, fetchResortById]);

    const handleApprove = async () => {
        setActionLoading(true);
        try {
            await approveResort(resortId);
            // Reload resort data
            const data = await fetchResortById(resortId);
            setResort(data);
        } catch (err) {
            setError('Error al aprobar el resort');
            console.error(err);
        } finally {
            setActionLoading(false);
        }
    };

    const handleReject = async () => {
        if (!rejectReason.trim()) {
            setError('Debes proporcionar un motivo de rechazo');
            return;
        }
        setActionLoading(true);
        try {
            await rejectResort(resortId, rejectReason);
            // Reload resort data
            const data = await fetchResortById(resortId);
            setResort(data);
            setShowRejectModal(false);
            setRejectReason('');
        } catch (err) {
            setError('Error al rechazar el resort');
            console.error(err);
        } finally {
            setActionLoading(false);
        }
    };

    const handleDocumentApprove = async (docId: string) => {
        setActionLoading(true);
        try {
            await approveDocument(docId);
            const data = await fetchResortById(resortId);
            setResort(data);
        } catch (err) {
            setError('Error al aprobar el documento');
            console.error(err);
        } finally {
            setActionLoading(false);
        }
    };

    const handleDocumentReject = (docId: string) => {
        setSelectedDocId(docId);
        setShowDocRejectModal(true);
    };

    const confirmDocumentReject = async () => {
        if (!docRejectReason.trim() || !selectedDocId) {
            setError('Debes proporcionar un motivo de rechazo');
            return;
        }
        setActionLoading(true);
        try {
            await rejectDocument(selectedDocId, docRejectReason);
            const data = await fetchResortById(resortId);
            setResort(data);
            setShowDocRejectModal(false);
            setSelectedDocId(null);
            setDocRejectReason('');
        } catch (err) {
            setError('Error al rechazar el documento');
            console.error(err);
        } finally {
            setActionLoading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        // Map resort status to StatusBadge expected statuses
        const statusMap: Record<string, string> = {
            'approved': 'completed',
            'under_review': 'under_review',
            'rejected': 'rejected',
            'draft': 'draft',
        };
        return <StatusBadge status={statusMap[status] || 'draft'} />;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            </div>
        );
    }

    if (!resort) {
        return (
            <div className="text-center py-12">
                <Building2 className="h-12 w-12 mx-auto text-slate-300 mb-4" />
                <p className="text-slate-500">Resort no encontrado</p>
                <Link href={ROUTES.DASHBOARD.RESORTS.LIST}>
                    <Button variant="outline" className="mt-4">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Volver a resorts
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href={ROUTES.DASHBOARD.RESORTS.LIST}>
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                                {resort.name || 'Sin nombre'}
                            </h1>
                            {getStatusBadge(resort.status)}
                        </div>
                        <p className="text-slate-500 mt-1">
                            Creado el {formatDate(resort.created_at)}
                        </p>
                    </div>
                </div>

                {/* Action Buttons */}
                {resort.status === 'under_review' && (
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setShowRejectModal(true)}
                            disabled={actionLoading}
                            className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                            <XCircle className="h-4 w-4 mr-2" />
                            Rechazar
                        </Button>
                        <Button
                            onClick={handleApprove}
                            disabled={actionLoading}
                            isLoading={actionLoading}
                        >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Aprobar
                        </Button>
                    </div>
                )}
            </div>

            {/* Error Message */}
            {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
                    {error}
                </div>
            )}

            {/* Rejection Reason (if rejected) */}
            {resort.status === 'rejected' && resort.rejection_reason && (
                <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
                    <CardContent className="p-4">
                        <p className="text-sm font-medium text-red-700 dark:text-red-400">
                            Motivo de rechazo:
                        </p>
                        <p className="text-red-600 dark:text-red-300 mt-1">
                            {resort.rejection_reason}
                        </p>
                    </CardContent>
                </Card>
            )}

            <div className="grid gap-6 md:grid-cols-2">
                {/* Basic Info */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Building2 className="h-5 w-5" />
                            Información General
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-3">
                            <div className="flex items-center gap-3">
                                <Mail className="h-4 w-4 text-slate-400" />
                                <span className="text-slate-600 dark:text-slate-300">
                                    {resort.contact_email || 'Sin email'}
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="h-4 w-4 text-slate-400" />
                                <span className="text-slate-600 dark:text-slate-300">
                                    {resort.contact_phone || 'Sin teléfono'}
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <MapPin className="h-4 w-4 text-slate-400" />
                                <span className="text-slate-600 dark:text-slate-300">
                                    {[resort.address_line, resort.city, resort.country].filter(Boolean).join(', ') || 'Sin ubicación'}
                                </span>
                            </div>
                            {resort.website && (
                                <div className="flex items-center gap-3">
                                    <Globe className="h-4 w-4 text-slate-400" />
                                    <a
                                        href={resort.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary hover:underline flex items-center gap-1"
                                    >
                                        {resort.website}
                                        <ExternalLink className="h-3 w-3" />
                                    </a>
                                </div>
                            )}
                        </div>

                        {resort.description && (
                            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                                <p className="text-sm text-slate-500 mb-2">Descripción</p>
                                <p className="text-slate-700 dark:text-slate-300">
                                    {resort.description}
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Legal Info */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Información Legal
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-3">
                            <div>
                                <span className="text-sm text-slate-500">NIT:</span>
                                <p className="font-medium text-slate-900 dark:text-slate-100">
                                    {resort.nit || 'No registrado'}
                                </p>
                            </div>
                            <div>
                                <span className="text-sm text-slate-500">RNT:</span>
                                <p className="font-medium text-slate-900 dark:text-slate-100">
                                    {resort.rnt || 'No registrado'}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Documents */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Documentos ({resort.documents?.length || 0})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {resort.documents && resort.documents.length > 0 ? (
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {resort.documents.map((doc) => (
                                    <div
                                        key={doc.id}
                                        className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg space-y-3"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className="font-medium text-slate-900 dark:text-slate-100 capitalize">
                                                    {doc.doc_type.replace(/_/g, ' ')}
                                                </p>
                                                <p className="text-xs text-slate-500">
                                                    {formatDate(doc.uploaded_at)}
                                                </p>
                                            </div>
                                            <StatusBadge status={doc.status === 'uploaded' ? 'under_review' : doc.status} />
                                        </div>

                                        {doc.rejection_reason && (
                                            <p className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 p-2 rounded">
                                                {doc.rejection_reason}
                                            </p>
                                        )}

                                        <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
                                            <a
                                                href={doc.file_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-primary hover:underline text-sm flex items-center gap-1"
                                            >
                                                Ver
                                                <ExternalLink className="h-3 w-3" />
                                            </a>

                                            {doc.status !== 'approved' && doc.status !== 'rejected' && (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleDocumentReject(doc.id)}
                                                        className="cursor-pointer text-xs text-red-600 hover:text-red-700 flex items-center gap-1"
                                                    >
                                                        <XCircle className="h-3 w-3" />
                                                        Rechazar
                                                    </button>
                                                    <button
                                                        onClick={() => handleDocumentApprove(doc.id)}
                                                        className="cursor-pointer text-xs text-green-600 hover:text-green-700 flex items-center gap-1"
                                                    >
                                                        <CheckCircle className="h-3 w-3" />
                                                        Aprobar
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-slate-500 text-center py-8">
                                No hay documentos subidos
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Reject Modal */}
            {showRejectModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div
                        className="absolute inset-0 bg-black/50"
                        onClick={() => setShowRejectModal(false)}
                    />
                    <div className="relative bg-white dark:bg-slate-900 rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                            Rechazar Resort
                        </h3>
                        <p className="text-slate-500 mb-4">
                            Por favor proporciona un motivo para el rechazo. Este será visible para el propietario del resort.
                        </p>
                        <textarea
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="Motivo del rechazo..."
                            className="w-full p-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 resize-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            rows={4}
                        />
                        <div className="flex gap-3 mt-4">
                            <Button
                                variant="outline"
                                onClick={() => setShowRejectModal(false)}
                                className="flex-1"
                            >
                                Cancelar
                            </Button>
                            <Button
                                onClick={handleReject}
                                disabled={actionLoading || !rejectReason.trim()}
                                isLoading={actionLoading}
                                className="flex-1 bg-red-600 hover:bg-red-700"
                            >
                                Rechazar
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Document Reject Modal */}
            {showDocRejectModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div
                        className="absolute inset-0 bg-black/50"
                        onClick={() => setShowDocRejectModal(false)}
                    />
                    <div className="relative bg-white dark:bg-slate-900 rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                            Rechazar Documento
                        </h3>
                        <p className="text-slate-500 mb-4">
                            Por favor proporciona un motivo para el rechazo del documento.
                        </p>
                        <textarea
                            value={docRejectReason}
                            onChange={(e) => setDocRejectReason(e.target.value)}
                            placeholder="Motivo del rechazo..."
                            className="w-full p-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 resize-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            rows={4}
                        />
                        <div className="flex gap-3 mt-4">
                            <Button
                                variant="outline"
                                onClick={() => setShowDocRejectModal(false)}
                                className="flex-1"
                            >
                                Cancelar
                            </Button>
                            <Button
                                onClick={confirmDocumentReject}
                                disabled={actionLoading || !docRejectReason.trim()}
                                isLoading={actionLoading}
                                className="flex-1 bg-red-600 hover:bg-red-700"
                            >
                                Rechazar
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
