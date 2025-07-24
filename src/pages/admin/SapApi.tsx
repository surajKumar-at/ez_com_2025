import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import { Loader2, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

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
  const [customerExists, setCustomerExists] = useState<boolean>(false);

  // Convert SAP date format /Date(timestamp+timezone)/ to readable date
  const convertSapDate = (sapDate: string): string => {
    if (!sapDate || !sapDate.includes('/Date(')) {
      return sapDate;
    }
    
    try {
      const timestamp = sapDate.match(/\/Date\((\d+)/)?.[1];
      if (timestamp) {
        const date = new Date(parseInt(timestamp));
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      }
    } catch (error) {
      console.error('Error converting date:', error);
    }
    
    return sapDate;
  };

  // Fields to display in the table
  const displayFields = [
    'BusinessPartnerFullName',
    'BusinessPartner', 
    'AddressID',
    'ValidityStartDate',
    'ValidityEndDate',
    'AddressTimeZone',
    'CityName',
    'Country',
    'FormOfAddress',
    'FullName',
    'HouseNumber',
    'Language',
    'PostalCode',
    'Region',
    'StreetName',
    'TaxJurisdiction',
    'TransportZone'
  ];

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
    setCustomerExists(false);

    try {
      // First check if customer already exists in ezc_customer table
      const { data: existingCustomer, error: dbError } = await supabase
        .from('ezc_customer')
        .select('ec_no')
        .eq('ec_erp_cust_no', formData.soldTo)
        .eq('ec_partner_function', 'AG')
        .maybeSingle();

      if (dbError) {
        throw new Error('Failed to check existing customer');
      }

      if (existingCustomer) {
        setCustomerExists(true);
        toast({
          title: 'Customer Already Added',
          description: 'This customer is already present in the system.',
        });
        setIsLoading(false);
        return;
      }

      // If customer doesn't exist, fetch from SAP
      const response = await axios.post('/api/sap-business-partner', formData);
      const result = response.data;
      
      if (result.success && result.data) {
        setBusinessPartnerData(result.data);
        toast({
          title: 'Success',
          description: 'Customer data retrieved successfully',
        });
      } else {
        setError(result.error || 'Failed to retrieve customer data');
        toast({
          title: 'Error',
          description: result.error || 'Failed to retrieve customer data',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      console.error('Error fetching customer:', error);
      const errorMessage = error.response?.data?.error || 'An error occurred while fetching customer data';
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
                  Customer: {partner.BusinessPartnerFullName}
                </h3>
              </div>
            )}
            
            {partner.to_BusinessPartnerAddress?.results && (
              <div>
                <h4 className="text-md font-medium mb-3">Customer Information</h4>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Field</TableHead>
                        <TableHead>Value</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {partner.to_BusinessPartnerAddress.results.map((address: any) => (
                        displayFields.map((field) => {
                          const value = address[field];
                          if (value !== null && value !== undefined && value !== '' && value !== false) {
                            const displayValue = (field === 'ValidityStartDate' || field === 'ValidityEndDate') 
                              ? convertSapDate(String(value))
                              : String(value);
                            
                            return (
                              <TableRow key={field}>
                                <TableCell className="font-medium">
                                  {field.replace(/([A-Z])/g, ' $1').trim()}
                                </TableCell>
                                <TableCell>{displayValue}</TableCell>
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
        <h1 className="text-3xl font-bold">Add Customer</h1>
      </div>

      {/* Search Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Customer
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
              Search Customer
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Customer Already Added Display */}
      {customerExists && (
        <Card className="border-blue-300">
          <CardContent className="pt-6">
            <div className="text-blue-600">
              <strong>Customer Already Added:</strong> This customer is already present in the system.
            </div>
          </CardContent>
        </Card>
      )}

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
            <CardTitle>Customer Results</CardTitle>
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