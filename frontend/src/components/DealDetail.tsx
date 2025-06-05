
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DocumentsTab } from './DealDetail/DocumentsTab';
import { ExtractedDataTab } from './DealDetail/ExtractedDataTab';
import { ChecklistTab } from './DealDetail/ChecklistTab';

interface DealDetailProps {
  dealId: string | null;
}

export const DealDetail = ({ dealId }: DealDetailProps) => {
  if (!dealId) {
    return (
      <Card className="shadow-sm border-0 bg-white/80 backdrop-blur-sm">
        <CardContent className="p-12 text-center">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Deal Selected</h3>
          <p className="text-gray-500">Select a deal from the dashboard to view its details</p>
        </CardContent>
      </Card>
    );
  }

  const mockDeal = {
    id: dealId,
    customerName: 'Jane Doe',
    vin: '1HGCM82633A123456',
    createdDate: 'June 1, 2025',
    status: 'Incomplete' as const
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      'Ready': 'bg-green-100 text-green-800 border-green-200',
      'Incomplete': 'bg-red-100 text-red-800 border-red-200',
      'Under Review': 'bg-yellow-100 text-yellow-800 border-yellow-200'
    };
    const icons = {
      'Ready': '🟢',
      'Incomplete': '🔴',
      'Under Review': '🟡'
    };
    return (
      <Badge className={`${variants[status as keyof typeof variants]} border`}>
        {icons[status as keyof typeof icons]} {status}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <Card className="shadow-sm border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl font-semibold text-gray-900 mb-2">
                Deal #{mockDeal.id}
              </CardTitle>
              <div className="space-y-1 text-sm text-gray-600">
                <p><span className="font-medium">Customer:</span> {mockDeal.customerName}</p>
                <p><span className="font-medium">VIN:</span> <span className="font-mono">{mockDeal.vin}</span></p>
                <p><span className="font-medium">Created:</span> {mockDeal.createdDate}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {getStatusBadge(mockDeal.status)}
              <Button variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                Export Report
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Detail Tabs */}
      <Card className="shadow-sm border-0 bg-white/80 backdrop-blur-sm">
        <CardContent className="p-0">
          <Tabs defaultValue="documents" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-gray-50 border-b">
              <TabsTrigger value="documents" className="data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-blue-500">
                📁 Documents
              </TabsTrigger>
              <TabsTrigger value="extracted-data" className="data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-blue-500">
                📊 Extracted Data
              </TabsTrigger>
              <TabsTrigger value="checklist" className="data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-blue-500">
                ✅ Checklist
              </TabsTrigger>
            </TabsList>

            <div className="p-6">
              <TabsContent value="documents">
                <DocumentsTab />
              </TabsContent>

              <TabsContent value="extracted-data">
                <ExtractedDataTab />
              </TabsContent>

              <TabsContent value="checklist">
                <ChecklistTab />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
