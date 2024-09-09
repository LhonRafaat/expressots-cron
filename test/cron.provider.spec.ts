import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import { CronProvider } from "../src/cron.provider";
import { CronJob } from "cron";

describe("Cron Provider", () => {
  let cronProvider: CronProvider;
  let cronJob: CronJob;

  beforeAll(() => {
    cronProvider = new CronProvider();
  });

  afterAll(() => {
    if (cronJob) {
      cronJob.stop();
    }
  });

  it("Should create and stop a cron job", () => {
    cronJob = cronProvider.schedule(
      "*/5 * * * * *",
      () => {
        console.log("Hello World");
      },
      { name: "test" },
    );

    expect(cronJob).toBeDefined();
    expect(cronJob).toBeInstanceOf(CronJob);
  });

  it("Should get the list of tasks created using the `schedule` function", () => {
    const tasks = cronProvider.getTasks();

    expect(tasks).toBeDefined();
    expect(tasks).toBeInstanceOf(Map);
    expect(tasks.size).toBe(1);
    expect(tasks.get("test")).toBeDefined();
    expect(tasks.get("test")).toBeInstanceOf(CronJob);
    cronProvider.getTask("test").stop();
  });

  it("Should get a specific task created using the `schedule` function", () => {
    const task = cronProvider.getTask("test");
    expect(task).toBeDefined();
    expect(task).toBeInstanceOf(CronJob);
  });
});
