import { EventEmitter } from "events";

export interface ScheduledTask extends EventEmitter {
  now: (now?: Date) => void;
  start: () => void;
  stop: () => void;
}

export interface ScheduleOptions {
  /**
   * A boolean to set if the created task is scheduled.
   *
   * Defaults to `true`
   */
  scheduled?: boolean | undefined;
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

export interface CronOptions {
  /**
   * Creates a new task to execute the given function when the cron expression ticks.
   * @param cronExpression
   * @param func
   * @param options
   */
  schedule(
    cronExpression: string,
    func: ((now: Date | "manual" | "init") => void) | string,
    options?: ScheduleOptions,
  ): ScheduledTask;

  /**
   * To validate whether the expression is a cron expression or not
   * @param cronExpression
   */
  validate(cronExpression: string): boolean;

  /**
   * Get the list of tasks created using the `schedule` function
   */
  getTasks(): Map<string, ScheduledTask>;
}
