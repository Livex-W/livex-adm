'use client';

import { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    Button,
} from '@/components/ui';
import { Download, DollarSign, Wallet, Users, TrendingUp, TrendingDown, Calendar, CheckCircle, BarChart3, Loader2, AlertCircle } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import apiClient from '@/lib/api-client';
import { toast } from 'sonner';
import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    Bar,
    BarChart,
    Cell,
    PieChart,
    Pie,
    Legend,
} from 'recharts';

interface ResortStats {
    summary: {
        totalBookingsMonth: number;
        totalRevenueCentsMonth: number;
        totalResortNetCentsMonth: number;
        totalGuestsMonth: number;
        checkedInMonth: number;
        pendingCheckIn: number;
    };
    comparison: {
        revenueChangePercent: number;
        bookingsChangePercent: number;
        guestsChangePercent: number;
    };
    topExperiences: {
        id: string;
        title: string;
        bookings: number;
        revenue_cents: number;
    }[];
    dailyBreakdown: {
        date: string;
        bookings: number;
        revenue_cents: number;
        guests: number;
    }[];
    bookingsBySource: {
        source: string;
        count: number;
        revenue_cents: number;
    }[];
    bookingsByStatus: {
        status: string;
        count: number;
    }[];
}

const CHART_COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
const SOURCE_LABELS: Record<string, string> = {
    'app': 'App Móvil',
    'bng': 'Panel Web',
    'direct': 'Directa',
};
const STATUS_LABELS: Record<string, string> = {
    'pending': 'Pendiente',
    'confirmed': 'Confirmada',
    'cancelled': 'Cancelada',
    'expired': 'Expirada',
    'refunded': 'Reembolsada',
};

