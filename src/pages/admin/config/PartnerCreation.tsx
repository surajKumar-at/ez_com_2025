import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowLeft, ArrowRight } from 'lucide-react';
import { partnerCreationService } from '@/services/partnerCreationService';
import { PartnerCreationCreate, CatalogOption } from '@/lib/dto/partnerCreation.dto';

export default function PartnerCreation() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [catalogOptions, setCatalogOptions] = useState<CatalogOption[]>([]);
  const [formData, setFormData] = useState<PartnerCreationCreate>({
    ebpc_company_name: '',
    ebpc_description: '',
    ebpc_catalog_no: '',
    ebpc_unlimited_users: false,
    ebpc_number_of_users: undefined,
    ebpc_intranet_business_partner: false,
    ebpc_is_serves_partner: undefined,
  });
  const [servesPartnerChoice, setServesPartnerChoice] = useState<'yes' | 'no' | ''>('');

  useEffect(() => {
    fetchCatalogOptions();
  }, []);

  const fetchCatalogOptions = async () => {
    try {
      const response = await partnerCreationService.getCatalogOptions();
      if (response.success && response.data) {
        setCatalogOptions(response.data);
      }
    } catch (error) {
      console.error('Error fetching catalog options:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch catalog options',
        variant: 'destructive',
      });
    }
  };

  const handleInputChange = (field: keyof PartnerCreationCreate, value: any) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Handle mutual exclusivity for user options
      if (field === 'ebpc_unlimited_users' && value) {
        newData.ebpc_number_of_users = undefined;
      } else if (field === 'ebpc_number_of_users' && value) {
        newData.ebpc_unlimited_users = false;
      }
      
      return newData;
    });
  };

  const handleServesPartnerChange = (value: boolean) => {
    setFormData(prev => ({
      ...prev,
      ebpc_is_serves_partner: value
    }));
  };

  const validateForm = () => {
    if (!formData.ebpc_company_name.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Company name is required',
        variant: 'destructive',
      });
      return false;
    }

    if (!formData.ebpc_catalog_no) {
      toast({
        title: 'Validation Error',
        description: 'Catalog selection is required',
        variant: 'destructive',
      });
      return false;
    }

    if (!formData.ebpc_unlimited_users && !formData.ebpc_number_of_users) {
      toast({
        title: 'Validation Error',
        description: 'Either unlimited users or specific number of users must be selected',
        variant: 'destructive',
      });
      return false;
    }

    if (formData.ebpc_is_serves_partner === undefined) {
      toast({
        title: 'Validation Error',
        description: 'Please select if this is a serves partner',
        variant: 'destructive',
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      const response = await partnerCreationService.create(formData);
      
      if (response.success) {
        toast({
          title: 'Success',
          description: response.message || 'Partner creation submitted successfully',
        });
        
        // Reset form
        setFormData({
          ebpc_company_name: '',
          ebpc_description: '',
          ebpc_catalog_no: '',
          ebpc_unlimited_users: false,
          ebpc_number_of_users: undefined,
          ebpc_intranet_business_partner: false,
          ebpc_is_serves_partner: undefined,
        });
      }
    } catch (error) {
      console.error('Error creating partner:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit partner creation',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Partner Creation</CardTitle>
          <CardDescription>
            Create a new business partner with the required configuration
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Company Name */}
          <div className="space-y-2">
            <Label htmlFor="company-name">Company Name *</Label>
            <Input
              id="company-name"
              value={formData.ebpc_company_name}
              onChange={(e) => handleInputChange('ebpc_company_name', e.target.value)}
              placeholder="Enter company name"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.ebpc_description}
              onChange={(e) => handleInputChange('ebpc_description', e.target.value)}
              placeholder="Enter company description"
              rows={3}
            />
          </div>

          {/* Catalog Dropdown */}
          <div className="space-y-2">
            <Label htmlFor="catalog">Catalog *</Label>
            <Select
              value={formData.ebpc_catalog_no}
              onValueChange={(value) => handleInputChange('ebpc_catalog_no', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select catalog" />
              </SelectTrigger>
              <SelectContent>
                {catalogOptions.map((option) => (
                  <SelectItem key={option.ecg_catalog_no} value={option.ecg_catalog_no}>
                    {option.ecg_catalog_no} - {option.ecg_product_group}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* User Configuration */}
          <div className="space-y-4">
            <Label className="text-base font-medium">User Configuration *</Label>
            
            {/* Unlimited Users */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="unlimited-users"
                checked={formData.ebpc_unlimited_users}
                onCheckedChange={(checked) => handleInputChange('ebpc_unlimited_users', checked)}
              />
              <Label htmlFor="unlimited-users">Unlimited Users</Label>
            </div>

            {/* Number of Users */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="number-of-users-check"
                checked={!!formData.ebpc_number_of_users && !formData.ebpc_unlimited_users}
                onCheckedChange={(checked) => {
                  if (checked) {
                    handleInputChange('ebpc_number_of_users', 1);
                  } else {
                    handleInputChange('ebpc_number_of_users', undefined);
                  }
                }}
              />
              <Label htmlFor="number-of-users-check">Number of Users</Label>
              {!!formData.ebpc_number_of_users && !formData.ebpc_unlimited_users && (
                <Input
                  type="number"
                  min="1"
                  value={formData.ebpc_number_of_users || ''}
                  onChange={(e) => handleInputChange('ebpc_number_of_users', parseInt(e.target.value) || 1)}
                  className="w-24"
                />
              )}
            </div>
          </div>

          {/* Intranet Business Partner */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="intranet-partner"
              checked={formData.ebpc_intranet_business_partner}
              onCheckedChange={(checked) => handleInputChange('ebpc_intranet_business_partner', checked)}
            />
            <Label htmlFor="intranet-partner">Intranet Business Partner</Label>
          </div>

          {/* Is Serves Partner */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Is Serves Partner *</Label>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="serves-partner-yes"
                  checked={formData.ebpc_is_serves_partner === true}
                  onCheckedChange={(checked) => checked && handleServesPartnerChange(true)}
                />
                <Label htmlFor="serves-partner-yes">Yes</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="serves-partner-no"
                  checked={formData.ebpc_is_serves_partner === false}
                  onCheckedChange={(checked) => checked && handleServesPartnerChange(false)}
                />
                <Label htmlFor="serves-partner-no">No</Label>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between pt-6">
            <Button variant="outline" onClick={handleBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            
            <Button onClick={handleSubmit} disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}