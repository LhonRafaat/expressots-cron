/* eslint-disable @typescript-eslint/no-explicit-any */

import { CRON_METADATA_KEY } from "../constants";

export function CronInit(): ClassDecorator {
  return function (constructor: any): any {
    const originalConstructor = constructor;

    function newConstructor(...args: Array<any>): any {
      const instance = new originalConstructor(...args);

      // Iterate over all method names and check for the CallOnInit metadata
      const prototype = Object.getPrototypeOf(instance);
      Object.getOwnPropertyNames(prototype).forEach((methodName) => {
        if (Reflect.getMetadata(CRON_METADATA_KEY, prototype, methodName)) {
          const method = instance[methodName];
          if (typeof method === "function") {
            method.call(instance);
          }
        }
      });

      return instance;
    }

    newConstructor.prototype = originalConstructor.prototype;

    return newConstructor;
  };
}
