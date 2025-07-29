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
              {/* Debug: Show complete raw data */}
              <div className="bg-muted p-4 rounded-md">
                <h4 className="font-medium mb-2">Complete Raw Response:</h4>
                <pre className="text-xs overflow-auto max-h-60">
                  {JSON.stringify(businessPartnerData, null, 2)}
                </pre>
              </div>
              
              {/* Debug: Show uniqueBPCustomerNumbers */}
              {businessPartnerData.uniqueBPCustomerNumbers && businessPartnerData.uniqueBPCustomerNumbers.length > 0 && (
                <div className="bg-blue-50 p-4 rounded-md">
                  <h4 className="font-medium mb-2">Unique BP Customer Numbers ({businessPartnerData.uniqueBPCustomerNumbers.length}):</h4>
                  <div className="text-sm">
                    {businessPartnerData.uniqueBPCustomerNumbers.map((num, index) => (
                      <span key={index} className="inline-block bg-blue-100 px-2 py-1 rounded mr-2 mb-1">
                        {num}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Display detailed business partner results from GET_SELECTED_SOLDTO calls */}
              {businessPartnerData.businessPartnerResults && businessPartnerData.businessPartnerResults.length > 0 ? (
                <div className="space-y-4">
                  <h4 className="font-medium text-lg">Detailed Business Partner Information (GET_SELECTED_SOLDTO Results):</h4>
                  {businessPartnerData.businessPartnerResults.map((partnerResult, index) => (
                    <div key={partnerResult.bpCustomerNumber || index} className="border border-gray-200 p-4 rounded-md bg-white">
                      <h5 className="font-semibold text-md mb-3 text-blue-600">
                        Business Partner: {partnerResult.bpCustomerNumber}
                        <span className={`ml-2 px-2 py-1 text-xs rounded ${partnerResult.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {partnerResult.success ? 'Success' : 'Error'}
                        </span>
                      </h5>
                      
                      {!partnerResult.success ? (
                        <div className="text-red-600 bg-red-50 p-3 rounded-md">
                          <strong>Error:</strong> {partnerResult.error}
                        </div>
                      ) : partnerResult.data?.d?.results ? (
                        <div>
                          <h6 className="font-medium mb-2 text-gray-700">Business Partner Details:</h6>
                          {renderDataTable(partnerResult.data.d.results)}
                        </div>
                      ) : (
                        <div className="text-gray-500 italic">
                          No detailed data available for this business partner
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md">
                  <p className="text-yellow-800">No detailed business partner results found from GET_SELECTED_SOLDTO calls</p>
                </div>
              )}
              
              {/* Display initial business partners data from first API call */}
              {businessPartnerData.businessPartnersData?.d?.results && (
                <div className="space-y-4">
                  <h4 className="font-medium text-lg">Initial Business Partners Data (First API Call):</h4>
                  <div className="border border-gray-200 p-4 rounded-md bg-gray-50">
                    {renderDataTable(businessPartnerData.businessPartnersData.d.results)}
                  </div>
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