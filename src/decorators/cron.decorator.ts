import { ScheduleOptions } from "../cron.interface";
import { Report } from "@expressots/core";
import { createCron } from "../utils";
import { getCronMetadata, setCronMetadata } from "../utils/cron.metadata";
import cronDB from "../db/cron.db";
/* eslint-disable @typescript-eslint/no-explicit-any */

export function Cron(cronExpression: string, options?: ScheduleOptions): MethodDecorator {
  const report = new Report();
  return function (
    target: object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ): any {
    const metadata = getCronMetadata(target);
    metadata.push({ propertyKey, cronExpression, options });
    setCronMetadata(target, metadata);

    const originalMethod = descriptor.value as (...args: Array<any>) => void;

    try {
      descriptor.value = function (...args: Array<any>): unknown {
        const result = createCron(
          cronExpression,
          () => originalMethod.apply(this, args),
          null,
          options,
        );

        cronDB.addJob(options?.name, result);

        return result;
      };

      return descriptor;
    } catch (error) {
      console.log(error);
      report.error("Unexpected error on cron decorator", 500, "cron-decorator");
    }

    // Wrap the original method to bind the 'this' context
  };
}
