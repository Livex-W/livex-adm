import ExperienceFilters from '@/components/experiences/ExperienceFilters';
import ExperiencesTable from '@/components/experiences/ExperiencesTable';
import ExperienceDetails from '@/components/experiences/ExperienceDetails';

export default function ExperienceApprovalPage() {
    return (
        <div className="mx-auto max-w-6xl">
            {/* Encabezado */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Experience Approval</h1>
                <p className="mt-2 text-gray-600">
                    Review and approve new experiences to maintain platform quality.
                </p>
            </div>

            {/* Grid principal */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                {/* ----- Columna izquierda (filtros + tabla) */}
                <div className="lg:col-span-2">
                    <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
                        <div className="p-6">
                            <ExperienceFilters />
                        </div>

                        <div className="border-t border-gray-200">
                            <ExperiencesTable />
                        </div>
                    </div>
                </div>

                {/* ----- Columna derecha (detalle) */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24 rounded-lg border border-gray-200 bg-white shadow-sm">
                        <ExperienceDetails />
                    </div>
                </div>
            </div>
        </div>
    );
}
