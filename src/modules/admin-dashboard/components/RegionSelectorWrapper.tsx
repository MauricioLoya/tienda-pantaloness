import { RegionRepository } from '@/modules/region/definitions';
import { RegionSelector } from './RegionSelector';

export async function RegionSelectorWrapper({ initialRegionId }: { initialRegionId: string }) {
    const regionRepository = new RegionRepository();
    const regions = await regionRepository.getAll();

    const transformedRegions = regions.map(region => ({
        id: region.code,
        name: region.name
    }));

    return <RegionSelector initialRegionId={initialRegionId} regions={transformedRegions} />;
}