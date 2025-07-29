import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { sapBusinessPartnerService } from '@/services/sapBusinessPartnerService';
import { SapBusinessPartnerApiResponse, SapBusinessPartnerAddress } from '@/lib/dto/sapBusinessPartner.dto';
import { Loader2, Search } from 'lucide-react';

const SapBusinessPartner: React.FC = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    soldTo: '',
    salesOrg: '',
    division: '',
    distributionChannel: '',
  });
  const [businessPartnerData, setBusinessPartnerData] = useState<SapBusinessPartnerApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.soldTo.trim()) {
      toast({
        title: t('validation.error'),
        description: 'Sold To is required',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    setBusinessPartnerData(null);

    try {
      const result = await sapBusinessPartnerService.getBusinessPartner(formData);
      
      // RAW DATA LOGGING - Log everything for debugging
      console.log('=== RAW API RESPONSE START ===');
      console.log('Raw result type:', typeof result);
      console.log('Raw result:', JSON.stringify(result, null, 2));
      console.log('Raw result keys:', result ? Object.keys(result) : 'No keys');
      console.log('Raw result.success:', (result as any)?.success);
      console.log('Raw result.businessPartnersData:', (result as any)?.businessPartnersData);
      console.log('Raw result.businessPartnerResults:', (result as any)?.businessPartnerResults);
      console.log('Raw result.uniqueBPCustomerNumbers:', (result as any)?.uniqueBPCustomerNumbers);
      console.log('=== RAW API RESPONSE END ===');
      
      // Simple approach - just use whatever we get and display it
      if (result && typeof result === 'object') {
        const resultAny = result as any;
        const processedData: SapBusinessPartnerApiResponse = {
          success: true,
          businessPartnersData: resultAny.businessPartnersData || result,
          businessPartnerResults: resultAny.businessPartnerResults || [],
          uniqueBPCustomerNumbers: resultAny.uniqueBPCustomerNumbers || [],
          requestData: resultAny.requestData || formData
        };
        
        setBusinessPartnerData(processedData);
        setError(null);
        
        toast({
          title: t('success'),
          description: 'Data retrieved successfully',
        });
      } else {
        setError('No data received from API');
        toast({
          title: t('error'),
          description: 'No data received from API',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error fetching business partner:', error);
      
      // Try to extract any useful data from the error
      try {
        if (error && typeof error === 'object' && 'response' in error) {
          const errorResponse = (error as any).response;
          if (errorResponse?.data) {
            setBusinessPartnerData({
              success: false,
              businessPartnersData: errorResponse.data,
              businessPartnerResults: [],
              uniqueBPCustomerNumbers: [],
              requestData: formData
            });
            toast({
              title: 'Partial Data',
              description: 'Some data retrieved despite errors',
              variant: 'default',
            });
            return;
          }
        }
      } catch (fallbackError) {
        console.warn('[SAP] Fallback processing failed:', fallbackError);
      }
      
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while fetching business partner data';
      setError(errorMessage);
      toast({
        title: t('error'),
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderDataTable = (data: any) => {
    if (!data || (Array.isArray(data) && data.length === 0)) {
      return (
        <div className="text-center py-4 text-muted-foreground">
          No data available
        </div>
      );
    }

    // Handle single object or array of objects
    const dataArray = Array.isArray(data) ? data : [data];
    
    // Get all fields across all objects to determine columns
    const allFields = new Set<string>();
    dataArray.forEach(item => {
      if (item && typeof item === 'object') {
        Object.keys(item).forEach(key => {
          allFields.add(key);
        });
      }
    });

    const fieldArray = Array.from(allFields);

    if (fieldArray.length === 0) {
      return (
        <div className="text-center py-4 text-muted-foreground">
          No valid data structure found
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {fieldArray.map(field => (
                <TableHead key={field} className="whitespace-nowrap">
                  {field.replace(/([A-Z])/g, ' $1').trim()}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {dataArray.map((item, index) => (
              <TableRow key={index}>
                {fieldArray.map(field => {
                  const value = item?.[field];
                  const displayValue = value === null || value === undefined ? '' : String(value);
                  return (
                    <TableCell key={field} className="whitespace-nowrap">
                      {displayValue}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{t('admin.sapBusinessPartner.title', 'SAP Business Partner')}</h1>
      </div>

      {/* Search Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Business Partner
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="soldTo">
                  Sold To <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="soldTo"
                  name="soldTo"
                  value={formData.soldTo}
                  onChange={handleInputChange}
                  placeholder="Enter Sold To"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="salesOrg">Sales Organization</Label>
                <Input
                  id="salesOrg"
                  name="salesOrg"
                  value={formData.salesOrg}
                  onChange={handleInputChange}
                  placeholder="Enter Sales Org"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="division">Division</Label>
                <Input
                  id="division"
                  name="division"
                  value={formData.division}
                  onChange={handleInputChange}
                  placeholder="Enter Division"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="distributionChannel">Distribution Channel</Label>
                <Input
                  id="distributionChannel"
                  name="distributionChannel"
                  value={formData.distributionChannel}
                  onChange={handleInputChange}
                  placeholder="Enter Distribution Channel"
                />
              </div>
            </div>
            
            <Button type="submit" disabled={isLoading} className="flex items-center gap-2">
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              Search Business Partner
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="text-destructive">
              <strong>Error:</strong> {error}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results Display */}
      {businessPartnerData && (
        <Card>
          <CardHeader>
            <CardTitle>Business Partner Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Show raw data first for debugging */}
              <div className="bg-muted p-4 rounded-md">
                <h4 className="font-medium mb-2">Raw Response Data:</h4>
                <pre className="text-xs overflow-auto max-h-60">
                  {JSON.stringify(businessPartnerData, null, 2)}
                </pre>
              </div>
              
              {/* Display business partner results if available */}
              {businessPartnerData.businessPartnerResults && businessPartnerData.businessPartnerResults.length > 0 ? (
                <div className="space-y-4">
                  <h4 className="font-medium">Business Partner Results:</h4>
                  {businessPartnerData.businessPartnerResults.map((partnerResult, index) => (
                    <div key={partnerResult.bpCustomerNumber || index} className="border p-4 rounded-md">
                      <h5 className="font-medium mb-2">BP: {partnerResult.bpCustomerNumber}</h5>
                      {partnerResult.data?.d?.results && renderDataTable(partnerResult.data.d.results)}
                    </div>
                  ))}
                </div>
              ) : null}
              
              {/* Display business partners data if available */}
              {businessPartnerData.businessPartnersData?.d?.results && (
                <div className="space-y-4">
                  <h4 className="font-medium">Business Partners Data:</h4>
                  {renderDataTable(businessPartnerData.businessPartnersData.d.results)}
                </div>
              )}
              
              {/* Display any other data structure */}
              {businessPartnerData.businessPartnersData && !businessPartnerData.businessPartnersData.d && (
                <div className="space-y-4">
                  <h4 className="font-medium">Raw Business Partner Data:</h4>
                  {renderDataTable(businessPartnerData.businessPartnersData)}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SapBusinessPartner;