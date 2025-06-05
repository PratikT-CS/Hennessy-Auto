
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Document {
  pack: string;
  name: string;
  type: string;
  status: 'OK' | 'Missing Signature' | 'Error' | 'Processing';
}

const mockDocuments: Document[] = [
  { pack: 'Trade Pack', name: 'title.pdf', type: 'Title', status: 'OK' },
  { pack: 'Trade Pack', name: 'bill_of_sale.pdf', type: 'Bill of Sale', status: 'OK' },
  { pack: 'Tag & Title Pack', name: 'mv1.pdf', type: 'MV-1', status: 'Missing Signature' },
  { pack: 'Tag & Title Pack', name: 'mv7d.pdf', type: 'MV-7D', status: 'OK' },
  { pack: 'Compliance', name: 'odometer.pdf', type: 'Odometer', status: 'OK' },
  { pack: 'Compliance', name: 'poa.pdf', type: 'Power of Attorney', status: 'Processing' }
];

export const DocumentsTab = () => {
  const getStatusBadge = (status: Document['status']) => {
    const variants = {
      'OK': 'bg-green-100 text-green-800 border-green-200',
      'Missing Signature': 'bg-red-100 text-red-800 border-red-200',
      'Error': 'bg-red-100 text-red-800 border-red-200',
      'Processing': 'bg-blue-100 text-blue-800 border-blue-200'
    };
    const icons = {
      'OK': '✅',
      'Missing Signature': '❌',
      'Error': '❌',
      'Processing': '⏳'
    };
    return (
      <Badge className={`${variants[status]} border text-xs`}>
        {icons[status]} {status}
      </Badge>
    );
  };

  const groupedDocuments = mockDocuments.reduce((acc, doc) => {
    if (!acc[doc.pack]) {
      acc[doc.pack] = [];
    }
    acc[doc.pack].push(doc);
    return acc;
  }, {} as Record<string, Document[]>);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Documents by Pack</h3>
        <Select defaultValue="pack">
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Group by" />
          </SelectTrigger>
          <SelectContent className="bg-white border shadow-lg z-50">
            <SelectItem value="pack">📂 Group by Pack</SelectItem>
            <SelectItem value="type">📄 Group by Document Type</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          {Object.entries(groupedDocuments).map(([pack, documents]) => (
            <Card key={pack} className="border border-gray-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-700">{pack}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {documents.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 text-sm">{doc.name}</p>
                        <p className="text-xs text-gray-500">{doc.type}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(doc.status)}
                        <Button size="sm" variant="outline" className="text-xs">
                          🔍 View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="lg:sticky lg:top-6">
          <Card className="border border-gray-200">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-700">Document Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-[3/4] bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <svg className="mx-auto h-12 w-12 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-sm">Select a document to preview</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
