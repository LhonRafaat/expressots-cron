import { CRON_METADATA_KEY } from "../constants";
/* eslint-disable @typescript-eslint/no-explicit-any */

export function getCronMetadata(target: object): Array<any> {
  return Reflect.getMetadata(CRON_METADATA_KEY, target) || [];
}

export function setCronMetadata(target: object, metadata: Array<any>): void {
  Reflect.defineMetadata(CRON_METADATA_KEY, metadata, target);
}
