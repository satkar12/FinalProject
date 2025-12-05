import { Search, Sparkles, Building2, Grid3x3 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface FilterSectionProps {
    onFilterChange?: (filter: string) => void;
    activeFilter?: string;
    onSearchChange?: (search: string) => void;
    searchQuery?: string;
}

const FilterSection = ({ onFilterChange, activeFilter = "Popular", onSearchChange, searchQuery = "" }: FilterSectionProps) => {
    const filters = [
        { id: "Popular", label: "Popular", icon: Sparkles, count: 20 },
        { id: "Tribhuvan University", label: "Tribhuvan University", icon: Building2 },
        { id: "All", label: "All", icon: Grid3x3 },
    ];

    return (
        <div className="space-y-4">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Find new groups"
                    className="pl-10 bg-muted/50 border-border"
                    value={searchQuery}
                    onChange={(e) => onSearchChange?.(e.target.value)}
                />
            </div>

            <div className="space-y-2">
                {filters.map((filter) => {
                    const isActive = activeFilter === filter.id;
                    const Icon = filter.icon;

                    return (
                        <button
                            key={filter.id}
                            onClick={() => onFilterChange?.(filter.id)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive
                                    ? "bg-primary/10 text-primary border border-primary/20"
                                    : "hover:bg-muted text-foreground"
                                }`}
                        >
                            <div className={`p-1.5 rounded ${isActive ? "bg-primary/20" : "bg-muted"}`}>
                                <Icon className="h-4 w-4" />
                            </div>
                            <span className="flex-1 text-left text-sm font-medium">{filter.label}</span>
                            {filter.count && (
                                <Badge variant="secondary" className="text-xs">
                                    {filter.count}
                                </Badge>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default FilterSection;
