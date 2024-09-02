import { CronJob } from "cron";
import * as uuid from "uuid";

class CronDB {
  readonly jobs: Map<string, CronJob>;

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
      console.log(this.getJobs());

      return;
    }
    this.jobs.set(name, job);

    console.log(this.getJobs());
  }
}
const cronDB = new CronDB();
export default cronDB;
