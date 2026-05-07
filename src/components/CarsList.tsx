import { CarBrand } from '../types';
import CarBrandItem from './CarBrandItem';

interface CarsListProps {
    carsData: CarBrand[];
    onUpdateBrand: (brandId: number, updates: Partial<CarBrand>) => void;
    onUpdateModel: (brandId: number, modelId: number, updates: Partial<CarBrand['models'][0]>) => void;
    onUpdateService: (
        brandId: number,
        modelId: number,
        serviceId: number,
        updates: Partial<CarBrand['models'][0]['services'][0]>
    ) => void;
}

function CarsList({ carsData, onUpdateBrand, onUpdateModel, onUpdateService }: CarsListProps) {
    return (
        <div className="cars-list-container">
            <div className="cars-list-title">🚗 Автомобили</div>
            <div className="cars-list">
                {carsData.map((brand) => (
                    <CarBrandItem
                        key={brand.id}
                        brand={brand}
                        onUpdateBrand={onUpdateBrand}
                        onUpdateModel={onUpdateModel}
                        onUpdateService={onUpdateService}
                    />
                ))}
            </div>
        </div>
    );
}

export default CarsList;