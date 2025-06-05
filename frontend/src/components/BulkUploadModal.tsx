
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Upload, X, Check, Circle, Clock, AlertCircle, FileText, FolderOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BulkUploadModalProps {
  onClose: () => void;
}

interface BulkDeal {
  id: string;
  folderName: string;
  fileCount: number;
  status: 'waiting' | 'processing' | 'completed' | 'error';
  progress: number;
  customerName?: string;
  dealId?: string;
}

export const BulkUploadModal = ({ onClose }: BulkUploadModalProps) => {
  const { toast } = useToast();
  const [uploadedDeals, setUploadedDeals] = useState<BulkDeal[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleFileUpload = (files: FileList) => {
    // Group files by folder structure or create individual deals
    const dealGroups: { [key: string]: File[] } = {};
    
    Array.from(files).forEach(file => {
      const folderName = file.webkitRelativePath 
        ? file.webkitRelativePath.split('/')[0] 
        : `Deal-${Math.random().toString(36).substr(2, 6)}`;
      
      if (!dealGroups[folderName]) {
        dealGroups[folderName] = [];
      }
      dealGroups[folderName].push(file);
    });

    const newDeals: BulkDeal[] = Object.entries(dealGroups).map(([folderName, files]) => ({
      id: Math.random().toString(36).substr(2, 9),
      folderName,
      fileCount: files.length,
      status: 'waiting',
      progress: 0
    }));

    setUploadedDeals(prev => [...prev, ...newDeals]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const removeDeal = (id: string) => {
    setUploadedDeals(prev => prev.filter(deal => deal.id !== id));
  };

  const getStatusIcon = (status: BulkDeal['status']) => {
    switch (status) {
      case 'waiting':
        return <Circle className="h-4 w-4 text-gray-400" />;
      case 'processing':
        return <Clock className="h-4 w-4 text-blue-500 animate-pulse" />;
      case 'completed':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'error':
        return <X className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusText = (deal: BulkDeal) => {
    switch (deal.status) {
      case 'waiting': return 'Waiting to process';
      case 'processing': return 'Processing documents...';
      case 'completed': return `Completed - ${deal.fileCount} documents processed`;
      case 'error': return 'Processing failed';
    }
  };

  const simulateBulkProcessing = (dealId: string) => {
    const stages = [
      { progress: 25, duration: 2000 },
      { progress: 50, duration: 3000 },
      { progress: 75, duration: 2500 },
      { progress: 100, duration: 1000 }
    ];

    setUploadedDeals(prev => prev.map(deal => 
      deal.id === dealId 
        ? { 
            ...deal, 
            status: 'processing',
            dealId: `DEAL-${Date.now()}`,
            customerName: `Customer ${Math.floor(Math.random() * 1000)}`
          }
        : deal
    ));

    let currentStage = 0;
    
    const processStage = () => {
      if (currentStage >= stages.length) {
        setUploadedDeals(prev => prev.map(deal => 
          deal.id === dealId ? { ...deal, status: 'completed', progress: 100 } : deal
        ));
        return;
      }

      const stage = stages[currentStage];
      
      setUploadedDeals(prev => prev.map(deal => 
        deal.id === dealId ? { ...deal, progress: stage.progress } : deal
      ));

      currentStage++;
      if (currentStage <= stages.length) {
        setTimeout(processStage, stage.duration);
      }
    };

    setTimeout(processStage, 1000);
  };

  const handleSubmit = () => {
    if (uploadedDeals.length === 0) {
      toast({
        title: "No deals to process",
        description: "Please upload some deal folders before submitting.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitted(true);
    
    // Start processing each deal with staggered timing
    uploadedDeals.forEach((deal, index) => {
      setTimeout(() => {
        simulateBulkProcessing(deal.id);
      }, index * 1000);
    });

    toast({
      title: "Bulk processing started",
      description: `Processing ${uploadedDeals.length} deals. You can monitor the progress below.`,
    });
  };

  const allDealsCompleted = uploadedDeals.length > 0 && uploadedDeals.every(deal => 
    deal.status === 'completed' || deal.status === 'error'
  );

  useEffect(() => {
    if (allDealsCompleted && isSubmitted) {
      const successCount = uploadedDeals.filter(deal => deal.status === 'completed').length;
      const errorCount = uploadedDeals.filter(deal => deal.status === 'error').length;
      
      toast({
        title: "Bulk processing complete",
        description: `${successCount} deals processed successfully${errorCount > 0 ? `, ${errorCount} failed` : ''}.`,
        variant: errorCount > 0 ? "destructive" : "default"
      });
    }
  }, [allDealsCompleted, isSubmitted, uploadedDeals, toast]);

  return (
    <div className="space-y-6">
      {/* Bulk Upload Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">Bulk Upload Instructions</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Upload multiple deals by organizing documents in folders</li>
          <li>• Each folder should contain all documents for one deal</li>
          <li>• Supported formats: PDF, PNG, JPG, ZIP</li>
          <li>• The system will automatically process each deal separately</li>
        </ul>
      </div>

      {/* File Upload Widget */}
      {!isSubmitted && (
        <div>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragOver ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-gray-400'
            }`}
            onDrop={(e: React.DragEvent) => {
              e.preventDefault();
              setIsDragOver(false);
              const files = e.dataTransfer.files;
              if (files.length > 0) {
                handleFileUpload(files);
              }
            }}
            onDragOver={(e: React.DragEvent) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={(e: React.DragEvent) => {
              e.preventDefault();
              setIsDragOver(false);
            }}
          >
            <FolderOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-lg font-medium text-gray-900 mb-2">
              Drag and drop folders here, or{' '}
              <label className="text-green-600 cursor-pointer hover:text-green-700 underline">
                browse
                <input
                  type="file"
                  multiple
                  {...({ webkitdirectory: '' } as any)}
                  className="hidden"
                  onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                />
              </label>
            </p>
            <p className="text-gray-500">Upload entire folders containing deal documents</p>
          </div>
        </div>
      )}

      {/* Deals Preview */}
      {uploadedDeals.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900">
                Processing Deals ({uploadedDeals.filter(d => d.status === 'completed').length}/{uploadedDeals.length} completed)
              </h3>
              {isSubmitted && !allDealsCompleted && (
                <div className="text-sm text-blue-600 animate-pulse">
                  ⚡ Processing in bulk...
                </div>
              )}
            </div>
            <div className="space-y-3">
              {uploadedDeals.map((deal) => (
                <div key={deal.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(deal.status)}
                      <div>
                        <p className="font-medium text-gray-900">{deal.folderName}</p>
                        <p className="text-sm text-gray-500">
                          {deal.fileCount} documents
                          {deal.dealId && ` • Deal ID: ${deal.dealId}`}
                          {deal.customerName && ` • ${deal.customerName}`}
                        </p>
                      </div>
                    </div>
                    {!isSubmitted && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeDeal(deal.id)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  {/* Progress Bar */}
                  {isSubmitted && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">{getStatusText(deal)}</span>
                        <span className="text-gray-500">{deal.progress}%</span>
                      </div>
                      <Progress 
                        value={deal.progress} 
                        className="h-2"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3">
        <Button variant="outline" onClick={onClose} disabled={isSubmitted && !allDealsCompleted}>
          {allDealsCompleted ? 'Close' : 'Cancel'}
        </Button>
        <Button 
          onClick={handleSubmit}
          disabled={uploadedDeals.length === 0 || isSubmitted}
          className="bg-green-600 hover:bg-green-700"
        >
          {isSubmitted ? 'Processing...' : 'Submit & Process All Deals'}
        </Button>
      </div>
    </div>
  );
};
