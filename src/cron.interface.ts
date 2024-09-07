import { CronJob } from "cron";

export interface ScheduleOptions {
  /**
   * The timezone that is used for job scheduling
   */
  timezone?: string;

  /**
   * Specifies whether to start the job immediately
   *
   * Defaults to `true`
   */

  startImmediately?: boolean;

  /**
   * The function to execute when the job completes
   * @returns void
   */

  onCompleted?: () => void;

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
  schedule(cronExpression: string, func: () => void, options?: ScheduleOptions): CronJob;

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
