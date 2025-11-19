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
  { label: 'Todo tempo', value: 'ALL_TIME' },
  { label: 'Últimos 30 dias', value: '30_DAYS' },
  { label: 'Últimos 6 meses', value: '6_MONTHS' },
  { label: 'Último 1 ano', value: '1_YEAR' },
];

export function OrderFilters({ activeTab, setActiveTab, timeFilter, setTimeFilter }: OrderFiltersProps) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Abas de Status */}
      <div className="flex flex-wrap gap-2">
        {TABS.map((tab) => (
          <Button
            key={tab.value}
            variant={activeTab === tab.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab(tab.value)}
            className={`rounded-full ${
              activeTab === tab.value ? 'bg-red-600 hover:bg-red-700' : ''
            }`}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Filtro de Período */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-500">Período:</span>
        <Select value={timeFilter} onValueChange={setTimeFilter}>
          <SelectTrigger className="w-[180px] bg-white">
            <SelectValue placeholder="Período" />
          </SelectTrigger>
          <SelectContent>
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