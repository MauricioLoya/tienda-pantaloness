'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import dayjs from 'dayjs';
import { FaFilter } from 'react-icons/fa';
import { RegionItem } from '@/modules/region/definitions';

type Props = {
    regions: RegionItem[];
}


const AdminFilters = ({ regions }: Props) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Get values from URL or use defaults
    const defaultRegion = searchParams?.get('regionId') || 'mx';
    const defaultStartDate = searchParams?.get('startDate') || dayjs().subtract(30, 'day').format('YYYY-MM-DD');
    const defaultEndDate = searchParams?.get('endDate') || dayjs().format('YYYY-MM-DD');

    // Set up state for filters
    const [region, setRegion] = useState(defaultRegion);
    const [startDate, setStartDate] = useState(defaultStartDate);
    const [endDate, setEndDate] = useState(defaultEndDate);

    // Function to update URL with filters
    const applyFilters = () => {
        const params = new URLSearchParams();
        params.set('regionId', region);
        params.set('startDate', startDate);
        params.set('endDate', endDate);
        router.push(`?${params.toString()}`);
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-sm mb-6">
            <div className="flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Región
                    </label>
                    <select
                        className="select select-bordered w-full"
                        value={region}
                        onChange={(e) => setRegion(e.target.value)}
                    >
                        {regions.map((region) => (
                            <option key={region.code} value={region.code}>
                                {region.name} {region.flag}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fecha inicial
                    </label>
                    <input
                        type="date"
                        className="input input-bordered w-full"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                </div>
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fecha final
                    </label>
                    <input
                        type="date"
                        className="input input-bordered w-full"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </div>
                <div>
                    <button
                        className="btn btn-primary"
                        onClick={applyFilters}
                    >
                        <FaFilter className="mr-2" />
                        Aplicar filtros
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminFilters;