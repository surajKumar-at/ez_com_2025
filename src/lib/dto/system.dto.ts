export interface System {
  esd_sys_no: number;
  esd_sys_type: string;
  esd_lang: string;
  esd_sys_desc: string;
  est_sys_type?: string;
  est_lang?: string;
  est_description?: string;
}

export interface SystemType {
  est_sys_type: string;
  est_lang: string;
  est_description: string;
}

export interface CreateSystemDto {
  systemType: string;
  language: string;
  systemId: string;
  description: string;
}

export interface SystemResponse {
  success: boolean;
  error: string | null;
  data: System[] | System | null;
}

export interface SystemTypeResponse {
  success: boolean;
  error: string | null;
  data: SystemType[] | null;
}