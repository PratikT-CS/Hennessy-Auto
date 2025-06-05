
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, Upload, Filter } from 'lucide-react';
import { UploadModal } from './UploadModal';

interface Deal {
  id: string;
  customerName: string;
  vin: string;
  status: 'Validated' | 'Incomplete' | 'In Progress';
  validationScore: number;
  lastUpdated: string;
}

const mockDeals: Deal[] = [
  {
    id: '149331',
    customerName: 'Jane Doe',
    vin: '1HGCM82633A123456',
    status: 'Incomplete',
    validationScore: 75,
    lastUpdated: 'June 4, 2025'
  },
  {
    id: '149332',
    customerName: 'John Smith',
    vin: '2T1BURHE5GC123789',
    status: 'Validated',
    validationScore: 95,
    lastUpdated: 'June 3, 2025'
  },
  {
    id: '149333',
    customerName: 'Mary Johnson',
    vin: '1FTFW1ET5DFC12345',
    status: 'In Progress',
    validationScore: 60,
    lastUpdated: 'June 4, 2025'
  }
];

interface DashboardOverviewProps {
  onDealSelect: (dealId: string) => void;
}

export const DashboardOverview = ({ onDealSelect }: DashboardOverviewProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const filteredDeals = mockDeals.filter(deal => {
    const matchesSearch = deal.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deal.id.includes(searchTerm) ||
                         deal.vin.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || deal.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: Deal['status']) => {
    const variants = {
      'Validated': 'bg-green-100 text-green-800 border-green-200',
      'Incomplete': 'bg-red-100 text-red-800 border-red-200',
      'In Progress': 'bg-yellow-100 text-yellow-800 border-yellow-200'
    };
    const icons = {
      'Validated': '✅',
      'Incomplete': '❌',
      'In Progress': '🟡'
    };
    return (
      <Badge className={`${variants[status]} border`}>
        {icons[status]} {status}
      </Badge>
    );
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter Section */}
      <Card className="shadow-sm border-0 bg-white/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-1 gap-3 items-center">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by Deal ID, Customer Name, or VIN..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-gray-200 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48 border-gray-200">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent className="bg-white border shadow-lg z-50">
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Validated">✅ Validated</SelectItem>
                  <SelectItem value="Incomplete">❌ Incomplete</SelectItem>
                  <SelectItem value="In Progress">🟡 In Progress</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload New Deal
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl bg-white">
                <DialogHeader>
                  <DialogTitle>Upload New Deal</DialogTitle>
                  <DialogDescription>
                    Upload documents for a new vehicle deal
                  </DialogDescription>
                </DialogHeader>
                <UploadModal onClose={() => setIsUploadModalOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Deals Table */}
      <Card className="shadow-sm border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900">Vehicle Deals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Deal ID</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Customer Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">VIN</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Deal Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Validation Score</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Last Updated</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredDeals.map((deal) => (
                  <tr key={deal.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4 font-mono text-sm text-blue-600 font-medium">
                      {deal.id}
                    </td>
                    <td className="py-4 px-4 font-medium text-gray-900">
                      {deal.customerName}
                    </td>
                    <td className="py-4 px-4 font-mono text-sm text-gray-600">
                      {deal.vin}
                    </td>
                    <td className="py-4 px-4">
                      {getStatusBadge(deal.status)}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`font-semibold ${getScoreColor(deal.validationScore)}`}>
                        {deal.validationScore}%
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-600">
                      {deal.lastUpdated}
                    </td>
                    <td className="py-4 px-4">
                      <Button
                        onClick={() => onDealSelect(deal.id)}
                        variant="outline"
                        size="sm"
                        className="text-blue-600 border-blue-200 hover:bg-blue-50"
                      >
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredDeals.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No deals found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
