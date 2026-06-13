"use client";

import { DEPARTMENTS, LOCATION_TYPES, ROLE_LEVELS } from "@/lib/constants";
import { Department, LocationType, RoleLevel } from "@/lib/types";

interface Filters {
  department: Department | "";
  locationType: LocationType | "";
  roleLevel: RoleLevel | "";
  search: string;
}

interface FilterBarProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
  jobCount: number;
}

export default function FilterBar({ filters, onChange, jobCount }: FilterBarProps) {
  const update = (key: keyof Filters, value: string) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <div className="border-b border-white/10 pb-6 mb-8">
      <div className="flex flex-wrap gap-3 items-center">
        <input
          type="text"
          placeholder="Search..."
          value={filters.search}
          onChange={(e) => update("search", e.target.value)}
          className="text-sm w-48 border-white/20"
        />
        {(
          [
            { key: "department" as const, opts: DEPARTMENTS, label: "All Departments" },
            { key: "locationType" as const, opts: LOCATION_TYPES, label: "All Locations" },
            { key: "roleLevel" as const, opts: ROLE_LEVELS, label: "All Levels" },
          ] as const
        ).map(({ key, opts, label }) => (
          <select
            key={key}
            value={filters[key]}
            onChange={(e) => update(key, e.target.value)}
            className="text-sm border-white/20"
          >
            <option value="">{label}</option>
            {opts.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        ))}
        <span className="text-xs text-muted ml-auto uppercase tracking-widest font-headline">
          {jobCount} role{jobCount !== 1 ? "s" : ""}
        </span>
      </div>
    </div>
  );
}

export type { Filters };
