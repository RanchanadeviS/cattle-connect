import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { FileText, Download, Eye, Calendar, Shield, Heart } from "lucide-react";
import { toast } from "sonner";

interface HealthRecord {
  id: string;
  cattle_id: number;
  document_type: string;
  file_name: string;
  file_path: string;
  issued_date: string;
  expiry_date: string;
  issued_by: string;
  cattle_title?: string;
}

interface HealthReportGeneratorProps {
  healthRecords: HealthRecord[];
}

const HealthReportGenerator = ({ healthRecords }: HealthReportGeneratorProps) => {
  const [selectedCattle, setSelectedCattle] = useState<string>("all");
  const [selectedDocTypes, setSelectedDocTypes] = useState<string[]>([]);
  const [reportType, setReportType] = useState<string>("comprehensive");
  const [isGenerating, setIsGenerating] = useState(false);

  // Get unique cattle from health records
  const uniqueCattle = Array.from(
    new Map(
      healthRecords
        .filter(record => record.cattle_title)
        .map(record => [record.cattle_id, { id: record.cattle_id, title: record.cattle_title }])
    ).values()
  );

  // Get unique document types
  const documentTypes = Array.from(new Set(healthRecords.map(record => record.document_type)));

  const handleDocTypeChange = (docType: string, checked: boolean) => {
    if (checked) {
      setSelectedDocTypes([...selectedDocTypes, docType]);
    } else {
      setSelectedDocTypes(selectedDocTypes.filter(type => type !== docType));
    }
  };

  const generateReport = async () => {
    setIsGenerating(true);
    
    try {
      // Filter records based on selections
      let filteredRecords = healthRecords;
      
      if (selectedCattle !== "all") {
        filteredRecords = filteredRecords.filter(record => 
          record.cattle_id.toString() === selectedCattle
        );
      }
      
      if (selectedDocTypes.length > 0) {
        filteredRecords = filteredRecords.filter(record =>
          selectedDocTypes.includes(record.document_type)
        );
      }

      // Generate HTML report
      const reportHTML = generateReportHTML(filteredRecords);
      
      // Create and download the report
      const blob = new Blob([reportHTML], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `health-report-${new Date().toISOString().split('T')[0]}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('Health report generated successfully');
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate health report');
    } finally {
      setIsGenerating(false);
    }
  };

  const previewReport = () => {
    let filteredRecords = healthRecords;
    
    if (selectedCattle !== "all") {
      filteredRecords = filteredRecords.filter(record => 
        record.cattle_id.toString() === selectedCattle
      );
    }
    
    if (selectedDocTypes.length > 0) {
      filteredRecords = filteredRecords.filter(record =>
        selectedDocTypes.includes(record.document_type)
      );
    }

    const reportHTML = generateReportHTML(filteredRecords);
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(reportHTML);
      newWindow.document.close();
    }
  };

  const generateReportHTML = (records: HealthRecord[]) => {
    const reportDate = new Date().toLocaleDateString();
    const cattleTitle = selectedCattle === "all" ? "All Cattle" : 
      uniqueCattle.find(c => c.id.toString() === selectedCattle)?.title || "Selected Cattle";

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Cattle Health Report - ${cattleTitle}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            line-height: 1.6;
            color: #333;
          }
          .header {
            text-align: center;
            border-bottom: 2px solid #2D5016;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .header h1 {
            color: #2D5016;
            margin: 0;
          }
          .header .subtitle {
            color: #666;
            margin: 10px 0;
          }
          .section {
            margin-bottom: 30px;
          }
          .section h2 {
            color: #2D5016;
            border-bottom: 1px solid #ddd;
            padding-bottom: 10px;
          }
          .record-card {
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 15px;
            background-color: #f9f9f9;
          }
          .record-header {
            font-weight: bold;
            color: #2D5016;
            margin-bottom: 10px;
          }
          .record-detail {
            margin: 5px 0;
          }
          .record-detail strong {
            color: #555;
          }
          .summary-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
          }
          .summary-table th,
          .summary-table td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
          }
          .summary-table th {
            background-color: #2D5016;
            color: white;
          }
          .summary-table tr:nth-child(even) {
            background-color: #f9f9f9;
          }
          .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            color: #666;
            font-size: 14px;
          }
          .status-active { color: #10B981; }
          .status-expired { color: #EF4444; }
          .status-expiring { color: #F59E0B; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🐄 Cattle Health Report</h1>
          <div class="subtitle">
            <strong>Cattle:</strong> ${cattleTitle}<br>
            <strong>Report Date:</strong> ${reportDate}<br>
            <strong>Total Records:</strong> ${records.length}
          </div>
        </div>

        <div class="section">
          <h2>📊 Health Records Summary</h2>
          <table class="summary-table">
            <thead>
              <tr>
                <th>Document Type</th>
                <th>Count</th>
                <th>Latest Date</th>
              </tr>
            </thead>
            <tbody>
              ${documentTypes.map(type => {
                const typeRecords = records.filter(r => r.document_type === type);
                const latestRecord = typeRecords.sort((a, b) => 
                  new Date(b.issued_date).getTime() - new Date(a.issued_date).getTime()
                )[0];
                return `
                  <tr>
                    <td>${type}</td>
                    <td>${typeRecords.length}</td>
                    <td>${latestRecord ? new Date(latestRecord.issued_date).toLocaleDateString() : 'N/A'}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>

        <div class="section">
          <h2>📋 Detailed Health Records</h2>
          ${records.length === 0 ? 
            '<p style="text-align: center; color: #666;">No health records found for the selected criteria.</p>' :
            records.map(record => {
              const issuedDate = new Date(record.issued_date);
              const expiryDate = record.expiry_date ? new Date(record.expiry_date) : null;
              const today = new Date();
              
              let statusClass = 'status-active';
              let statusText = 'Active';
              
              if (expiryDate) {
                if (expiryDate < today) {
                  statusClass = 'status-expired';
                  statusText = 'Expired';
                } else {
                  const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
                  if (daysUntilExpiry <= 30) {
                    statusClass = 'status-expiring';
                    statusText = 'Expiring Soon';
                  }
                }
              }

              return `
                <div class="record-card">
                  <div class="record-header">
                    ${record.document_type} - ${record.file_name}
                  </div>
                  ${record.cattle_title ? `<div class="record-detail"><strong>Cattle:</strong> ${record.cattle_title}</div>` : ''}
                  <div class="record-detail"><strong>Issued Date:</strong> ${issuedDate.toLocaleDateString()}</div>
                  ${record.expiry_date ? `<div class="record-detail"><strong>Expiry Date:</strong> ${new Date(record.expiry_date).toLocaleDateString()} <span class="${statusClass}">(${statusText})</span></div>` : ''}
                  ${record.issued_by ? `<div class="record-detail"><strong>Issued By:</strong> ${record.issued_by}</div>` : ''}
                </div>
              `;
            }).join('')
          }
        </div>

        <div class="footer">
          <p>This report was generated by HerdHub on ${reportDate}</p>
          <p>For questions about this report, please contact your veterinarian or cattle management team.</p>
        </div>
      </body>
      </html>
    `;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center mb-2">
          <FileText className="mr-2 h-6 w-6 text-primary" />
          Health Report Generator
        </h2>
        <p className="text-muted-foreground">
          Generate comprehensive health reports for your cattle records
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Report Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5" />
              Report Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Select Cattle</label>
              <Select value={selectedCattle} onValueChange={setSelectedCattle}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cattle</SelectItem>
                  {uniqueCattle.map(cattle => (
                    <SelectItem key={cattle.id} value={cattle.id.toString()}>
                      {cattle.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Report Type</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="comprehensive">Comprehensive Report</SelectItem>
                  <SelectItem value="summary">Summary Report</SelectItem>
                  <SelectItem value="vaccination">Vaccination Records Only</SelectItem>
                  <SelectItem value="health_certificates">Health Certificates Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-3 block">Document Types to Include</label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {documentTypes.map(docType => (
                  <div key={docType} className="flex items-center space-x-2">
                    <Checkbox
                      id={docType}
                      checked={selectedDocTypes.includes(docType)}
                      onCheckedChange={(checked) => handleDocTypeChange(docType, checked as boolean)}
                    />
                    <label htmlFor={docType} className="text-sm cursor-pointer">
                      {docType}
                    </label>
                  </div>
                ))}
              </div>
              {documentTypes.length === 0 && (
                <p className="text-sm text-muted-foreground">No document types available</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Report Preview & Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Heart className="mr-2 h-5 w-5" />
              Report Preview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Selected Cattle:</span>
                <Badge variant="outline">
                  {selectedCattle === "all" ? "All Cattle" : 
                    uniqueCattle.find(c => c.id.toString() === selectedCattle)?.title || "Unknown"
                  }
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Document Types:</span>
                <Badge variant="outline">
                  {selectedDocTypes.length === 0 ? "All Types" : `${selectedDocTypes.length} Selected`}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Records:</span>
                <Badge variant="secondary">
                  {(() => {
                    let filteredCount = healthRecords;
                    if (selectedCattle !== "all") {
                      filteredCount = filteredCount.filter(record => 
                        record.cattle_id.toString() === selectedCattle
                      );
                    }
                    if (selectedDocTypes.length > 0) {
                      filteredCount = filteredCount.filter(record =>
                        selectedDocTypes.includes(record.document_type)
                      );
                    }
                    return filteredCount.length;
                  })()}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Report Date:</span>
                <Badge variant="outline">
                  {new Date().toLocaleDateString()}
                </Badge>
              </div>
            </div>

            <div className="pt-4 space-y-2">
              <Button 
                onClick={previewReport}
                variant="outline" 
                className="w-full"
                disabled={healthRecords.length === 0}
              >
                <Eye className="mr-2 h-4 w-4" />
                Preview Report
              </Button>
              
              <Button 
                onClick={generateReport}
                className="w-full"
                disabled={isGenerating || healthRecords.length === 0}
              >
                <Download className="mr-2 h-4 w-4" />
                {isGenerating ? 'Generating...' : 'Download Report'}
              </Button>
            </div>

            {healthRecords.length === 0 && (
              <div className="text-center py-6">
                <FileText className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  No health records available to generate reports
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            Quick Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <p className="text-2xl font-bold text-primary">{healthRecords.length}</p>
              <p className="text-sm text-muted-foreground">Total Records</p>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{uniqueCattle.length}</p>
              <p className="text-sm text-muted-foreground">Cattle Tracked</p>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{documentTypes.length}</p>
              <p className="text-sm text-muted-foreground">Document Types</p>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <p className="text-2xl font-bold text-yellow-600">
                {healthRecords.filter(record => {
                  if (!record.expiry_date) return false;
                  const expiry = new Date(record.expiry_date);
                  const today = new Date();
                  const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 3600 * 24));
                  return daysUntilExpiry <= 30 && daysUntilExpiry >= 0;
                }).length}
              </p>
              <p className="text-sm text-muted-foreground">Expiring Soon</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HealthReportGenerator;