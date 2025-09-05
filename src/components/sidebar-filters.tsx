"use client";

import { useState } from "react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { SearchIcon } from "lucide-react";
import { cn } from "~/lib/utils";

interface FilterOption {
  id: string;
  label: string;
  icon?: string;
  value: string;
  type: "single" | "multi";
  active?: boolean;
}

interface FilterCategory {
  title: string;
  options: FilterOption[];
  layout?: "full" | "half" | "pair";
}

interface SidebarFiltersProps {
  onFilterChange?: (filters: Record<string, string[]>) => void;
  className?: string;
}

export function SidebarFilters({ onFilterChange, className }: SidebarFiltersProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({
    temperature: ["warm"],
    region: ["asia"],
  });

  const handleFilterToggle = (category: string, value: string, isMulti: boolean = false) => {
    setActiveFilters((prev) => {
      const currentValues = prev[category] || [];
      let newValues: string[];

      if (isMulti) {
        if (currentValues.includes(value)) {
          newValues = currentValues.filter((v) => v !== value);
        } else {
          newValues = [...currentValues, value];
        }
      } else {
        newValues = currentValues.includes(value) ? [] : [value];
      }

      const updated = {
        ...prev,
        [category]: newValues,
      };

      onFilterChange?.(updated);
      return updated;
    });
  };

  const filterCategories: FilterCategory[] = [
    {
      title: "What",
      options: [
        // Temperature
        { id: "cold", label: "🍦 Cold now", value: "cold", type: "single" },
        { id: "mild", label: "🌤 Mild now", value: "mild", type: "single" },
        { id: "warm", label: "☀️ Warm now", value: "warm", type: "single", active: true },

        // Cost
        { id: "cheap", label: "💵<$2K/mo", value: "cheap", type: "single" },
        { id: "mid", label: "💸<$3K/mo", value: "mid", type: "single" },
        { id: "expensive", label: "💰<$5K/mo", value: "expensive", type: "single" },
      ],
    },
    {
      title: "Quality",
      layout: "half",
      options: [
        { id: "safe", label: "👮‍ Safe", value: "safe", type: "multi" },
        { id: "quality", label: "⭐ High Quality", value: "quality", type: "multi" },
        { id: "value", label: "💨 Good Value", value: "value", type: "multi" },
        { id: "active", label: "🔥 Very Active", value: "active", type: "multi" },
        { id: "growing", label: "📈 Growing Scene", value: "growing", type: "multi" },
        { id: "veteran", label: "🏅 Veteran Approved", value: "veteran", type: "multi" },
      ],
    },
    {
      title: "Vibe",
      layout: "pair",
      options: [
        { id: "party", label: "🎉 Party Scene", value: "party", type: "single" },
        { id: "relaxed", label: "😌 Relaxed", value: "relaxed", type: "single" },
        { id: "gfe", label: "💕 GFE Focus", value: "gfe", type: "single" },
        { id: "hardcore", label: "🔥 Hardcore", value: "hardcore", type: "single" },
      ],
    },
    {
      title: "Where",
      options: [
        // Regions
        { id: "north-america", label: "🌎 North America", value: "north-america", type: "multi" },
        { id: "latin-america", label: "💃 Latin America", value: "latin-america", type: "multi" },
        { id: "europe", label: "🇪🇺 Europe", value: "europe", type: "multi" },
        { id: "africa", label: "🌍 Africa", value: "africa", type: "multi" },
        { id: "middle-east", label: "🕌 Middle East", value: "middle-east", type: "multi" },
        { id: "asia", label: "⛩️ Asia", value: "asia", type: "multi", active: true },
        { id: "oceania", label: "🏄 Oceania", value: "oceania", type: "multi" },
      ],
    },
  ];

  const renderFilterButton = (
    option: FilterOption,
    category: string,
    layout?: string
  ) => {
    const isActive = activeFilters[category]?.includes(option.value);
    
    return (
      <Button
        key={option.id}
        variant="ghost"
        size="sm"
        onClick={() => handleFilterToggle(category, option.value, option.type === "multi")}
        className={cn(
          "text-xs h-6 px-2 justify-start",
          layout === "half" && "flex-1",
          layout === "pair" && "flex-1",
          isActive
            ? "bg-red-500 hover:bg-red-600 text-white border-red-500"
            : "text-gray-300 hover:bg-gray-700 hover:text-white border-transparent hover:border-gray-600",
          "border transition-colors"
        )}
      >
        {option.label}
      </Button>
    );
  };

  return (
    <div className={cn("w-64 flex-shrink-0", className)}>
      {/* Search and Filters Container */}
      <div className="bg-gray-800 rounded border border-gray-700 p-4 mb-4">
        {/* Search */}
        <div className="relative mb-3">
          <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400">
            <SearchIcon className="h-4 w-4" />
          </div>
          <Input
            placeholder="Search cities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-8 text-sm bg-gray-700 border-gray-600 text-white placeholder-gray-400"
          />
        </div>

        {/* Filter Categories */}
        {filterCategories.map((category) => (
          <div key={category.title} className="mb-6 last:mb-0">
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
              {category.title}
            </h4>

            {/* Temperature and Cost filters - Full width */}
            {category.title === "What" && (
              <div className="space-y-2">
                {/* Temperature row */}
                <div className="flex flex-wrap gap-1">
                  {category.options.slice(0, 3).map((option) =>
                    renderFilterButton(option, "temperature", "full")
                  )}
                </div>
                {/* Cost row */}
                <div className="flex flex-wrap gap-1">
                  {category.options.slice(3).map((option) =>
                    renderFilterButton(option, "cost", "full")
                  )}
                </div>
              </div>
            )}

            {/* Quality filters - Half width grid */}
            {category.title === "Quality" && (
              <div className="grid grid-cols-2 gap-1">
                {category.options.map((option) =>
                  renderFilterButton(option, "quality", category.layout)
                )}
              </div>
            )}

            {/* Vibe filters - Pair layout */}
            {category.title === "Vibe" && (
              <div className="grid grid-cols-2 gap-1">
                {category.options.map((option) =>
                  renderFilterButton(option, "vibe", category.layout)
                )}
              </div>
            )}

            {/* Region filters - Grid layout */}
            {category.title === "Where" && (
              <div className="grid grid-cols-2 gap-1">
                {category.options.map((option) =>
                  renderFilterButton(option, "region", "half")
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Stats Box */}
      <div className="bg-gray-800 rounded border border-gray-700 p-4">
        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
          Stats
        </h4>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-400">Cities</span>
            <span className="font-medium text-white">12</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Members</span>
            <span className="font-medium text-white">2,847</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Reports Today</span>
            <span className="font-medium text-white">842</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Active Venues</span>
            <span className="font-medium text-white">1,247</span>
          </div>
        </div>
      </div>
    </div>
  );
}