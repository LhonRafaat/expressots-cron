import { CronJob } from "cron";

export interface ScheduleOptions {
  /**
   * The timezone that is used for job scheduling
   */
  timezone?: string;
  /**
   * Specifies whether to recover missed executions instead of skipping them.
   *
   * Defaults to `false`
   */
  recoverMissedExecutions?: boolean;
  /**
   * The schedule name
   */
  name?: string;
}

export interface ICron {
  /**
   * Creates a new task to execute the given function when the cron expression ticks.
   * @param cronExpression
   * @param func
   * @param options
   */
  schedule(
    cronExpression: string,
    func: () => void,
    onCompleted?: () => void,
    options?: ScheduleOptions,
  ): CronJob;

  /**
   * Get the list of tasks created using the `schedule` function
   */
  getTasks(): Map<string, CronJob>;

  /**
   * Get a specific task created using the `schedule` function
   * @param name
   */
  getTask(name: string): CronJob;
}
