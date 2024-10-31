import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

export const statusValidator = v.union(
  v.literal("waiting"),
  v.literal("approved"),
  v.literal("rejected")
);

export type Status = Infer<typeof statusValidator>;

export default defineSchema({
  video: defineTable({
    title: v.string(),
    duration: v.number(),
    channelId: v.id("channel"),
    status: statusValidator,
  }).index("by_channelId", ["channelId"]),
  channel: defineTable({
    name: v.string(),
  }),
});
