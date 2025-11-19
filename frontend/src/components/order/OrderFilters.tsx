'use client';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface OrderFiltersProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  timeFilter: string;
  setTimeFilter: (value: string) => void;
}

const TABS = [
  { label: 'Todos', value: 'ALL' },
  { label: 'Pendentes', value: 'PENDING' },
  { label: 'Em Preparo', value: 'PROCESSING' },
  { label: 'Entregues', value: 'DELIVERED' },
  { label: 'Cancelados', value: 'CANCELED' },
];

const PERIOD_OPTIONS = [
  { label: 'Desde sempre', value: 'ALL_TIME' },
  { label: 'Últimos 30 dias', value: '30_DAYS' },
  { label: 'Últimos 6 meses', value: '6_MONTHS' },
  { label: 'Último ano', value: '1_YEAR' },
];

export function OrderFilters({ activeTab, setActiveTab, timeFilter, setTimeFilter }: OrderFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div className="flex flex-wrap gap-2">
        {TABS.map((tab) => (
          <Button
            key={tab.value}
            variant="ghost"
            size="sm"
            onClick={() => setActiveTab(tab.value)}
            className={`rounded-full transition-colors duration-200 text-sm py-1.5 px-4
              ${activeTab === tab.value
                ? 'bg-[#EA7C69] hover:bg-[#d96a5b] text-[#1F1D2B] font-bold'
                : 'bg-[#2D303E] hover:bg-[#252836] text-[#889898]'
              }`
            }
          >
            {tab.label}
          </Button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-[#889898]">Período:</span>
        <Select value={timeFilter} onValueChange={setTimeFilter}>
          <SelectTrigger className="w-[190px] bg-[#2D303E] border-none text-white focus:ring-1 focus:ring-[#EA7C69]">
            <SelectValue placeholder="Período" />
          </SelectTrigger>
          <SelectContent className="bg-[#252836] border-[#2D303E] text-white">
            {PERIOD_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}