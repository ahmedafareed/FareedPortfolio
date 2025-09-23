"use client";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const timeline = [
  { year: 2019, achievement: "First Solo Exhibition" },
  { year: 2020, achievement: "National Geographic Contest" },
  { year: 2021, achievement: "Exhibition at The Modern" },
  { year: 2022, achievement: "WPPI Awards" },
  { year: 2023, achievement: "Photographer of the Year" },
];

export default function Timeline() {
  return (
    <TooltipProvider>
        <div className="relative flex justify-between items-center w-full">
            <div className="absolute top-1/2 left-0 w-full h-px bg-border -translate-y-1/2" />
            {timeline.map(item => (
                <Tooltip key={item.year}>
                    <TooltipTrigger asChild>
                        <div className="relative w-3 h-3 bg-foreground rounded-full cursor-pointer z-10" />
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{item.year}: {item.achievement}</p>
                    </TooltipContent>
                </Tooltip>
            ))}
        </div>
    </TooltipProvider>
  );
}
