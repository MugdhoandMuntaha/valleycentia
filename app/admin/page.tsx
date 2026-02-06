import { createClient } from '@/lib/supabase/server';
import Card from '@/components/ui/Card';
import { Package, DollarSign, Users } from 'lucide-react';

export default async function AdminDashboard() {
    const supabase = await createClient();

    // Fetch stats
    const { count: productsCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

    // Assuming we have orders/users, if not just show simplistic data
    const stats = [
        {
            title: 'Total Products',
            value: productsCount || 0,
            icon: Package,
            color: 'text-blue-500',
        },
        // Add more placeholders
        {
            title: 'Total Revenue',
            value: '$0.00',
            icon: DollarSign,
            color: 'text-green-500',
        },
        {
            title: 'Active Users',
            value: '0',
            icon: Users,
            color: 'text-orange-500',
        },
    ];

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Dashboard Overview</h1>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {stats.map((stat) => (
                    <Card key={stat.title} className="p-6 bg-zinc-900 border border-white/10">
                        <div className="flex items-center justify-between space-y-0 pb-2">
                            <h3 className="text-sm font-medium text-zinc-400">{stat.title}</h3>
                            <stat.icon className={`h-4 w-4 ${stat.color}`} />
                        </div>
                        <div className="text-2xl font-bold">{stat.value}</div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
