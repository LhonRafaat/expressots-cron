import { CronJob } from "cron";
import { ScheduleOptions } from "../cron.interface";

export function createCron(
  cronExpression: string,
  func: () => void,
  options?: ScheduleOptions,
): CronJob {
  const job = new CronJob(
    cronExpression,
    func,
    options?.onCompleted,
    options?.startImmediately || false,
    options?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
  );

  return job;
}
