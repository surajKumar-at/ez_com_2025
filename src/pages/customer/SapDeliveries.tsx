import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, Search, Truck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import axiosInstance from '@/config/api';

interface DeliveryHeader {
  DeliveryDocument: string;
  DeliveryDate: string;
  SoldToParty: string;
  ShipToParty: string;
  DeliveryDocumentType: string;
  OverallDelivReltdBillgStatus: string;
  OverallGoodsMovementStatus: string;
  OverallPickingStatus: string;
  HeaderGrossWeight: string;
  HeaderNetWeight: string;
  HeaderWeightUnit: string;
  ActualDeliveryRoute: string;
  ShippingPoint: string;
  CreationDate: string;
  CreatedByUser: string;
}

interface DeliveryResponse {
  d: {
    results: DeliveryHeader[];
  };
}

const SapDeliveries = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [soldToId, setSoldToId] = useState('');
  const [deliveries, setDeliveries] = useState<DeliveryHeader[]>([]);
  const [loading, setLoading] = useState(false);

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(parseInt(dateString.replace('/Date(', '').replace(')/', '')));
    return date.toLocaleDateString();
  };

  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' } } = {
      'C': { label: 'Complete', variant: 'default' },
      'A': { label: 'Active', variant: 'secondary' },
      '': { label: 'Pending', variant: 'outline' }
    };
    
    const statusInfo = statusMap[status] || { label: status || 'Unknown', variant: 'outline' };
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  const handleSearch = async () => {
    if (!soldToId.trim()) {
      toast({
        title: t('validation.required'),
        description: 'Please enter a Sold To Party ID',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post('/get-sap-delivery-list', {
        sapSoldToId: soldToId.trim()
      });

      if (response.data.error) {
        toast({
          title: t('error.title'),
          description: response.data.error,
          variant: 'destructive',
        });
        setDeliveries([]);
        return;
      }

      const deliveryData = response.data as DeliveryResponse;
      setDeliveries(deliveryData.d?.results || []);

      if (!deliveryData.d?.results || deliveryData.d.results.length === 0) {
        toast({
          title: t('info.title'),
          description: 'No deliveries found for this Sold To Party ID',
        });
      }
    } catch (error) {
      console.error('Error fetching deliveries:', error);
      toast({
        title: t('error.title'),
        description: 'Failed to fetch delivery data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Truck className="h-6 w-6" />
        <h1 className="text-3xl font-bold">{t('sap.deliveries.title', 'SAP Deliveries')}</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('sap.deliveries.search.title', 'Search Deliveries')}</CardTitle>
          <CardDescription>
            {t('sap.deliveries.search.description', 'Enter a Sold To Party ID to fetch delivery information')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="soldToId">{t('sap.deliveries.soldToId', 'Sold To Party ID')}</Label>
              <Input
                id="soldToId"
                value={soldToId}
                onChange={(e) => setSoldToId(e.target.value)}
                placeholder="Enter Sold To Party ID"
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleSearch} disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                {t('common.search', 'Search')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {deliveries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t('sap.deliveries.results.title', 'Delivery Results')}</CardTitle>
            <CardDescription>
              {t('sap.deliveries.results.count', `Found ${deliveries.length} deliveries`)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('sap.deliveries.table.document', 'Delivery Document')}</TableHead>
                  <TableHead>{t('sap.deliveries.table.date', 'Delivery Date')}</TableHead>
                  <TableHead>{t('sap.deliveries.table.soldTo', 'Sold To')}</TableHead>
                  <TableHead>{t('sap.deliveries.table.shipTo', 'Ship To')}</TableHead>
                  <TableHead>{t('sap.deliveries.table.type', 'Type')}</TableHead>
                  <TableHead>{t('sap.deliveries.table.billingStatus', 'Billing Status')}</TableHead>
                  <TableHead>{t('sap.deliveries.table.goodsMovement', 'Goods Movement')}</TableHead>
                  <TableHead>{t('sap.deliveries.table.picking', 'Picking Status')}</TableHead>
                  <TableHead>{t('sap.deliveries.table.weight', 'Weight')}</TableHead>
                  <TableHead>{t('sap.deliveries.table.route', 'Route')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deliveries.map((delivery) => (
                  <TableRow key={delivery.DeliveryDocument}>
                    <TableCell className="font-medium">{delivery.DeliveryDocument}</TableCell>
                    <TableCell>{formatDate(delivery.DeliveryDate)}</TableCell>
                    <TableCell>{delivery.SoldToParty}</TableCell>
                    <TableCell>{delivery.ShipToParty}</TableCell>
                    <TableCell>{delivery.DeliveryDocumentType}</TableCell>
                    <TableCell>{getStatusBadge(delivery.OverallDelivReltdBillgStatus)}</TableCell>
                    <TableCell>{getStatusBadge(delivery.OverallGoodsMovementStatus)}</TableCell>
                    <TableCell>{getStatusBadge(delivery.OverallPickingStatus)}</TableCell>
                    <TableCell>
                      {delivery.HeaderGrossWeight} {delivery.HeaderWeightUnit}
                    </TableCell>
                    <TableCell>{delivery.ActualDeliveryRoute}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SapDeliveries;