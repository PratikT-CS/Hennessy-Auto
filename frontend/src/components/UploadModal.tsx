
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Upload, X, Check, Circle, Clock, AlertCircle, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UploadModalProps {
  onClose: () => void;
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  status: 'waiting' | 'uploading' | 'classifying' | 'extracting' | 'validating' | 'completed' | 'error';
  progress: number;
  processingStep?: string;
  classification?: string;
  extractedFields?: number;
}

export const UploadModal = ({ onClose }: UploadModalProps) => {
  const { toast } = useToast();
  const [dealId, setDealId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [notes, setNotes] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleFileUpload = (files: FileList) => {
    const newFiles: UploadedFile[] = Array.from(files).map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      status: 'waiting',
      progress: 0
    }));
    setUploadedFiles(prev => [...prev, ...newFiles]);
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

  const removeFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== id));
  };

  const getStatusIcon = (status: UploadedFile['status']) => {
    switch (status) {
      case 'waiting':
        return <Circle className="h-4 w-4 text-gray-400" />;
      case 'uploading':
        return <Upload className="h-4 w-4 text-blue-500 animate-pulse" />;
      case 'classifying':
        return <FileText className="h-4 w-4 text-purple-500 animate-pulse" />;
      case 'extracting':
        return <Clock className="h-4 w-4 text-orange-500 animate-pulse" />;
      case 'validating':
        return <AlertCircle className="h-4 w-4 text-yellow-500 animate-pulse" />;
      case 'completed':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'error':
        return <X className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusText = (file: UploadedFile) => {
    switch (file.status) {
      case 'waiting': return 'Waiting to process';
      case 'uploading': return 'Uploading...';
      case 'classifying': return `Classifying document type${file.classification ? `: ${file.classification}` : ''}`;
      case 'extracting': return `Extracting data${file.extractedFields ? ` (${file.extractedFields} fields found)` : ''}`;
      case 'validating': return 'Validating against checklist';
      case 'completed': return `Completed${file.classification ? ` - ${file.classification}` : ''}`;
      case 'error': return 'Processing failed';
    }
  };

  const getStatusColor = (status: UploadedFile['status']) => {
    switch (status) {
      case 'waiting': return 'bg-gray-200';
      case 'uploading': return 'bg-blue-500';
      case 'classifying': return 'bg-purple-500';
      case 'extracting': return 'bg-orange-500';
      case 'validating': return 'bg-yellow-500';
      case 'completed': return 'bg-green-500';
      case 'error': return 'bg-red-500';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const simulateProcessing = (fileId: string) => {
    const stages = [
      { status: 'uploading' as const, duration: 1000, progress: 20 },
      { 
        status: 'classifying' as const, 
        duration: 2000, 
        progress: 40,
        update: { classification: 'Title Document' }
      },
      { 
        status: 'extracting' as const, 
        duration: 3000, 
        progress: 70,
        update: { extractedFields: 8 }
      },
      { status: 'validating' as const, duration: 1500, progress: 90 },
      { status: 'completed' as const, duration: 500, progress: 100 }
    ];

    let currentStage = 0;

    const processStage = () => {
      if (currentStage >= stages.length) return;

      const stage = stages[currentStage];
      
      setUploadedFiles(prev => prev.map(file => 
        file.id === fileId 
          ? { 
              ...file, 
              status: stage.status, 
              progress: stage.progress,
              ...(stage.update || {})
            }
          : file
      ));

      currentStage++;
      if (currentStage < stages.length) {
        setTimeout(processStage, stage.duration);
      }
    };

    processStage();
  };

  const handleSubmit = () => {
    if (!customerName.trim()) {
      toast({
        title: "Customer name required",
        description: "Please enter a customer name before submitting.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitted(true);
    
    // Auto-generate deal ID if not provided
    if (!dealId) {
      setDealId(`DEAL-${Date.now()}`);
    }

    // Start processing each file
    uploadedFiles.forEach(file => {
      simulateProcessing(file.id);
    });

    toast({
      title: "Processing started",
      description: "Your documents are being processed. You can monitor the progress below.",
    });
  };

  // Check if all files are completed
  const allFilesCompleted = uploadedFiles.length > 0 && uploadedFiles.every(file => 
    file.status === 'completed' || file.status === 'error'
  );

  useEffect(() => {
    if (allFilesCompleted && isSubmitted) {
      const successCount = uploadedFiles.filter(file => file.status === 'completed').length;
      const errorCount = uploadedFiles.filter(file => file.status === 'error').length;
      
      toast({
        title: "Processing complete",
        description: `${successCount} documents processed successfully${errorCount > 0 ? `, ${errorCount} failed` : ''}.`,
        variant: errorCount > 0 ? "destructive" : "default"
      });
    }
  }, [allFilesCompleted, isSubmitted, uploadedFiles, toast]);

  return (
    <div className="space-y-6">
      {/* Deal Information Form */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="dealId">Deal ID</Label>
          <Input
            id="dealId"
            value={dealId}
            onChange={(e) => setDealId(e.target.value)}
            placeholder="Auto-generated or manual"
            className="mt-1"
            disabled={isSubmitted}
          />
        </div>
        <div>
          <Label htmlFor="customerName">Customer Name *</Label>
          <Input
            id="customerName"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Enter customer name"
            className="mt-1"
            disabled={isSubmitted}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="notes">Notes (Optional)</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add any relevant notes or tags..."
          className="mt-1"
          rows={3}
          disabled={isSubmitted}
        />
      </div>

      {/* File Upload Widget */}
      {!isSubmitted && (
        <div>
          <Label>Upload Documents</Label>
          <div
            className={`mt-2 border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-lg font-medium text-gray-900 mb-2">
              Drag and drop files here, or{' '}
              <label className="text-blue-600 cursor-pointer hover:text-blue-700 underline">
                browse
                <input
                  type="file"
                  multiple
                  accept=".pdf,.png,.jpg,.jpeg,.zip"
                  className="hidden"
                  onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                />
              </label>
            </p>
            <p className="text-gray-500">Accepts: PDF, PNG, JPG, ZIP</p>
          </div>
        </div>
      )}

      {/* Document Preview with Real-time Status */}
      {uploadedFiles.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900">
                Processing Documents ({uploadedFiles.filter(f => f.status === 'completed').length}/{uploadedFiles.length} completed)
              </h3>
              {isSubmitted && !allFilesCompleted && (
                <div className="text-sm text-blue-600 animate-pulse">
                  ⚡ Processing in real-time...
                </div>
              )}
            </div>
            <div className="space-y-3">
              {uploadedFiles.map((file) => (
                <div key={file.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(file.status)}
                      <div>
                        <p className="font-medium text-gray-900">{file.name}</p>
                        <p className="text-sm text-gray-500">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>
                    {!isSubmitted && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(file.id)}
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
                        <span className="text-gray-600">{getStatusText(file)}</span>
                        <span className="text-gray-500">{file.progress}%</span>
                      </div>
                      <Progress 
                        value={file.progress} 
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
        <Button variant="outline" onClick={onClose} disabled={isSubmitted && !allFilesCompleted}>
          {allFilesCompleted ? 'Close' : 'Cancel'}
        </Button>
        <Button 
          onClick={handleSubmit}
          disabled={uploadedFiles.length === 0 || isSubmitted || !customerName.trim()}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isSubmitted ? 'Processing...' : 'Submit & Process'}
        </Button>
      </div>
    </div>
  );
};
