import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import { CronProvider } from "../src/cron.provider";
import { CronJob } from "cron";

// Mock the `uuid` module
vi.mock("uuid", () => ({
  v4: vi.fn(() => "mocked-uuid"),
}));

describe("Cron Provider", () => {
  let cronProvider: CronProvider;
  let cronJob: CronJob;

  beforeAll(() => {
    cronProvider = new CronProvider();
  });

  afterAll(() => {
    // make sure to clear out everything
    if (cronJob) {
      cronJob.stop();
    }
    const tasks = cronProvider.getTasks();
    // double check no cron is running
    if (tasks.size > 0) {
      tasks.forEach((cron) => {
        cron.stop();
      });
    }

    tasks.clear();
  });

  it("Should create and stop a cron job with a provided name", () => {
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

  it("Should create and stop a cron job with a default name", () => {
    const defaultCron = cronProvider.schedule("*/5 * * * * *", () => {
      console.log("Hello World");
    });

    const tasks = cronProvider.getTasks();
    // Verify that the cron job was created with the mocked UUID
    expect(tasks.has("mocked-uuid")).toBe(true);

    tasks.delete("mocked-uuid");

    defaultCron?.stop();
  });

  it("Should get the list of tasks created using the `schedule` function", () => {
    const tasks = cronProvider.getTasks();

    console.log(tasks);

    expect(tasks).toBeDefined();
    expect(tasks).toBeInstanceOf(Map);
    expect(tasks.size).toBe(1);
    expect(tasks.get("test")).toBeDefined();
    expect(tasks.get("test")).toBeInstanceOf(CronJob);
  });

  it("Should get a specific task created using the `schedule` function", () => {
    const task = cronProvider.getTask("test");
    expect(task).toBeDefined();
    expect(task).toBeInstanceOf(CronJob);
  });

  it("should not be running when immediate is set to false", () => {
    const task = cronProvider.schedule(
      "*/5 * * * * *",
      () => {
        console.log("Hello World");
      },
      { startImmediately: false, name: "idle" },
    );
    expect(task).toBeDefined();
    expect(task).toBeInstanceOf(CronJob);
    expect(task.running).toBe(false);

    const tasks = cronProvider.getTasks();

    tasks.delete("idle");
    task.stop();
  });

  it("should  be running when immediate is set to true", () => {
    const task = cronProvider.schedule(
      "*/5 * * * * *",
      () => {
        console.log("Hello World");
      },
      { startImmediately: true, name: "running" },
    );
    expect(task).toBeDefined();
    expect(task).toBeInstanceOf(CronJob);
    expect(task.running).toBe(true);

    const tasks = cronProvider.getTasks();

    tasks.delete("running");
    task.stop();
  });

  it("should throw error if cron expression is wrong", () => {
    expect(() => cronProvider.schedule("1", () => {}, { name: "test" })).toThrow();
  });
});
