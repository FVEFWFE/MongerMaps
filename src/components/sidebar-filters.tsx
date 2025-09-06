"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
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
        { id: "budget", label: "💵<$1K/mo", value: "budget", type: "single" },
        { id: "cheap", label: "💸<$2K/mo", value: "cheap", type: "single" },
        { id: "mid", label: "💰<$3K/mo", value: "mid", type: "single" },
      ],
    },
    {
      title: "Essential",
      layout: "half",
      options: [
        { id: "safe", label: "👮 Safe", value: "safe", type: "multi" },
        { id: "internet", label: "📡 Fast internet", value: "internet", type: "multi" },
        { id: "nightlife", label: "🌃 Nightlife", value: "nightlife", type: "multi" },
        { id: "24hr", label: "🕐 24hr city", value: "24hr", type: "multi" },
        { id: "english", label: "🗣️ English OK", value: "english", type: "multi" },
        { id: "walkable", label: "🚶 Walkable", value: "walkable", type: "multi" },
      ],
    },
    {
      title: "Features",
      layout: "half",
      options: [
        { id: "beach", label: "🏖️ Beach", value: "beach", type: "multi" },
        { id: "legal", label: "✅ Legal scene", value: "legal", type: "multi" },
        { id: "cannabis", label: "🌿 Cannabis OK", value: "cannabis", type: "multi" },
        { id: "lgbtq", label: "🏳️‍🌈 LGBTQ+", value: "lgbtq", type: "multi" },
        { id: "female", label: "👩 Female friendly", value: "female", type: "multi" },
        { id: "value", label: "💎 Good value", value: "value", type: "multi" },
      ],
    },
    {
      title: "Women",
      layout: "half",
      options: [
        { id: "attractive", label: "😍 Very attractive", value: "attractive", type: "multi" },
        { id: "easy-find", label: "🔍 Easy to find hot", value: "easy-find", type: "multi" },
        { id: "low-tattoos", label: "🚫 Low tattoos", value: "low-tattoos", type: "multi" },
        { id: "high-tattoos", label: "🎨 Many tattoos", value: "high-tattoos", type: "multi" },
        { id: "friendly", label: "😊 Friendly personality", value: "friendly", type: "multi" },
        { id: "professional", label: "💼 Professional", value: "professional", type: "multi" },
      ],
    },
    {
      title: "Culture",
      layout: "half",
      options: [
        { id: "conservative", label: "🏛️ Conservative", value: "conservative", type: "multi" },
        { id: "liberal", label: "🗽 Liberal", value: "liberal", type: "multi" },
        { id: "traditional", label: "🎎 Traditional", value: "traditional", type: "multi" },
        { id: "modern", label: "🏙️ Modern", value: "modern", type: "multi" },
      ],
    },
    {
      title: "Infrastructure",
      layout: "half",
      options: [
        { id: "fast-internet", label: "🚀 50+ Mbps", value: "fast-internet", type: "multi" },
        { id: "ultra-internet", label: "⚡ 100+ Mbps", value: "ultra-internet", type: "multi" },
        { id: "luxury-hotels", label: "🏨 5-star hotels", value: "luxury-hotels", type: "multi" },
        { id: "good-hotels", label: "🏢 Good hotels", value: "good-hotels", type: "multi" },
        { id: "beautiful-env", label: "🌺 Beautiful environment", value: "beautiful-env", type: "multi" },
        { id: "urban", label: "🌆 Urban setting", value: "urban", type: "multi" },
      ],
    },
    {
      title: "Timezone",
      layout: "half",
      options: [
        { id: "tz-us-east", label: "🕐 US East (±3h)", value: "tz-us-east", type: "multi" },
        { id: "tz-us-west", label: "🕑 US West (±3h)", value: "tz-us-west", type: "multi" },
        { id: "tz-europe", label: "🕒 Europe (±3h)", value: "tz-europe", type: "multi" },
        { id: "tz-asia", label: "🕓 Asia (±3h)", value: "tz-asia", type: "multi" },
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
        { id: "north-america", label: "North America", value: "north-america", type: "multi" },
        { id: "latin-america", label: "Latin America", value: "latin-america", type: "multi" },
        { id: "europe", label: "Europe", value: "europe", type: "multi" },
        { id: "africa", label: "Africa", value: "africa", type: "multi" },
        { id: "middle-east", label: "Middle East", value: "middle-east", type: "multi" },
        { id: "asia", label: "Asia", value: "asia", type: "multi", active: true },
        { id: "oceania", label: "Oceania", value: "oceania", type: "multi" },
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
            ? "bg-primary hover:bg-primary/90 text-primary-foreground"
            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
          "transition-colors"
        )}
      >
        {option.label}
      </Button>
    );
  };

  return (
    <div className={cn("w-80 flex-shrink-0", className)}>
      {/* Filters Container */}
      <div className="bg-card rounded-lg border p-4 mb-4">
        {/* Filter Categories */}
        {filterCategories.map((category) => (
          <div key={category.title} className="mb-6 last:mb-0">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
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

            {/* Essential filters - Half width grid */}
            {category.title === "Essential" && (
              <div className="grid grid-cols-2 gap-1">
                {category.options.map((option) =>
                  renderFilterButton(option, "essential", category.layout)
                )}
              </div>
            )}

            {/* Features filters - Half width grid */}
            {category.title === "Features" && (
              <div className="grid grid-cols-2 gap-1">
                {category.options.map((option) =>
                  renderFilterButton(option, "features", category.layout)
                )}
              </div>
            )}

            {/* Women filters - Half width grid */}
            {category.title === "Women" && (
              <div className="grid grid-cols-2 gap-1">
                {category.options.map((option) =>
                  renderFilterButton(option, "women", category.layout)
                )}
              </div>
            )}

            {/* Culture filters - Half width grid */}
            {category.title === "Culture" && (
              <div className="grid grid-cols-2 gap-1">
                {category.options.map((option) =>
                  renderFilterButton(option, "culture", category.layout)
                )}
              </div>
            )}

            {/* Infrastructure filters - Half width grid */}
            {category.title === "Infrastructure" && (
              <div className="grid grid-cols-2 gap-1">
                {category.options.map((option) =>
                  renderFilterButton(option, "infrastructure", category.layout)
                )}
              </div>
            )}

            {/* Timezone filters - Half width grid */}
            {category.title === "Timezone" && (
              <div className="grid grid-cols-2 gap-1">
                {category.options.map((option) =>
                  renderFilterButton(option, "timezone", category.layout)
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
      <div className="bg-card rounded-lg border p-4">
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Stats
        </h4>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Cities</span>
            <span className="font-medium">12</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Members</span>
            <span className="font-medium">2,847</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Reports Today</span>
            <span className="font-medium">842</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Active Venues</span>
            <span className="font-medium">1,247</span>
          </div>
        </div>
      </div>
    </div>
  );
}