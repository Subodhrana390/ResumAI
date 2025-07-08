"use client";
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Crown, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

export const ProFeatureGuard = ({ children, featureName, featureDescription }: { children: React.ReactNode, featureName: string, featureDescription: string }) => {
    const { user, upgradeToPro } = useAuth();
    const { toast } = useToast();

    const handleUpgradeClick = () => {
        if (user) {
            upgradeToPro();
        } else {
            toast({
                title: 'Please Log In',
                description: 'You need to be logged in to upgrade your plan.',
                variant: 'destructive',
            });
        }
    };

    if (user?.subscription.plan !== 'pro') {
        return (
            <div className="flex items-center justify-center h-full py-12">
                <Card className="max-w-md text-center shadow-lg">
                    <CardHeader>
                        <div className="mx-auto bg-primary/20 p-4 rounded-full w-fit mb-4">
                            <Crown className="w-10 h-10 text-primary" />
                        </div>
                        <CardTitle className="font-headline text-2xl">Upgrade to Pro to Use {featureName}</CardTitle>
                        <CardDescription>{featureDescription}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground mb-6">
                            This is a premium feature available exclusively for our Pro members. Unlock this and more by upgrading your plan.
                        </p>
                        <Button onClick={handleUpgradeClick} size="lg" className="w-full">
                            <Sparkles className="mr-2 h-5 w-5" />
                            Upgrade to Pro Now
                        </Button>
                    </CardContent>
                    <CardFooter className="flex-col gap-2">
                        <p className="text-xs text-muted-foreground">
                            Payments are securely handled by Razorpay.
                        </p>
                        <Link href="/settings" className="text-xs text-primary hover:underline">
                            Manage your subscription
                        </Link>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    return <>{children}</>;
};
