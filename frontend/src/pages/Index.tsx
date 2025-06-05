
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardOverview } from '@/components/DashboardOverview';
import { UploadDeal } from '@/components/UploadDeal';
import { DealDetail } from '@/components/DealDetail';
import { Analytics } from '@/components/Analytics';

const Index = () => {
  const [selectedDealId, setSelectedDealId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleDealSelect = (dealId: string) => {
    setSelectedDealId(dealId);
    setActiveTab('deal-detail');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Vehicle Deal Management</h1>
          <p className="text-gray-600">Upload, validate, and manage vehicle deal documents with AI-powered insights</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white shadow-sm border">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              🏠 Dashboard
            </TabsTrigger>
            <TabsTrigger value="upload" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              📤 Upload Deal
            </TabsTrigger>
            <TabsTrigger value="deal-detail" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              📂 Deal Detail
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              📈 Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="mt-6">
            <DashboardOverview onDealSelect={handleDealSelect} />
          </TabsContent>

          <TabsContent value="upload" className="mt-6">
            <UploadDeal />
          </TabsContent>

          <TabsContent value="deal-detail" className="mt-6">
            <DealDetail dealId={selectedDealId} />
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <Analytics />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
