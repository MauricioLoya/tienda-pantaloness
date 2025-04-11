'use client';

import React, { useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

interface Region {
    id: string;
    name: string;
}

interface RegionSelectorProps {
    initialRegionId: string;
    regions: Region[];
}

export function RegionSelector({ initialRegionId, regions }: RegionSelectorProps) {
    const [selectedRegion, setSelectedRegion] = useState<string>(initialRegionId);
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newRegionId = e.target.value;
        setSelectedRegion(newRegionId);

        // Update URL search params
        const params = new URLSearchParams(searchParams.toString());
        params.set('regionId', newRegionId);

        // Redirect to update the page with new params
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="form-control w-full max-w-xs">
            <label className="label">
                <span className="label-text font-medium">Región</span>
            </label>
            <select
                className="select select-bordered w-full"
                value={selectedRegion}
                onChange={handleRegionChange}
            >
                {regions.map((region) => (
                    <option key={region.id} value={region.id}>
                        {region.name}
                    </option>
                ))}
            </select>
        </div>
    );
}