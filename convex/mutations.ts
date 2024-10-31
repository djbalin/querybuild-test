import { mutation } from "./_generated/server";

export const seedData = mutation({
  handler: async (ctx) => {
    const c1 = await ctx.db.insert("channel", {
      name: "Channel 1",
    });
    const c2 = await ctx.db.insert("channel", {
      name: "Channel 2",
    });

    // 10 videos alternating between waiting, approved and rejected, and randomly assigned to channels
    await ctx.db.insert("video", {
      title: "Video 1",
      duration: 10,
      channelId: c1,
      status: "waiting",
    });
    await ctx.db.insert("video", {
      title: "Video 2",
      duration: 20,
      channelId: c1,
      status: "approved",
    });
    await ctx.db.insert("video", {
      title: "Video 3",
      duration: 30,
      channelId: c2,
      status: "rejected",
    });
    await ctx.db.insert("video", {
      title: "Video 4",
      duration: 40,
      channelId: c1,
      status: "waiting",
    });
    await ctx.db.insert("video", {
      title: "Video 5",
      duration: 50,
      channelId: c2,
      status: "approved",
    });
    await ctx.db.insert("video", {
      title: "Video 6",
      duration: 60,
      channelId: c1,
      status: "rejected",
    });
    await ctx.db.insert("video", {
      title: "Video 7",
      duration: 70,
      channelId: c2,
      status: "waiting",
    });
    await ctx.db.insert("video", {
      title: "Video 8",
      duration: 80,
      channelId: c1,
      status: "approved",
    });
    await ctx.db.insert("video", {
      title: "Video 9",
      duration: 90,
      channelId: c2,
      status: "rejected",
    });
  },
});
