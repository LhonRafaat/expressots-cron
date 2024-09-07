import { IProvider, Report } from "@expressots/core";
import { ICron, ScheduleOptions } from "./cron.interface";
import { injectable } from "inversify";
import { createCron } from "./utils";
import { CronJob } from "cron";
import cronDB from "./db/cron.db";
import { EXPRESSOTS_CRON } from "./constants";
/* eslint-disable @typescript-eslint/no-explicit-any */

@injectable()
export class CronProvider implements IProvider, ICron {
  readonly author: string = "Lhon Rafaat Mohammed";
  readonly name: string = "Cron Provider";
  readonly version: string = "1.0.0";
  readonly repo: string = "https://github.com/LhonRafaat/expressots-cron.git";
  private readonly report: Report;
  constructor() {
    this.report = new Report();
  }

  /**
   * Creates a new task to execute the given function when the cron expression ticks.
   * @param cronExpression the cron expression to schedule against
   * @param func the function to execute. Can be a string path to a function, or a function itself
   * @param [options] the options to pass to the cron scheduler
   * @returns the scheduled task
   */
  public schedule(cronExpression: string, func: () => void, options?: ScheduleOptions): CronJob {
    const job = createCron(cronExpression, func, options);

    cronDB.addJob(options?.name, job);

    return job;
  }

  /**
   * Get the list of tasks created using the `schedule` function
   * @returns {Map<string, ScheduledTask>} a map of task names to tasks
   */
  public getTasks(): Map<string, CronJob> {
    return cronDB.getJobs();
  }

  /**
   * Get a specific task created using the `schedule` function
   * @param name the name of the task to retrieve
   * @returns the scheduled task
   * @throws {Error} if the task is not found
   */
  public getTask(name: string): CronJob {
    const job = cronDB.getJob(name);

    if (!job) this.report.error(`Task ${name} not found`, 404, EXPRESSOTS_CRON);

    return job;
  }
}
