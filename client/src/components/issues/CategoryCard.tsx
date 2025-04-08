import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { getCategoryIconElement } from "@/lib/utils";
import { type Category } from "@shared/schema";

interface CategoryCardProps {
  category: Category;
  issueCount?: number;
  animationDelay?: string;
}

const CategoryCard = ({ 
  category, 
  issueCount = 0, 
  animationDelay = "0s" 
}: CategoryCardProps) => {
  return (
    <Card 
      className="card bg-[hsl(var(--space-gray)/40)] hover:bg-[hsl(var(--space-gray)/60)] rounded-xl p-6 text-center border border-[hsl(var(--space-purple)/20)] animate-float"
      style={{ animationDelay }}
    >
      <div className="w-12 h-12 rounded-full bg-[hsl(var(--space-purple)/20)] flex items-center justify-center mx-auto mb-4">
        <i className={getCategoryIconElement(category.icon)}></i>
      </div>
      <h3 className="font-semibold mb-2">{category.name}</h3>
      <p className="text-sm text-[hsl(var(--foreground)/60)] mb-3">
        {issueCount} active {issueCount === 1 ? 'issue' : 'issues'}
      </p>
      <Link href={`/browse?categoryId=${category.id}`} className="text-[hsl(var(--space-pink))] text-sm hover:text-[hsl(var(--space-gold))] flex items-center justify-center gap-1 transition-colors">
        View all
        <i className="ri-arrow-right-line"></i>
      </Link>
    </Card>
  );
};

export default CategoryCard;
