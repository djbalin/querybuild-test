import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { query } from "./_generated/server";
import { buildPaginatedQuery, buildQuery } from "./buildQuery";
import { statusValidator } from "./schema";

export const testQuery = query({
  args: {
    channelId: v.optional(v.id("channel")),
    status: v.optional(statusValidator),
    order: v.optional(v.union(v.literal("asc"), v.literal("desc"))),
  },
  handler: async (ctx, { channelId, status }) => {
    const q = buildQuery(ctx, {
      table: "video",
      index: channelId
        ? {
            name: "by_channelId",
            indexRange: (q) => q.eq("channelId", channelId),
          }
        : undefined,
      filter: status ? (q) => q.eq("status", status) : undefined,
    });

    return q.collect();
  },
});

export const testPaginatedQuery = query({
  args: {
    channelId: v.optional(v.id("channel")),
    status: v.optional(statusValidator),
    order: v.optional(v.union(v.literal("asc"), v.literal("desc"))),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, { channelId, status, order, paginationOpts }) => {
    const paginationResult = await buildPaginatedQuery(ctx, {
      table: "video",
      order: order,
      filter: status ? (q) => q.eq("status", status) : undefined,
      index: channelId
        ? {
            name: "by_channelId",
            indexRange: (q) => q.eq("channelId", channelId),
          }
        : undefined,
      paginate: paginationOpts,
    });

    return paginationResult;
  },
});
