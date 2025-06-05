
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { UploadModal } from './UploadModal';
import { BulkUploadModal } from './BulkUploadModal';
import { FileUp, FolderUp } from 'lucide-react';

export const UploadDeal = () => {
  const [isBulkMode, setIsBulkMode] = useState(false);

  return (
    <Card className="max-w-4xl mx-auto shadow-sm border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl font-semibold text-gray-900">
              {isBulkMode ? 'Upload Bulk Deals' : 'Upload New Deal'}
            </CardTitle>
            <p className="text-gray-600 mt-2">
              {isBulkMode 
                ? 'Upload multiple deals at once with batch processing capabilities'
                : 'Upload documents for a single vehicle deal with detailed processing and validation'
              }
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <FileUp className={`h-5 w-5 ${!isBulkMode ? 'text-blue-500' : 'text-gray-400'}`} />
            <div className="flex items-center space-x-2">
              <Label htmlFor="bulk-mode" className="text-sm font-medium">
                Bulk Mode
              </Label>
              <Switch
                id="bulk-mode"
                checked={isBulkMode}
                onCheckedChange={setIsBulkMode}
              />
            </div>
            <FolderUp className={`h-5 w-5 ${isBulkMode ? 'text-green-500' : 'text-gray-400'}`} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isBulkMode ? (
          <BulkUploadModal onClose={() => setIsBulkMode(false)} />
        ) : (
          <UploadModal onClose={() => {}} />
        )}
      </CardContent>
    </Card>
  );
};
