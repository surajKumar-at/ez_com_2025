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
      console.log('[SAP] Fetch response:', result);
      
      // Handle whatever response comes back with try-catch
      let processedData: SapBusinessPartnerApiResponse | null = null;
      
      try {
        if (result && typeof result === 'object') {
          if ('success' in result && result.success) {
            // Standard success response
            processedData = result as SapBusinessPartnerApiResponse;
          } else if ('businessPartnersData' in result || 'businessPartnerResults' in result) {
            // Partial response - use what we have
            processedData = {
              success: true,
              businessPartnersData: result.businessPartnersData || { d: { results: [] } },
              businessPartnerResults: result.businessPartnerResults || [],
              uniqueBPCustomerNumbers: result.uniqueBPCustomerNumbers || [],
              requestData: result.requestData || formData
            };
          } else if ('d' in result && result.d) {
            // Direct SAP response format
            processedData = {
              success: true,
              businessPartnersData: result,
              businessPartnerResults: [{ 
                bpCustomerNumber: formData.soldTo, 
                success: true, 
                error: null, 
                data: result 
              }],
              uniqueBPCustomerNumbers: [formData.soldTo],
              requestData: formData
            };
          }
        }
      } catch (parseError) {
        console.warn('[SAP] Error parsing response:', parseError);
        // Try to create a minimal response with available data
        processedData = {
          success: true,
          businessPartnersData: (result && typeof result === 'object' && 'd' in result) ? result : { d: { results: [] } },
          businessPartnerResults: [],
          uniqueBPCustomerNumbers: [],
          requestData: formData
        };
      }
      
      if (processedData) {
        setBusinessPartnerData(processedData);
        const count = processedData.businessPartnerResults?.length || 0;
        toast({
          title: t('success'),
          description: count > 0 ? `Found ${count} business partner(s)` : 'Data retrieved (may be partial)',
        });
      } else {
        // Last resort - show error but try to display raw data
        const errorMessage = ('error' in result && result.error) || 'Unexpected response format';
        setError(errorMessage);
        
        // Still try to set some data if available
        if (result && typeof result === 'object') {
          setBusinessPartnerData({
            success: false,
            businessPartnersData: (result && typeof result === 'object' && 'd' in result) ? result : { d: { results: [] } },
            businessPartnerResults: [],
            uniqueBPCustomerNumbers: [],
            requestData: formData
          });
        }
        
        toast({
          title: t('error'),
          description: errorMessage,
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

  const renderAddressTable = (addresses: SapBusinessPartnerAddress[]) => {
    if (!addresses || addresses.length === 0) {
      return (
        <div className="text-center py-4 text-muted-foreground">
          No address data available
        </div>
      );
    }

    // Get all non-empty fields across all addresses to determine columns
    const allFields = new Set<string>();
    addresses.forEach(address => {
      Object.entries(address).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '' && value !== false) {
          allFields.add(key);
        }
      });
    });

    const fieldArray = Array.from(allFields);

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
            {addresses.map((address, index) => (
              <TableRow key={index}>
                {fieldArray.map(field => (
                  <TableCell key={field} className="whitespace-nowrap">
                    {address[field as keyof SapBusinessPartnerAddress]?.toString() || '-'}
                  </TableCell>
                ))}
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
            {businessPartnerData.businessPartnerResults && businessPartnerData.businessPartnerResults.length > 0 ? (
              <div className="space-y-6">
                {businessPartnerData.businessPartnerResults.map((partnerResult, index) => (
                  <div key={partnerResult.bpCustomerNumber} className="space-y-4">
                    <div className="border-b pb-4">
                      <h3 className="text-lg font-semibold mb-2">
                        Business Partner: {partnerResult.bpCustomerNumber}
                      </h3>
                      
                      {!partnerResult.success ? (
                        <div className="text-destructive bg-destructive/10 p-3 rounded-md">
                          <strong>Error:</strong> {partnerResult.error}
                        </div>
                      ) : partnerResult.data?.d?.results ? (
                        <div className="space-y-4">
                          {partnerResult.data.d.results.map((partner, partnerIndex) => (
                            <div key={partnerIndex} className="space-y-3">
                              {partner.BusinessPartnerFullName && (
                                <div>
                                  <h4 className="text-md font-medium">
                                    {partner.BusinessPartnerFullName}
                                  </h4>
                                </div>
                              )}
                              
                              {partner.to_BusinessPartnerAddress?.results && partner.to_BusinessPartnerAddress.results.length > 0 ? (
                                <div>
                                  <h5 className="text-sm font-medium mb-2">Address Information</h5>
                                  {renderAddressTable(partner.to_BusinessPartnerAddress.results)}
                                </div>
                              ) : (
                                <div className="text-muted-foreground text-sm">
                                  No address information available
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-muted-foreground">
                          No business partner data available
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No business partner results found
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SapBusinessPartner;