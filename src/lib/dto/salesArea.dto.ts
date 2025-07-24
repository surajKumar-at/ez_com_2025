export interface SalesArea {
  eskd_sys_no: number;
  eskd_sys_key: string;
  eskd_sys_key_desc: string;
  eskd_sync_flag: string;
}

export interface CreateSalesAreaDto {
  systemNo: number;
  code: string;
  language: string;
  description: string;
  synchronizable: string;
}

export interface SalesAreaResponse {
  success: boolean;
  error: string | null;
  data: SalesArea[] | SalesArea | null;
}