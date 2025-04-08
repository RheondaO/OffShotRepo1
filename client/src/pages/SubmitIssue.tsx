import IssueForm from "@/components/issues/IssueForm";
import { Card, CardContent } from "@/components/ui/card";

const SubmitIssue = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Submit a Community Issue
          </h1>
          <p className="text-[hsl(var(--foreground)/70)]">
            Share your concerns and ideas with the community to foster positive change
          </p>
        </div>
        
        <Card className="border border-[hsl(var(--space-purple)/20)]">
          <CardContent className="pt-6">
            <IssueForm />
          </CardContent>
        </Card>
        
        <div className="mt-10 bg-[hsl(var(--space-gray)/30)] rounded-xl p-6 border border-[hsl(var(--space-purple)/20)]">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <i className="ri-information-line text-[hsl(var(--space-gold))]"></i>
            Tips for a Great Submission
          </h3>
          <ul className="space-y-2 text-[hsl(var(--foreground)/80)]">
            <li className="flex items-start gap-2">
              <i className="ri-check-line text-[hsl(var(--space-pink))] mt-1"></i>
              <span>Be specific about the issue and its location</span>
            </li>
            <li className="flex items-start gap-2">
              <i className="ri-check-line text-[hsl(var(--space-pink))] mt-1"></i>
              <span>Explain why this issue matters to the community</span>
            </li>
            <li className="flex items-start gap-2">
              <i className="ri-check-line text-[hsl(var(--space-pink))] mt-1"></i>
              <span>Suggest potential solutions or actions if possible</span>
            </li>
            <li className="flex items-start gap-2">
              <i className="ri-check-line text-[hsl(var(--space-pink))] mt-1"></i>
              <span>Use respectful language and focus on constructive feedback</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SubmitIssue;
