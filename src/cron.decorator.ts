import * as cron from "node-cron";
import { ScheduleOptions } from "./cron.interface";
import { Report } from "@expressots/core";
export function Cron(cronExpression: string, options?: ScheduleOptions): MethodDecorator {
  const report = new Report();
  return function (
    target: object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ): void {
    const originalMethod = descriptor.value as () => unknown;

    const isValid = cron.validate(cronExpression);
    if (!isValid) report.error(`Invalid cron expression: ${cronExpression}`);
    cron.schedule(cronExpression, () => originalMethod(), options);
  };
}
