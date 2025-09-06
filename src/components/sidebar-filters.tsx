"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { cn } from "~/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip";

interface FilterOption {
  id: string;
  label: string;
  icon?: string;
  value: string;
  type: "single" | "multi";
  active?: boolean;
  description?: string;
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
      title: "Girl Quality & Availability",
      layout: "half",
      options: [
        { id: "stunner-density", label: "😍 Stunner Density", value: "stunner-density", type: "multi", description: "High concentration of 9s and 10s" },
        { id: "gfe-available", label: "💕 GFE Available", value: "gfe-available", type: "multi", description: "Girlfriend experience commonly offered" },
        { id: "age-18-25", label: "👱‍♀️ 18-25 Age Range", value: "age-18-25", type: "multi", description: "Younger girls predominantly available" },
        { id: "age-25-35", label: "👩 25-35 Age Range", value: "age-25-35", type: "multi", description: "More mature women available" },
        { id: "english-girls", label: "🗣️ English Speaking", value: "english-girls", type: "multi", description: "Good English communication skills" },
        { id: "freelancer", label: "🚶‍♀️ Freelancer Scene", value: "freelancer", type: "multi", description: "Independent girls at clubs/apps" },
        { id: "bar-girls", label: "🍺 Bar Girl Scene", value: "bar-girls", type: "multi", description: "Traditional bar/gogo scene" },
        { id: "natural", label: "🌿 Natural Beauty", value: "natural", type: "multi", description: "Minimal plastic surgery/enhancements" },
      ],
    },
    {
      title: "Value for Money",
      layout: "half",
      options: [
        { id: "bang-buck", label: "💎 Best Bang/Buck", value: "bang-buck", type: "multi", description: "Exceptional value for quality" },
        { id: "transparent", label: "📋 Transparent Pricing", value: "transparent", type: "multi", description: "No hidden fees or surprises" },
        { id: "barfine-cheap", label: "💵 Barfine <$20", value: "barfine-cheap", type: "multi", description: "Low bar release fees" },
        { id: "barfine-mid", label: "💸 Barfine $20-50", value: "barfine-mid", type: "multi", description: "Moderate bar release fees" },
        { id: "st-focus", label: "⏱️ ST Friendly", value: "st-focus", type: "multi", description: "Short time culture established" },
        { id: "lt-friendly", label: "🌙 LT Accommodating", value: "lt-friendly", type: "multi", description: "Girls open to overnight stays" },
        { id: "massage-cheap", label: "💆 Cheap Massages", value: "massage-cheap", type: "multi" },
        { id: "no-hidden", label: "✅ No Hidden Fees", value: "no-hidden", type: "multi" },
      ],
    },
    {
      title: "Scene Vibe",
      layout: "half",
      options: [
        { id: "low-tourist", label: "👥 Low Tourist Density", value: "low-tourist", type: "multi" },
        { id: "high-season", label: "📅 High Season Now", value: "high-season", type: "multi" },
        { id: "low-season", label: "📉 Low Season Deals", value: "low-season", type: "multi" },
        { id: "newbie-friendly", label: "🆕 Newbie Friendly", value: "newbie-friendly", type: "multi" },
        { id: "no-starfish", label: "🚫 Low Starfish Risk", value: "no-starfish", type: "multi" },
        { id: "bbfs-common", label: "⚠️ BBFS Common", value: "bbfs-common", type: "multi" },
        { id: "party", label: "🎉 Party Scene", value: "party", type: "multi" },
        { id: "relaxed", label: "😌 Relaxed Vibe", value: "relaxed", type: "multi" },
      ],
    },
    {
      title: "Logistics & Comfort",
      layout: "half",
      options: [
        { id: "guest-friendly", label: "🏨 Guest Friendly Hotels", value: "guest-friendly", type: "multi" },
        { id: "no-joiner", label: "🆓 No Joiner Fees", value: "no-joiner", type: "multi" },
        { id: "joiner-cheap", label: "💵 Joiner <$10", value: "joiner-cheap", type: "multi" },
        { id: "grab-available", label: "🚖 Grab/Taxi 24/7", value: "grab-available", type: "multi" },
        { id: "low-atm-fees", label: "🏧 Low ATM Fees", value: "low-atm-fees", type: "multi" },
        { id: "no-police", label: "👮 No Police Hassle", value: "no-police", type: "multi" },
        { id: "walkable", label: "🚶 Walkable", value: "walkable", type: "multi" },
        { id: "safe", label: "🔒 Very Safe", value: "safe", type: "multi" },
      ],
    },
    {
      title: "Special Interests",
      layout: "half",
      options: [
        { id: "no-ladyboy", label: "🚫 Minimal Ladyboys", value: "no-ladyboy", type: "multi" },
        { id: "ladyboy", label: "🏳️‍⚧️ Ladyboy Scene", value: "ladyboy", type: "multi" },
        { id: "minimal-tattoos", label: "🚫 Minimal Tattoos", value: "minimal-tattoos", type: "multi" },
        { id: "milf", label: "👩‍💼 MILF Available", value: "milf", type: "multi" },
        { id: "fetish", label: "⛓️ Fetish Friendly", value: "fetish", type: "multi" },
        { id: "soapy", label: "🛁 Soapy Massage", value: "soapy", type: "multi" },
        { id: "threesome", label: "👯‍♀️ Easy Threesomes", value: "threesome", type: "multi" },
        { id: "cannabis", label: "🌿 Cannabis OK", value: "cannabis", type: "multi" },
        { id: "legal", label: "✅ Legal Scene", value: "legal", type: "multi" },
      ],
    },
    {
      title: "Risk & Safety",
      layout: "half",
      options: [
        { id: "no-spiking", label: "🍹 No Drink Spiking", value: "no-spiking", type: "multi" },
        { id: "low-pressure", label: "🍸 Low Lady Drink Push", value: "low-pressure", type: "multi" },
        { id: "no-fake-police", label: "👮 No Fake Police", value: "no-fake-police", type: "multi" },
        { id: "low-std", label: "🏥 Low STD Risk", value: "low-std", type: "multi" },
        { id: "no-violence", label: "🛡️ No Violence Risk", value: "no-violence", type: "multi" },
        { id: "scam-free", label: "✅ Low Scam Risk", value: "scam-free", type: "multi" },
        { id: "virgin-safe", label: "🆕 Virgin Friendly", value: "virgin-safe", type: "multi" },
        { id: "medical-good", label: "🏥 Good Healthcare", value: "medical-good", type: "multi" },
      ],
    },
    {
      title: "Social & Dating",
      layout: "half",
      options: [
        { id: "tinder-works", label: "📱 Tinder Success", value: "tinder-works", type: "multi" },
        { id: "sugar-scene", label: "🍯 Sugar Baby Scene", value: "sugar-scene", type: "multi" },
        { id: "civilian-dating", label: "💑 Normal Dating OK", value: "civilian-dating", type: "multi" },
        { id: "expat-community", label: "🌍 Big Expat Scene", value: "expat-community", type: "multi" },
        { id: "low-stigma", label: "😊 Low Stigma", value: "low-stigma", type: "multi" },
        { id: "wife-material", label: "💍 Wife Material", value: "wife-material", type: "multi" },
        { id: "crypto-ok", label: "₿ Crypto Friendly", value: "crypto-ok", type: "multi" },
        { id: "wingmen", label: "🤝 Easy Wingmen", value: "wingmen", type: "multi" },
      ],
    },
    {
      title: "Time & Season",
      layout: "half",
      options: [
        { id: "best-now", label: "🔥 Best Time Now", value: "best-now", type: "multi" },
        { id: "visa-runs", label: "🛂 Easy Visa Runs", value: "visa-runs", type: "multi" },
        { id: "monthly-deals", label: "📅 Monthly Discounts", value: "monthly-deals", type: "multi" },
        { id: "no-surge", label: "📊 No Holiday Surge", value: "no-surge", type: "multi" },
        { id: "weather-good", label: "☀️ Good Weather Now", value: "weather-good", type: "multi" },
        { id: "low-rain", label: "🌤️ Dry Season", value: "low-rain", type: "multi" },
      ],
    },
    {
      title: "Quick Filters",
      options: [
        { id: "cold", label: "🍦 Cold now", value: "cold", type: "single" },
        { id: "mild", label: "🌤 Mild now", value: "mild", type: "single" },
        { id: "warm", label: "☀️ Warm now", value: "warm", type: "single", active: true },
        { id: "budget", label: "💵<$1K/mo", value: "budget", type: "single" },
        { id: "cheap", label: "💸<$2K/mo", value: "cheap", type: "single" },
        { id: "mid", label: "💰<$3K/mo", value: "mid", type: "single" },
      ],
    },
    {
      title: "Regions",
      options: [
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
    
    const button = (
      <Button
        key={option.id}
        variant="ghost"
        size="sm"
        onClick={() => handleFilterToggle(category, option.value, option.type === "multi")}
        className={cn(
          "text-xs h-7 px-2 justify-start cursor-target",
          layout === "half" && "flex-1",
          layout === "pair" && "flex-1",
          isActive
            ? "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
          "transition-colors"
        )}
      >
        {option.label}
      </Button>
    );

    if (option.description) {
      return (
        <Tooltip key={option.id}>
          <TooltipTrigger asChild>
            {button}
          </TooltipTrigger>
          <TooltipContent side="right">
            <p className="text-xs">{option.description}</p>
          </TooltipContent>
        </Tooltip>
      );
    }

    return button;
  };

  return (
    <TooltipProvider>
      <div className={cn(
        "w-80 flex-shrink-0 overflow-y-auto",
        // Custom scrollbar styles for dark UI
        "[&::-webkit-scrollbar]:w-1.5",
        "[&::-webkit-scrollbar-track]:bg-transparent",
        "[&::-webkit-scrollbar-thumb]:bg-zinc-700/50",
        "[&::-webkit-scrollbar-thumb]:rounded-full",
        "[&::-webkit-scrollbar-thumb:hover]:bg-zinc-600/70",
        "scrollbar-thin scrollbar-thumb-zinc-700/50 scrollbar-track-transparent",
        className
      )}>
      {/* Logo Section at Top (Optional - uncomment to use) */}
      {/*
      <div className="bg-card border-r border-b p-6">
        <div className="flex flex-col items-center space-y-3">
          <div className="relative h-20 w-20">
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/60 rounded-2xl shadow-xl flex items-center justify-center">
              <Bird className="h-12 w-12 text-white" />
            </div>
          </div>
          <div className="text-center">
            <h1 className="text-xl font-bold">MongerMaps</h1>
            <p className="text-xs text-muted-foreground">Global Monger Intel</p>
          </div>
        </div>
      </div>
      */}
      
      {/* Filters Container */}
      <div className="bg-card border-r p-4">
        {/* Filter Categories */}
        {filterCategories.map((category) => (
          <div key={category.title} className="mb-6 last:mb-0">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              {category.title}
            </h4>

            {/* Quick Filters - Mixed layout */}
            {category.title === "Quick Filters" && (
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

            {/* Half width grid layouts */}
            {category.layout === "half" && (
              <div className="grid grid-cols-2 gap-1">
                {category.options.map((option) =>
                  renderFilterButton(option, category.title.toLowerCase().replace(/\s+/g, "-"), category.layout)
                )}
              </div>
            )}

            {/* Regions - Full width */}
            {category.title === "Regions" && (
              <div className="flex flex-wrap gap-1">
                {category.options.map((option) =>
                  renderFilterButton(option, "region", "full")
                )}
              </div>
            )}
          </div>
        ))}

        {/* Clear Filters */}
        <div className="mt-6 pt-6 border-t">
          <Button
            variant="outline"
            size="sm"
            className="w-full text-xs"
            onClick={() => {
              setActiveFilters({});
              onFilterChange?.({});
            }}
          >
            Clear all filters
          </Button>
        </div>

        {/* Stats */}
        <div className="mt-4 text-center">
          <p className="text-xs text-muted-foreground">
            2.6M+ field reports analyzed
          </p>
          <p className="text-xs text-muted-foreground">
            847 cities ranked
          </p>
        </div>
      </div>
    </div>
    </TooltipProvider>
  );
}