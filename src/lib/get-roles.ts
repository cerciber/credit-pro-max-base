import { STATICS_CONFIG } from '@/app/config/statics';

export const getRoles = (): [string, ...string[]] => {
  return Object.values(STATICS_CONFIG.roles) as [string, ...string[]];
};
