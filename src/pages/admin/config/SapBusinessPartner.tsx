import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { sapBusinessPartnerService } from '@/services/sapBusinessPartnerService';
import { SapBusinessPartnerApiResponse } from '@/lib/dto/sapBusinessPartner.dto';
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

  // Convert SAP date format to readable format
  const convertSapDate = (sapDate: string): string => {
    if (!sapDate) return 'N/A';
    try {
      // Handle SAP OData date format like "/Date(1507161600000+0000)/"
      const match = sapDate.match(/\/Date\((\d+)([+-]\d{4})?\)\//);
      if (match) {
        const timestamp = parseInt(match[1]);
        return new Date(timestamp).toLocaleDateString();
      }
      return sapDate;
    } catch {
      return sapDate;
    }
  };

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
      console.log('🚀 Starting SAP API call...');
      const result = await sapBusinessPartnerService.getBusinessPartner(formData);
      
      console.log('🔍 RAW SAP API Response (typeof):', typeof result);
      console.log('🔍 RAW SAP API Response (keys):', result ? Object.keys(result) : 'null');
      console.log('🔍 RAW SAP API Response (full):', JSON.stringify(result, null, 2));
      
      // FORCE SUCCESS - Always show data regardless of structure
      setBusinessPartnerData(result as any);
      setError(null);
      
      toast({
        title: 'Data Retrieved',
        description: 'Check the results section below',
      });
    } catch (error) {
      console.error('Error fetching business partner:', error);
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

  const renderRawData = (data: any) => {
    if (!data) return <div>No data</div>;
    
    return (
      <div className="bg-gray-50 p-4 rounded-md">
        <pre className="text-xs overflow-auto max-h-96 whitespace-pre-wrap">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    );
  };

  const renderAddressAsStrings = (address: any) => {
    if (!address) return <div>No address data</div>;

    console.log('📍 Raw address data:', address);

    // Show all fields as raw strings
    const allFields = Object.keys(address);
    
    return (
      <div className="space-y-1">
        {allFields.map((field) => (
          <div key={field} className="flex text-sm">
            <strong className="w-48 text-gray-700">{field}:</strong>
            <span className="text-gray-900">{String(address[field] || '')}</span>
          </div>
        ))}
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
            <CardTitle>Business Partner Results (Raw Data)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Show complete raw response */}
              <div>
                <h4 className="font-medium text-lg mb-2">Complete Raw Response:</h4>
                {renderRawData(businessPartnerData)}
              </div>
              
              {/* Display detailed business partner results as strings */}
              {(businessPartnerData as any).businessPartnerResults && (businessPartnerData as any).businessPartnerResults.length > 0 ? (
                <div className="space-y-4">
                  <h4 className="font-medium text-lg">Business Partner Information (Raw Strings):</h4>
                  {(businessPartnerData as any).businessPartnerResults.map((partnerResult: any, index: number) => (
                    <div key={partnerResult.bpCustomerNumber || index} className="border border-gray-200 p-4 rounded-md bg-white">
                      <h5 className="font-semibold text-md mb-3 text-blue-600">
                        Business Partner: {String(partnerResult.bpCustomerNumber)}
                      </h5>
                      
                      <div className="space-y-4">
                        <div>
                          <strong>Success:</strong> {String(partnerResult.success)}
                        </div>
                        
                        {partnerResult.data?.d?.results && partnerResult.data.d.results.length > 0 ? (
                          <div className="space-y-4">
                            {partnerResult.data.d.results.map((bpData: any, bpIndex: number) => (
                              <div key={bpIndex} className="space-y-3 border-l-4 border-blue-200 pl-4">
                                {/* Business Partner Name */}
                                <div>
                                  <strong>BusinessPartnerFullName:</strong> {String(bpData.BusinessPartnerFullName || '')}
                                </div>
                                
                                {/* Address Information as Raw Strings */}
                                {bpData.to_BusinessPartnerAddress?.results && bpData.to_BusinessPartnerAddress.results.length > 0 ? (
                                  <div>
                                    <h6 className="font-medium mb-2 text-gray-700">Address Information (Raw Strings):</h6>
                                    <div className="space-y-2">
                                      {bpData.to_BusinessPartnerAddress.results.map((address: any, addressIndex: number) => (
                                        <div key={addressIndex} className="bg-gray-50 p-3 rounded-md border">
                                          {renderAddressAsStrings(address)}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ) : (
                                  <div className="text-gray-500 italic">No address information available</div>
                                )}
                                
                                {/* Show raw data structure */}
                                <div>
                                  <h6 className="font-medium mb-2 text-gray-700">Raw BP Data:</h6>
                                  {renderRawData(bpData)}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-gray-500 italic">No detailed data available</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  No business partner results found
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