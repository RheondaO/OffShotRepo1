import { useState } from "react";
import { Link } from "wouter";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

const newsletterFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters."
  }),
  email: z.string().email({
    message: "Please enter a valid email address."
  }),
  interests: z.array(z.string()).refine((value) => value.length > 0, {
    message: "Please select at least one interest."
  }),
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: "You must agree to the terms and conditions."
  }),
});

type NewsletterFormValues = z.infer<typeof newsletterFormSchema>;

const interestOptions = [
  { id: "environment", label: "Environment" },
  { id: "infrastructure", label: "Infrastructure" },
  { id: "education", label: "Education" },
  { id: "safety", label: "Public Safety" },
  { id: "health", label: "Health & Wellness" },
  { id: "community", label: "Community Events" },
  { id: "policy", label: "Local Policy" },
];

const NewsletterPage = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<NewsletterFormValues>({
    resolver: zodResolver(newsletterFormSchema),
    defaultValues: {
      name: "",
      email: "",
      interests: [],
      agreeToTerms: false,
    },
  });

  const onSubmit = async (data: NewsletterFormValues) => {
    setIsSubmitting(true);
    
    try {
      // In a real application, we would make an API call here
      // For now, we'll simulate a successful submission after a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log("Newsletter subscription data:", data);
      
      setIsSuccess(true);
      toast({
        title: "Success!",
        description: "You've been subscribed to our newsletter.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="py-16 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <div className="mb-6">
            <svg 
              className="w-16 h-16 mx-auto text-[hsl(var(--space-pink))]" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Thank You for Subscribing!</h1>
          <p className="text-[hsl(var(--foreground)/80)] text-lg mb-8">
            We've added you to our newsletter. You'll now receive updates about community issues and platform news.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link href="/">
              <Button>Return to Home</Button>
            </Link>
            <Link href="/browse">
              <Button variant="outline">Browse Issues</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-6">Stay Updated on Community Issues</h1>
            <p className="text-[hsl(var(--foreground)/80)] text-lg mb-8">
              Subscribe to our newsletter to receive updates about community issues, new features, and ways to get involved in making a difference in your area.
            </p>
            
            <div className="space-y-6 mb-8">
              <div className="flex items-start space-x-4">
                <div className="bg-[hsl(var(--space-pink)/10)] rounded-full p-2 mt-1">
                  <svg className="w-5 h-5 text-[hsl(var(--space-pink))]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium mb-1">Weekly Digests</h3>
                  <p className="text-[hsl(var(--foreground)/70)]">Receive a weekly summary of the most important community issues in your area.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-[hsl(var(--space-pink)/10)] rounded-full p-2 mt-1">
                  <svg className="w-5 h-5 text-[hsl(var(--space-pink))]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium mb-1">Personalized Updates</h3>
                  <p className="text-[hsl(var(--foreground)/70)]">Choose your interests and get updates on the topics that matter most to you.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-[hsl(var(--space-pink)/10)] rounded-full p-2 mt-1">
                  <svg className="w-5 h-5 text-[hsl(var(--space-pink))]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium mb-1">Community Spotlights</h3>
                  <p className="text-[hsl(var(--foreground)/70)]">Learn about success stories and how communities are solving local issues.</p>
                </div>
              </div>
            </div>
            
            <div className="bg-[hsl(var(--secondary)/20)] dark:bg-[hsl(var(--secondary)/10)] p-6 rounded-lg">
              <h3 className="font-medium mb-2">Why Subscribe?</h3>
              <p className="text-[hsl(var(--foreground)/70)] mb-4">
                Our newsletter is designed to keep you informed and engaged with your community. We respect your privacy and will never share your information with third parties.
              </p>
              <Link href="/privacy" className="text-[hsl(var(--space-pink))] hover:underline text-sm">
                Read our Privacy Policy
              </Link>
            </div>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Subscribe to Our Newsletter</CardTitle>
                <CardDescription>
                  Fill out the form below to subscribe to our newsletter and stay updated.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="Your email address" type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="interests"
                      render={() => (
                        <FormItem>
                          <div className="mb-4">
                            <FormLabel>Your Interests</FormLabel>
                            <FormDescription>
                              Select the topics you'd like to receive updates about.
                            </FormDescription>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {interestOptions.map((option) => (
                              <FormField
                                key={option.id}
                                control={form.control}
                                name="interests"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={option.id}
                                      className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(option.id)}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([...field.value, option.id])
                                              : field.onChange(
                                                  field.value?.filter(
                                                    (value) => value !== option.id
                                                  )
                                                )
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="font-normal">
                                        {option.label}
                                      </FormLabel>
                                    </FormItem>
                                  )
                                }}
                              />
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="agreeToTerms"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              I agree to the{" "}
                              <Link href="/terms" className="text-[hsl(var(--space-pink))] hover:underline">
                                terms and conditions
                              </Link>
                            </FormLabel>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Subscribing..." : "Subscribe"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
              <CardFooter className="flex justify-center text-[hsl(var(--foreground)/60)] text-sm">
                You can unsubscribe at any time.
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsletterPage;