import { CronJob } from "cron";
import { ScheduleOptions } from "../cron.interface";

/* eslint-disable @typescript-eslint/no-explicit-any */

export function createCron(
  cronExpression: string,
  func: () => void,
  onCompleted?: () => void,
  options?: ScheduleOptions,
): CronJob {
  //   const isValid = this.validate(cronExpression);
  //   if (!isValid) {
  //     this.report.error(`Invalid cron expression: ${cronExpression}`);
  //   }

  const job = new CronJob(cronExpression, func, onCompleted, true, options.timezone);

  return job;
}
