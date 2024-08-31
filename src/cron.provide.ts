import * as cron from "node-cron";
import { IProvider, Report } from "@expressots/core";
import { ICron, ScheduledTask, ScheduleOptions } from "./cron.interface";
import { injectable } from "inversify";
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
  public schedule(
    cronExpression: string,
    func: ((now: Date | "manual" | "init") => void) | string,
    options?: ScheduleOptions,
  ): ScheduledTask {
    const isValid = this.validate(cronExpression);
    if (!isValid) {
      this.report.error(`Invalid cron expression: ${cronExpression}`);
    }
    return cron.schedule(cronExpression, func, options);
  }

  /**
   * To validate whether the expression is a cron expression or not
   * @param cronExpression
   */
  public validate(cronExpression: string): boolean {
    return cron.validate(cronExpression);
  }

  /**
   * Get the list of tasks created using the `schedule` function
   * @returns {Map<string, ScheduledTask>} a map of task names to tasks
   */
  public getTasks(): Map<string, ScheduledTask> {
    return cron.getTasks();
  }

  public getTask(name: string): ScheduledTask {
    const tasks = cron.getTasks();

    const task = tasks.get(name);

    if (!task) this.report.error(`Task not found: ${name}`);

    return task;
  }
}