export default function FinancesPage() {
    const [stats, setStats] = useState<ResortStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isExporting, setIsExporting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await apiClient.get<ResortStats>('/api/v1/resorts/my-resort/stats');
                setStats(response.data);
            } catch (err) {
                console.error('Error fetching stats:', err);
                setError('Error al cargar las estadísticas');
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, []);

    const handleExportReport = async () => {
        setIsExporting(true);
        try {
            const response = await apiClient.get('/api/v1/resorts/my-resort/export', {
                responseType: 'blob',
            });

            // Create download link
            const blob = new Blob([response.data], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `reporte-finanzas-${new Date().toISOString().slice(0, 10)}.xlsx`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Error exporting report:', err);
            toast.error('Error al exportar el reporte. Intente nuevamente.');
        } finally {
            setIsExporting(false);
        }
    };

    const formatDayName = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('es-CO', { weekday: 'short' });
    };

    const getChangeIcon = (percent: number) => {
        if (percent > 0) return <TrendingUp className="h-4 w-4 text-emerald-500" />;
        if (percent < 0) return <TrendingDown className="h-4 w-4 text-red-500" />;
        return null;
    };

    const getChangeColor = (percent: number) => {
        if (percent > 0) return 'text-emerald-600';
        if (percent < 0) return 'text-red-600';
        return 'text-slate-500';
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    if (error || !stats) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-center">
                <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
                <p className="text-slate-600">{error || 'No se pudieron cargar las estadísticas'}</p>
            </div>
        );
    }

    // Prepare chart data
    const dailyChartData = stats.dailyBreakdown.map(day => ({
        name: formatDayName(day.date),
        ingresos: day.revenue_cents,
        huespedes: day.guests,
    }));

    const sourceChartData = stats.bookingsBySource.map(source => ({
        name: SOURCE_LABELS[source.source] || source.source,
        value: source.count,
        revenue: source.revenue_cents,
    }));

    const statusChartData = stats.bookingsByStatus.map(status => ({
        name: STATUS_LABELS[status.status] || status.status,
        value: status.count,
    }));

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                        Finanzas y Estadísticas
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        Resumen de reservas, ingresos y métricas de tu resort.
                    </p>
                </div>
                <Button
                    variant="outline"
                    leftIcon={isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                    onClick={handleExportReport}
                    disabled={isExporting}
                >
                    {isExporting ? 'Exportando...' : 'Exportar Reporte'}
                </Button>
            </div>

            {/* Main Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Ingresos Neto (Mes)</CardTitle>
                        <DollarSign className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(stats.summary.totalResortNetCentsMonth)}</div>
                        <p className={`text-xs flex items-center gap-1 ${getChangeColor(stats.comparison.revenueChangePercent)}`}>
                            {getChangeIcon(stats.comparison.revenueChangePercent)}
                            {stats.comparison.revenueChangePercent >= 0 ? '+' : ''}{stats.comparison.revenueChangePercent}% vs mes anterior
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Reservas (Mes)</CardTitle>
                        <Calendar className="h-4 w-4 text-indigo-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.summary.totalBookingsMonth}</div>
                        <p className={`text-xs flex items-center gap-1 ${getChangeColor(stats.comparison.bookingsChangePercent)}`}>
                            {getChangeIcon(stats.comparison.bookingsChangePercent)}
                            {stats.comparison.bookingsChangePercent >= 0 ? '+' : ''}{stats.comparison.bookingsChangePercent}% vs mes anterior
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Huéspedes (Mes)</CardTitle>
                        <Users className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.summary.totalGuestsMonth}</div>
                        <p className={`text-xs flex items-center gap-1 ${getChangeColor(stats.comparison.guestsChangePercent)}`}>
                            {getChangeIcon(stats.comparison.guestsChangePercent)}
                            {stats.comparison.guestsChangePercent >= 0 ? '+' : ''}{stats.comparison.guestsChangePercent}% vs mes anterior
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Check-ins Pendientes</CardTitle>
                        <CheckCircle className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-amber-600">{stats.summary.pendingCheckIn}</div>
                        <p className="text-xs text-muted-foreground">
                            {stats.summary.checkedInMonth} check-ins este mes
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Row */}
            <div className="grid gap-4 md:grid-cols-2">
                {/* Daily Revenue Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="h-5 w-5 text-indigo-500" />
                            Ingresos Últimos 7 días
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        {dailyChartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={dailyChartData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis
                                        dataKey="name"
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => {
                                            if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
                                            if (value >= 1000) return `$${(value / 1000).toFixed(0)}k`;
                                            return `$${value}`;
                                        }}
                                    />
                                    <Tooltip
                                        formatter={(value) => typeof value === 'number' ? formatCurrency(value) : value}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="ingresos"
                                        stroke="#4f46e5"
                                        strokeWidth={2}
                                        dot={{ r: 4, fill: '#4f46e5' }}
                                        activeDot={{ r: 6 }}
                                        name="Ingresos"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full text-slate-400">
                                No hay datos para mostrar
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Booking Sources Pie Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Wallet className="h-5 w-5 text-emerald-500" />
                            Fuente de Reservas
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        {sourceChartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={sourceChartData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                        label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                                    >
                                        {sourceChartData.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(value, name) => [value, name]}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full text-slate-400">
                                No hay datos para mostrar
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Top Experiences and Booking Status */}
            <div className="grid gap-4 md:grid-cols-2">
                {/* Top Experiences */}
                <Card>
                    <CardHeader>
                        <CardTitle>Top Experiencias (Este Mes)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {stats.topExperiences.length > 0 ? (
                            <div className="space-y-4">
                                {stats.topExperiences.map((exp, index) => (
                                    <div key={exp.id} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm`}
                                                style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}>
                                                {index + 1}
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-900 dark:text-slate-100 line-clamp-1">{exp.title}</p>
                                                <p className="text-xs text-slate-500">{exp.bookings} reservas</p>
                                            </div>
                                        </div>
                                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                                            {formatCurrency(exp.revenue_cents)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center text-slate-400 py-8">
                                No hay experiencias con reservas este mes
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Booking Status Distribution */}
                <Card>
                    <CardHeader>
                        <CardTitle>Estado de Reservas (Total)</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[280px]">
                        {statusChartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={statusChartData} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                    <XAxis type="number" fontSize={12} />
                                    <YAxis
                                        dataKey="name"
                                        type="category"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        width={100}
                                    />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Bar dataKey="value" name="Reservas" radius={[0, 4, 4, 0]}>
                                        {statusChartData.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full text-slate-400">
                                No hay datos para mostrar
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Info Banner */}
            <div className="bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/50 rounded-lg p-4 flex gap-3 text-sm text-indigo-900 dark:text-indigo-300">
                <AlertCircle className="h-5 w-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                <p>
                    Las estadísticas se actualizan en tiempo real basándose en las reservas de tus experiencias.
                    Los pagos se procesan directamente en la app móvil.
                </p>
            </div>
        </div>
    );
}
