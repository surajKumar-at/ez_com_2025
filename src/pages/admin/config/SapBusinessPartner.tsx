import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { sapBusinessPartnerService } from '@/services/sapBusinessPartnerService';
import { SapBusinessPartnerResponse, SapBusinessPartnerAddress } from '@/lib/dto/sapBusinessPartner.dto';
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
  const [businessPartnerData, setBusinessPartnerData] = useState<SapBusinessPartnerResponse | null>(null);
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
      
      if (result.success && result.data) {
        setBusinessPartnerData(result.data);
        toast({
          title: t('success'),
          description: 'Business partner data retrieved successfully',
        });
      } else {
        setError(result.error || 'Failed to retrieve business partner data');
        toast({
          title: t('error'),
          description: result.error || 'Failed to retrieve business partner data',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error fetching business partner:', error);
      const errorMessage = 'An error occurred while fetching business partner data';
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
            {businessPartnerData.d?.results && businessPartnerData.d.results.length > 0 ? (
              <div className="space-y-6">
                {businessPartnerData.d.results.map((partner, index) => (
                  <div key={index} className="space-y-4">
                    {partner.BusinessPartnerFullName && (
                      <div>
                        <h3 className="text-lg font-semibold mb-2">
                          Business Partner: {partner.BusinessPartnerFullName}
                        </h3>
                      </div>
                    )}
                    
                    {partner.to_BusinessPartnerAddress?.results && (
                      <div>
                        <h4 className="text-md font-medium mb-3">Address Information</h4>
                        {renderAddressTable(partner.to_BusinessPartnerAddress.results)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No data found for the specified business partner
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SapBusinessPartner;