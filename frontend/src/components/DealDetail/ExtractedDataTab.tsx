
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useState } from 'react';

interface ExtractedField {
  field: string;
  value: string;
  sourceDocument: string;
  confidence?: number;
}

const mockExtractedData: ExtractedField[] = [
  { field: 'Customer Name', value: 'Jane Doe', sourceDocument: 'bill_of_sale.pdf', confidence: 98 },
  { field: 'VIN', value: '1HGCM82633A123456', sourceDocument: 'title.pdf', confidence: 99 },
  { field: 'GA TAVT Fee', value: '$1,130', sourceDocument: 'mv7d.pdf', confidence: 95 },
  { field: 'Odometer Reading', value: '34,100 miles', sourceDocument: 'odometer.pdf', confidence: 92 },
  { field: 'Sale Price', value: '$24,500', sourceDocument: 'bill_of_sale.pdf', confidence: 97 },
  { field: 'Vehicle Year', value: '2018', sourceDocument: 'title.pdf', confidence: 99 },
  { field: 'Vehicle Make', value: 'Honda', sourceDocument: 'title.pdf', confidence: 99 },
  { field: 'Vehicle Model', value: 'Civic', sourceDocument: 'title.pdf', confidence: 99 },
  { field: 'Lien Holder', value: 'Wells Fargo Bank', sourceDocument: 'title.pdf', confidence: 88 },
  { field: 'Customer Address', value: '123 Main St, Atlanta, GA 30309', sourceDocument: 'bill_of_sale.pdf', confidence: 94 }
];

export const ExtractedDataTab = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = mockExtractedData.filter(
    item => 
      item.field.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.value.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sourceDocument.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getConfidenceBadge = (confidence?: number) => {
    if (!confidence) return null;
    
    let variant = 'bg-gray-100 text-gray-800';
    if (confidence >= 95) variant = 'bg-green-100 text-green-800';
    else if (confidence >= 85) variant = 'bg-yellow-100 text-yellow-800';
    else variant = 'bg-red-100 text-red-800';
    
    return (
      <Badge className={`${variant} text-xs`}>
        {confidence}%
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Extracted Data Fields</h3>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search fields or values..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Card className="border border-gray-200">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Field</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Value</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Source Document</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Confidence</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 font-medium text-gray-900">
                      {item.field}
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                        {item.value}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-blue-600 font-mono text-sm">
                      {item.sourceDocument}
                    </td>
                    <td className="py-3 px-4">
                      {getConfidenceBadge(item.confidence)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredData.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No data found matching your search criteria.
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border border-green-200 bg-green-50">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-700">
              {mockExtractedData.filter(item => (item.confidence || 0) >= 95).length}
            </div>
            <div className="text-sm text-green-600">High Confidence (95%+)</div>
          </CardContent>
        </Card>
        <Card className="border border-yellow-200 bg-yellow-50">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-700">
              {mockExtractedData.filter(item => (item.confidence || 0) >= 85 && (item.confidence || 0) < 95).length}
            </div>
            <div className="text-sm text-yellow-600">Medium Confidence (85-94%)</div>
          </CardContent>
        </Card>
        <Card className="border border-red-200 bg-red-50">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-700">
              {mockExtractedData.filter(item => (item.confidence || 0) < 85).length}
            </div>
            <div className="text-sm text-red-600">Low Confidence (&lt;85%)</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
