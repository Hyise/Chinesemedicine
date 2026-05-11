import React from 'react';
import type { SalesOrder, MonthlySales, HerbSales } from '@/types/global';
interface Props {
    monthlySales: MonthlySales[];
    herbSales: HerbSales[];
    orders: SalesOrder[];
}
declare const SalesChart: React.FC<Props>;
export default SalesChart;
