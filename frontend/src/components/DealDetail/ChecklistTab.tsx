
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface ChecklistItem {
  item: string;
  status: 'Pass' | 'Failed' | 'Warning' | 'Pending';
  notes: string;
}

const mockChecklist: ChecklistItem[] = [
  { item: 'MV-1 form present', status: 'Pass', notes: 'Form found and complete' },
  { item: 'Title signed', status: 'Failed', notes: 'Signature not found' },
  { item: 'POA required for lien', status: 'Pass', notes: 'Lien detected and POA valid' },
  { item: 'Bill of Sale signed', status: 'Pass', notes: 'Matches license and VIN' },
  { item: 'MV-9W for Veteran Exemption', status: 'Warning', notes: 'Exemption not claimed' },
  { item: 'Odometer disclosure complete', status: 'Pass', notes: 'Mileage properly documented' },
  { item: 'GA TAVT calculation correct', status: 'Pass', notes: 'Fee matches vehicle value' },
  { item: 'Insurance verification', status: 'Pending', notes: 'Awaiting insurance docs' }
];

export const ChecklistTab = () => {
  const getStatusBadge = (status: ChecklistItem['status']) => {
    const variants = {
      'Pass': 'bg-green-100 text-green-800 border-green-200',
      'Failed': 'bg-red-100 text-red-800 border-red-200',
      'Warning': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Pending': 'bg-blue-100 text-blue-800 border-blue-200'
    };
    const icons = {
      'Pass': '✅',
      'Failed': '❌',
      'Warning': '⚠️',
      'Pending': '⏳'
    };
    return (
      <Badge className={`${variants[status]} border`}>
        {icons[status]} {status}
      </Badge>
    );
  };

  const statusCounts = mockChecklist.reduce((acc, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const completionPercentage = Math.round(((statusCounts.Pass || 0) / mockChecklist.length) * 100);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">HAC Deal Checklist Validation</h3>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">{completionPercentage}%</div>
          <div className="text-sm text-gray-500">Complete</div>
        </div>
      </div>

      <Card className="border border-gray-200">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Overall Progress</CardTitle>
            <span className="text-sm text-gray-500">{statusCounts.Pass || 0} of {mockChecklist.length} items passing</span>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={completionPercentage} className="h-3" />
          <div className="flex justify-between mt-3 text-sm">
            <span className="text-green-600">✅ {statusCounts.Pass || 0} Pass</span>
            <span className="text-red-600">❌ {statusCounts.Failed || 0} Failed</span>
            <span className="text-yellow-600">⚠️ {statusCounts.Warning || 0} Warning</span>
            <span className="text-blue-600">⏳ {statusCounts.Pending || 0} Pending</span>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-gray-200">
        <CardContent className="p-0">
          <div className="space-y-0">
            {mockChecklist.map((item, index) => (
              <div key={index} className={`p-4 border-b border-gray-100 last:border-b-0 ${
                item.status === 'Failed' ? 'bg-red-50' : 
                item.status === 'Warning' ? 'bg-yellow-50' : 
                item.status === 'Pending' ? 'bg-blue-50' : 'bg-white'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">{item.item}</h4>
                    <p className="text-sm text-gray-600">{item.notes}</p>
                  </div>
                  <div className="ml-4">
                    {getStatusBadge(item.status)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border border-green-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-700">{statusCounts.Pass || 0}</div>
            <div className="text-sm text-green-600">Passed</div>
          </CardContent>
        </Card>
        <Card className="border border-red-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-700">{statusCounts.Failed || 0}</div>
            <div className="text-sm text-red-600">Failed</div>
          </CardContent>
        </Card>
        <Card className="border border-yellow-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-700">{statusCounts.Warning || 0}</div>
            <div className="text-sm text-yellow-600">Warnings</div>
          </CardContent>
        </Card>
        <Card className="border border-blue-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-700">{statusCounts.Pending || 0}</div>
            <div className="text-sm text-blue-600">Pending</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
