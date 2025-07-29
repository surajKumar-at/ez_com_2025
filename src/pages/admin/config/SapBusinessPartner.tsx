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
      const result = await sapBusinessPartnerService.getBusinessPartner(formData);
      
      console.log('🔍 SAP API Response:', result);
      
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
        setError('No business partner data found');
        toast({
          title: t('error'),
          description: 'No business partner data found',
          variant: 'destructive',
        });
      }
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

  const renderAddressFields = (address: any) => {
    if (!address) return null;

    console.log('📍 Address data being rendered:', address);

    const addressFields = [
      { label: 'Business Partner', value: address.BusinessPartner },
      { label: 'Address ID', value: address.AddressID },
      { label: 'Full Name', value: address.FullName },
      { label: 'Street', value: `${address.HouseNumber || ''} ${address.StreetName || ''}`.trim() },
      { label: 'City', value: address.CityName },
      { label: 'Postal Code', value: address.PostalCode },
      { label: 'Region', value: address.Region },
      { label: 'Country', value: address.Country },
      { label: 'Time Zone', value: address.AddressTimeZone },
      { label: 'Language', value: address.Language },
      { label: 'Tax Jurisdiction', value: address.TaxJurisdiction },
      { label: 'Transport Zone', value: address.TransportZone },
      { label: 'County', value: address.County },
      { label: 'District', value: address.District },
      { label: 'PO Box', value: address.POBox },
      { label: 'Form of Address', value: address.FormOfAddress },
      { label: 'Valid From', value: convertSapDate(address.ValidityStartDate) },
      { label: 'Valid Until', value: convertSapDate(address.ValidityEndDate) },
    ];

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-sm">
        {addressFields.map((field, index) => {
          if (!field.value || field.value === 'N/A') return null;
          return (
            <div key={index} className="p-2 bg-gray-50 rounded">
              <strong>{field.label}:</strong> {field.value}
            </div>
          );
        })}
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
              {/* Display detailed business partner results */}
              {businessPartnerData.businessPartnerResults && businessPartnerData.businessPartnerResults.length > 0 ? (
                <div className="space-y-4">
                  <h4 className="font-medium text-lg">Business Partner Information:</h4>
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
                      ) : partnerResult.data?.d?.results && partnerResult.data.d.results.length > 0 ? (
                        <div className="space-y-4">
                          {partnerResult.data.d.results.map((bpData: any, bpIndex: number) => (
                            <div key={bpIndex} className="space-y-3">
                              {/* Business Partner Name */}
                              {bpData.BusinessPartnerFullName && (
                                <div className="bg-blue-50 p-3 rounded-md">
                                  <h6 className="font-medium text-blue-800">Business Partner Name:</h6>
                                  <p className="text-blue-700">{bpData.BusinessPartnerFullName}</p>
                                </div>
                              )}
                              
                              {/* Address Information */}
                              {bpData.to_BusinessPartnerAddress?.results && bpData.to_BusinessPartnerAddress.results.length > 0 ? (
                                <div>
                                  <h6 className="font-medium mb-2 text-gray-700">Address Information:</h6>
                                  <div className="space-y-2">
                                    {bpData.to_BusinessPartnerAddress.results.map((address: any, addressIndex: number) => (
                                      <div key={addressIndex} className="bg-gray-50 p-3 rounded-md border">
                                        {renderAddressFields(address)}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ) : (
                                <div className="text-gray-500 italic">No address information available</div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-gray-500 italic">No detailed data available</div>
                      )}
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