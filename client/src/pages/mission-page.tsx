import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function MissionPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="max-w-4xl mx-auto text-center mb-16">
        <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
          <span className="bg-gradient-to-r from-[hsl(var(--space-gold))] via-[hsl(var(--space-pink))] to-[hsl(var(--space-purple))] bg-clip-text text-transparent">
            Our Mission
          </span>
        </h1>
        <p className="text-lg md:text-xl text-[hsl(var(--foreground)/80)] leading-relaxed mb-8">
          We empower communities to identify, discuss, and solve local issues through collaboration and collective action.
        </p>
      </section>

      {/* Vision Statement */}
      <section className="mb-16 max-w-4xl mx-auto">
        <div className="bg-[hsl(var(--space-gray)/20)] border border-[hsl(var(--space-purple)/20)] rounded-xl p-8 backdrop-blur-sm">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">Our Vision</h2>
          <div className="prose prose-lg prose-invert max-w-none">
            <p>
              Really Obvious Media Lab envisions a world where communities are empowered to shape their own futures. 
              We believe that everyone deserves a voice in the decisions that affect their lives, 
              and that transparent, collaborative problem-solving leads to stronger, more resilient communities.
            </p>
            <p>
              By facilitating meaningful connections between neighbors, local organizations, and decision-makers, 
              we aim to break down barriers to civic participation and create a more inclusive society 
              where community-driven solutions flourish.
            </p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="mb-16">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Our Core Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[hsl(var(--space-gray)/30)] rounded-xl p-6 backdrop-blur-sm border border-[hsl(var(--space-purple)/20)]">
            <div className="w-12 h-12 rounded-full bg-[hsl(var(--space-purple)/20)] flex items-center justify-center mx-auto mb-4">
              <i className="ri-community-line text-xl text-[hsl(var(--space-gold))]"></i>
            </div>
            <h3 className="font-semibold mb-2 text-center">Community First</h3>
            <p className="text-[hsl(var(--foreground)/70)] text-center">
              We center the needs, voices, and well-being of communities in everything we do.
            </p>
          </div>
          
          <div className="bg-[hsl(var(--space-gray)/30)] rounded-xl p-6 backdrop-blur-sm border border-[hsl(var(--space-purple)/20)]">
            <div className="w-12 h-12 rounded-full bg-[hsl(var(--space-purple)/20)] flex items-center justify-center mx-auto mb-4">
              <i className="ri-scales-3-line text-xl text-[hsl(var(--space-gold))]"></i>
            </div>
            <h3 className="font-semibold mb-2 text-center">Transparency</h3>
            <p className="text-[hsl(var(--foreground)/70)] text-center">
              We foster open communication and accountability in all our processes.
            </p>
          </div>
          
          <div className="bg-[hsl(var(--space-gray)/30)] rounded-xl p-6 backdrop-blur-sm border border-[hsl(var(--space-purple)/20)]">
            <div className="w-12 h-12 rounded-full bg-[hsl(var(--space-purple)/20)] flex items-center justify-center mx-auto mb-4">
              <i className="ri-team-line text-xl text-[hsl(var(--space-gold))]"></i>
            </div>
            <h3 className="font-semibold mb-2 text-center">Collaboration</h3>
            <p className="text-[hsl(var(--foreground)/70)] text-center">
              We believe that diverse perspectives lead to better solutions for complex problems.
            </p>
          </div>
        </div>
      </section>

      {/* Our Approach */}
      <section className="mb-16 max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Our Approach</h2>
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="w-full md:w-1/4 flex justify-center">
              <div className="w-16 h-16 rounded-full bg-[hsl(var(--space-purple)/20)] flex items-center justify-center">
                <i className="ri-search-line text-2xl text-[hsl(var(--space-gold))]"></i>
              </div>
            </div>
            <div className="w-full md:w-3/4">
              <h3 className="text-xl font-semibold mb-2">Identify</h3>
              <p className="text-[hsl(var(--foreground)/80)]">
                We help communities identify and prioritize the issues that matter most to them, 
                using data-driven approaches and inclusive community engagement.
              </p>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="w-full md:w-1/4 flex justify-center">
              <div className="w-16 h-16 rounded-full bg-[hsl(var(--space-purple)/20)] flex items-center justify-center">
                <i className="ri-discuss-line text-2xl text-[hsl(var(--space-gold))]"></i>
              </div>
            </div>
            <div className="w-full md:w-3/4">
              <h3 className="text-xl font-semibold mb-2">Connect</h3>
              <p className="text-[hsl(var(--foreground)/80)]">
                We create spaces for meaningful dialogue between diverse stakeholders, 
                fostering understanding and building consensus around community goals.
              </p>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="w-full md:w-1/4 flex justify-center">
              <div className="w-16 h-16 rounded-full bg-[hsl(var(--space-purple)/20)] flex items-center justify-center">
                <i className="ri-tools-line text-2xl text-[hsl(var(--space-gold))]"></i>
              </div>
            </div>
            <div className="w-full md:w-3/4">
              <h3 className="text-xl font-semibold mb-2">Act</h3>
              <p className="text-[hsl(var(--foreground)/80)]">
                We support communities in developing and implementing action plans that address 
                their most pressing issues, building capacity for sustained community-led change.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Join Us */}
      <section className="py-12 px-8 bg-gradient-to-r from-[hsl(var(--space-blue))] via-[hsl(var(--space-purple)/20)] to-[hsl(var(--space-blue))] rounded-xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute w-64 h-64 rounded-full bg-[hsl(var(--space-purple)/30)] blur-3xl -top-20 -right-20"></div>
          <div className="absolute w-64 h-64 rounded-full bg-[hsl(var(--space-pink)/20)] blur-3xl -bottom-20 -left-20"></div>
        </div>
        
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Join Our Community</h2>
          <p className="text-lg text-[hsl(var(--foreground)/80)] mb-8">
            Together, we can build stronger, more resilient communities. Join us in creating positive change from the ground up.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/browse">
              <Button size="lg">Browse Issues</Button>
            </Link>
            <Link href="/submit">
              <Button variant="secondary" size="lg">Submit an Issue</Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}