import { Meteor } from "meteor/meteor";
import { UserStatsCollection } from "../../models/stats";

function callMeteor<T = any>(method: string, ...args: any[]): Promise<T> {
  return new Promise((resolve, reject) => {
    // @ts-ignore meteor callback
    Meteor.call(method, ...args, (err: any, res: T) => {
      if (err) reject(err);
      else resolve(res);
    });
  });
}

export const UserStatsService = {
  fetchStats() {
    return UserStatsCollection.findOne({});
  },

  init() {
    return callMeteor("userStats.init");
  },

  incrementTaskCount() {
    return callMeteor("userStats.incrementTaskCount");
  },

  addTime(minutes: number) {
    return callMeteor("userStats.addTime", minutes);
  },
};

export type IUserStatsService = typeof UserStatsService;
