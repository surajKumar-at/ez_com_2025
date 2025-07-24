export interface SystemAuthDto {
  esd_sys_no: number;
  esd_sys_desc: string;
  esd_sys_type: string;
  esd_lang: string;
}

export interface AuthDescriptionDto {
  euad_auth_key: string;
  euad_auth_desc: string;
  euad_lang: string;
  euad_is_sys_auth: string;
  euad_deletion_flag: string;
}

export interface SystemAuthAssignmentDto {
  esa_sys_no: number;
  esa_auth_key: string;
  euad_auth_desc?: string;
}

export interface SystemAuthRequest {
  systemId: number;
  authKeys: string[];
}

export interface SystemAuthResponse {
  success: boolean;
  error: string | null;
  data: SystemAuthDto[] | SystemAuthAssignmentDto[] | AuthDescriptionDto[] | null;
}