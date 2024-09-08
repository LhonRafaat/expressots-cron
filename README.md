# Expressots-cron Package

## About

Expressots-cron package is a provider for [Expressots](https://expresso-ts.com/) that facilitates using cron jobs through a decorator and a cron provider. Expressots-cron is buit on top of [cron](https://github.com/kelektiv/node-cron) package for Nodejs and it includes most of it's features. Check out blew sections for further details on how to use and API.

## Table of Contents

- [About](#about)
- [Table of Contents](#table-of-contents)
- [Installation](#installation)
- [Usage](#usage)
- [API](#api)
  - [Cron Decorator](#cron-decorator)
  - [Cron Provider](#cron-provider)
  - [Methods](#methods)
- [License](#license)

## Installation

Install the package via npm:

```bash
npm install expressots-cron
```

## Usage

Make sure to register your provider inside your `app.provider.ts`

```
import { AppExpress } from "@expressots/adapter-express";
import {
    Env,
    IMiddleware,
    Middleware,
    provide,
    ProviderManager,
} from "@expressots/core";
import { container } from "../../app.container";
import { CronProvider } from "expressots-cron";

@provide(App)
export class App extends AppExpress {
    private middleware: IMiddleware;
    private provider: ProviderManager;

    constructor() {
        super();
        this.middleware = container.get<IMiddleware>(Middleware);
        this.provider = container.get(ProviderManager);
    }

    protected configureServices(): void {
        this.provider.register(Env);
        this.provider.register(CronProvider); // register here
    }

    protected postServerInitialization(): void {
        if (this.isDevelopment()) {
            this.provider.get(Env).checkAll();
        }
    }

    protected serverShutdown(): void {}
}

```

use it inside a controller file or a usecase.

using the decorator:

```
import { controller } from "@expressots/adapter-express";
import { AppUseCase } from "./app.usecase";
import { CronProvider, Cron } from "expressots-cron";
import { postConstruct } from "inversify";

@controller("/")
export class AppController {
    constructor(
        private appUseCase: AppUseCase,
        private cronProvider: CronProvider,
    ) {}

    @postConstruct() // must use postConstruct from inversify, if not the cron will not run automatically.
    init() {
        this.runCron();
    }

    @Cron("*/2 * * * * *", { name: "cronjob", timezone: "America/New_York" }) // if no name is assigned, a random uuid is generated
    public runCron() {
        console.log("cron running !");
        //
        const job = this.cronProvider.getTask("cronjob"); // retrieves a job by a provided name
        console.log(job); // typeof job is CronJob
    }
}

```

using the provider:

```
import { controller } from "@expressots/adapter-express";
import { AppUseCase } from "./app.usecase";
import { CronProvider, Cron } from "expressots-cron";
import { postConstruct } from "inversify";

@controller("/")
export class AppController {
    constructor(
        private appUseCase: AppUseCase,
        private cronProvider: CronProvider,
    ) {}

    @postConstruct()
    init() {
        this.runCron();
    }

    public runCron() {
        const job = this.cronProvider.schedule(
            "*/2 * * * * *",
            () => {
                console.log("cron running");
            },
            {
                name: "MyCronJob",
                startImmediately: false, // set to true to start the job immediately
            },
        );

        job.start();
    }
}

```

## API

The cron package uses a simple and familiar cron syntax to define recurring tasks. The syntax consists of five fields:

```plaintext
* * * * *
| | | | |
| | | | └── Day of the week (0 - 7) (Sunday to Saturday)
| | | └──── Month (1 - 12)
| | └────── Day of the month (1 - 31)
| └──────── Hour (0 - 23)
└────────── Minute (0 - 59)
```

For example:

- `* * * * *` – Run the task every minute.
- `0 0 * * *` – Run the task every day at midnight.

### Cron Decorator

```
@Cron("*/2 * * * * *", options)
```

options are:

```
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

```

### Cron Provider

methods that are available on the provider:

```
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

```

### Methods

start: Initiates the job.

stop: Halts the job.

setTime: Modifies the time for the CronJob. Parameter must be a CronTime.

lastDate: Provides the last execution date.

nextDate: Indicates the subsequent date that will activate an onTick.

nextDates(count): Supplies an array of upcoming dates that will initiate an onTick.

fireOnTick: Allows modification of the onTick calling behavior.

addCallback: Permits addition of onTick callbacks.

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

Author [Lhon Rafaat Mohammed](https://github.com/LhonRafaat)
