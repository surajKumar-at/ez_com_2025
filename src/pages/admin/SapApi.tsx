import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import { Loader2, Search } from 'lucide-react';

const SapApi: React.FC = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    soldTo: '',
    salesOrg: '',
    division: '',
    distributionChannel: '',
  });
  const [businessPartnerData, setBusinessPartnerData] = useState<any>(null);
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
        title: 'Error',
        description: 'Sold To is required',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    setBusinessPartnerData(null);

    try {
      const response = await axios.post('/api/sap-api', formData);
      const result = response.data;
      
      if (result.success && result.data) {
        setBusinessPartnerData(result.data);
        toast({
          title: 'Success',
          description: 'Business partner data retrieved successfully',
        });
      } else {
        setError(result.error || 'Failed to retrieve business partner data');
        toast({
          title: 'Error',
          description: result.error || 'Failed to retrieve business partner data',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      console.error('Error fetching business partner:', error);
      const errorMessage = error.response?.data?.error || 'An error occurred while fetching business partner data';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderTable = (data: any) => {
    if (!data?.d?.results || data.d.results.length === 0) {
      return (
        <div className="text-center py-4 text-muted-foreground">
          No data found
        </div>
      );
    }

    const results = data.d.results;
    
    return (
      <div className="space-y-6">
        {results.map((partner: any, index: number) => (
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
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Field</TableHead>
                        <TableHead>Value</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {partner.to_BusinessPartnerAddress.results.map((address: any, addrIndex: number) => (
                        Object.entries(address).map(([key, value]) => {
                          if (value !== null && value !== undefined && value !== '' && value !== false) {
                            return (
                              <TableRow key={`${addrIndex}-${key}`}>
                                <TableCell className="font-medium">
                                  {key.replace(/([A-Z])/g, ' $1').trim()}
                                </TableCell>
                                <TableCell>{String(value)}</TableCell>
                              </TableRow>
                            );
                          }
                          return null;
                        })
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">SAP Business Partner API</h1>
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
            {renderTable(businessPartnerData)}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SapApi;