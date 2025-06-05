
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const analyticsData = {
  totalDeals: 23,
  avgValidationScore: 81,
  mostCommonMissingDoc: 'MV-1 Form',
  avgProcessingTime: 12.3,
  dealsByStatus: {
    validated: 15,
    incomplete: 6,
    inProgress: 2
  },
  processingTrends: [
    { month: 'Jan', deals: 18, avgScore: 78 },
    { month: 'Feb', deals: 22, avgScore: 82 },
    { month: 'Mar', deals: 25, avgScore: 79 },
    { month: 'Apr', deals: 31, avgScore: 85 },
    { month: 'May', deals: 28, avgScore: 83 },
    { month: 'Jun', deals: 23, avgScore: 81 }
  ]
};

export const Analytics = () => {
  const totalDeals = analyticsData.dealsByStatus.validated + 
                   analyticsData.dealsByStatus.incomplete + 
                   analyticsData.dealsByStatus.inProgress;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Analytics Dashboard</h2>
        <p className="text-gray-600">Performance insights and processing statistics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border border-blue-200 bg-blue-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-blue-900">Total Deals Processed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-700">{analyticsData.totalDeals}</div>
            <p className="text-xs text-blue-600 mt-1">All time</p>
          </CardContent>
        </Card>

        <Card className="border border-green-200 bg-green-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-green-900">Avg Validation Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-700">{analyticsData.avgValidationScore}%</div>
            <p className="text-xs text-green-600 mt-1">↑ 3% from last month</p>
          </CardContent>
        </Card>

        <Card className="border border-yellow-200 bg-yellow-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-yellow-900">Most Common Missing Doc</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-yellow-700">{analyticsData.mostCommonMissingDoc}</div>
            <p className="text-xs text-yellow-600 mt-1">34% of incomplete deals</p>
          </CardContent>
        </Card>

        <Card className="border border-purple-200 bg-purple-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-purple-900">Avg Processing Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-700">{analyticsData.avgProcessingTime}s</div>
            <p className="text-xs text-purple-600 mt-1">↓ 2.1s improvement</p>
          </CardContent>
        </Card>
      </div>

      {/* Deal Status Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Deal Status Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">✅ Validated</span>
                <span className="text-sm text-gray-500">{analyticsData.dealsByStatus.validated} deals</span>
              </div>
              <Progress 
                value={(analyticsData.dealsByStatus.validated / totalDeals) * 100} 
                className="h-2"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">❌ Incomplete</span>
                <span className="text-sm text-gray-500">{analyticsData.dealsByStatus.incomplete} deals</span>
              </div>
              <Progress 
                value={(analyticsData.dealsByStatus.incomplete / totalDeals) * 100} 
                className="h-2"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">🟡 In Progress</span>
                <span className="text-sm text-gray-500">{analyticsData.dealsByStatus.inProgress} deals</span>
              </div>
              <Progress 
                value={(analyticsData.dealsByStatus.inProgress / totalDeals) * 100} 
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Processing Efficiency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <div>
                  <div className="font-medium text-green-900">Document Classification</div>
                  <div className="text-sm text-green-600">Auto-categorization accuracy</div>
                </div>
                <div className="text-2xl font-bold text-green-700">94%</div>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <div>
                  <div className="font-medium text-blue-900">Data Extraction</div>
                  <div className="text-sm text-blue-600">Field extraction confidence</div>
                </div>
                <div className="text-2xl font-bold text-blue-700">87%</div>
              </div>
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                <div>
                  <div className="font-medium text-purple-900">Validation Rules</div>
                  <div className="text-sm text-purple-600">Checklist automation rate</div>
                </div>
                <div className="text-2xl font-bold text-purple-700">91%</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trends */}
      <Card className="border border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Monthly Processing Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-6 gap-4">
            {analyticsData.processingTrends.map((month, index) => (
              <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-xs text-gray-500 mb-1">{month.month}</div>
                <div className="text-lg font-bold text-gray-900">{month.deals}</div>
                <div className="text-xs text-gray-600">deals</div>
                <div className="text-xs text-blue-600 mt-1">{month.avgScore}% avg</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Common Issues */}
      <Card className="border border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Most Common Issues</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 border border-red-200 bg-red-50 rounded-lg">
              <div>
                <div className="font-medium text-red-900">Missing MV-1 Form</div>
                <div className="text-sm text-red-600">Required state document not uploaded</div>
              </div>
              <div className="text-red-700 font-semibold">34%</div>
            </div>
            <div className="flex justify-between items-center p-3 border border-orange-200 bg-orange-50 rounded-lg">
              <div>
                <div className="font-medium text-orange-900">Unsigned Title</div>
                <div className="text-sm text-orange-600">Title document lacks required signature</div>
              </div>
              <div className="text-orange-700 font-semibold">28%</div>
            </div>
            <div className="flex justify-between items-center p-3 border border-yellow-200 bg-yellow-50 rounded-lg">
              <div>
                <div className="font-medium text-yellow-900">Insurance Verification</div>
                <div className="text-sm text-yellow-600">Missing or expired insurance documentation</div>
              </div>
              <div className="text-yellow-700 font-semibold">19%</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
