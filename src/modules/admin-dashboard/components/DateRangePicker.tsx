'use client';

import React, { useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

export function DateRangePicker({
    initialStartDate,
    initialEndDate
}: {
    initialStartDate: string,
    initialEndDate: string
}) {
    const [startDate, setStartDate] = useState<string>(initialStartDate);
    const [endDate, setEndDate] = useState<string>(initialEndDate);
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const handleApplyFilters = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('startDate', startDate);
        params.set('endDate', endDate);

        // Redirect to update the page with new params
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <>
            <div className="form-control">
                <label className="label">
                    <span className="label-text font-medium">Fecha inicial</span>
                </label>
                <input
                    type="date"
                    className="input input-bordered"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />
            </div>

            <div className="form-control">
                <label className="label">
                    <span className="label-text font-medium">Fecha final</span>
                </label>
                <input
                    type="date"
                    className="input input-bordered"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />
            </div>

            <button className="btn btn-primary" onClick={handleApplyFilters}>
                Aplicar filtros
            </button>
        </>
    );
}