import { ScheduleOptions } from "../cron.interface";
import { Report } from "@expressots/core";
import { createCron } from "../utils";
import { setCronMetadata } from "../utils/cron.metadata";
import cronDB from "../db/cron.db";
import { EXPRESSOTS_CRON } from "../constants";
/* eslint-disable @typescript-eslint/no-explicit-any */

export function Cron(cronExpression: string, options?: ScheduleOptions): MethodDecorator {
  const report = new Report();
  return function (
    target: object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ): any {
    setCronMetadata(target, propertyKey);

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
      report.error("Unexpected error on cron decorator", 500, EXPRESSOTS_CRON);
    }
  };
}
