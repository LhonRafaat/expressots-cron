import { CronJob } from "cron";
import * as uuid from "uuid";

class CronDB {
  readonly jobs: Map<string, CronJob>;

  constructor() {
    this.jobs = new Map();
  }

  public getJobs(): Map<string, CronJob> {
    return this.jobs;
  }

  public getJob(name: string): CronJob {
    return this.jobs.get(name);
  }

  public addJob(name: string, job: CronJob): void {
    if (!name) {
      const id = uuid.v4();
      this.jobs.set(id.toString(), job);

      return;
    }
    this.jobs.set(name, job);
  }
}
const cronDB = new CronDB();
export default cronDB;
