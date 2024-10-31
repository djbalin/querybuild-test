import { usePaginatedQuery, useQuery } from "convex/react";
import { useState } from "react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";
import { Status } from "../convex/schema";
import "./App.css";

function App() {
  // Filter states
  const [selectedChannel, setSelectedChannel] = useState<
    Id<"channel"> | undefined
  >(undefined);
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [status, setStatus] = useState<
    "waiting" | "approved" | "rejected" | undefined
  >(undefined);

  const channels = useQuery(api.queries.getAllChannels);

  // Queries with filters applied
  const result = useQuery(api.queries.testQuery, {
    channelId: selectedChannel,
    status,
    order,
  });

  const { results: paginatedResult, loadMore } = usePaginatedQuery(
    api.queries.testPaginatedQuery,
    {
      channelId: selectedChannel,
      order,
      status,
    },
    { initialNumItems: 2 }
  );

  return (
    <div className="App">
      {/* Filter controls */}
      <div
        style={{
          padding: "20px",
          display: "flex",
          gap: "20px",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        {/* Channel filters */}
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <span>Channel:</span>
          <select
            value={selectedChannel || ""}
            onChange={(e) =>
              setSelectedChannel((e.target.value as Id<"channel">) || undefined)
            }
            style={{
              padding: "8px 12px",
              borderRadius: "6px",
              border: "1px solid #ddd",
              fontSize: "14px",
              cursor: "pointer",
              minWidth: "150px",
              appearance: "none", // Removes default browser styling
              backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 8px center",
              backgroundSize: "16px",
            }}
          >
            <option value="">All Channels</option>
            {channels?.map((channel) => (
              <option key={channel._id} value={channel._id}>
                {channel.name}
              </option>
            ))}
          </select>
        </div>

        {/* Order filter */}
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <span>Order:</span>
          <button
            onClick={() => setOrder(order === "asc" ? "desc" : "asc")}
            style={{
              padding: "8px 16px",
              borderRadius: "6px",
              border: "1px solid #ddd",
              // backgroundColor: "white",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "14px",
              transition: "all 0.2s ease",
            }}
          >
            <span
              style={{
                display: "inline-block",
                transform: order === "asc" ? "rotate(0deg)" : "rotate(180deg)",
                transition: "transform 0.2s ease",
              }}
            >
              ↑
            </span>
            {order === "asc" ? "Ascending" : "Descending"}
          </button>
        </div>

        {/* Status filters */}
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <span>Status:</span>
          {["waiting", "approved", "rejected"].map((statusOption) => (
            <button
              key={statusOption}
              onClick={() =>
                setStatus(
                  status === statusOption ? undefined : (statusOption as Status)
                )
              }
              style={{
                backgroundColor:
                  status === statusOption ? "#007bff" : "#f0f0f0",
                color: status === statusOption ? "white" : "black",
                padding: "5px 10px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            >
              {statusOption.charAt(0).toUpperCase() + statusOption.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Results display */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
          padding: "20px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <span style={{ fontSize: 30, fontWeight: 700 }}>Normal results:</span>
          {result?.map((video) => (
            <span key={video._id}>
              {video.title}, {video.status}, {video.channelId}
            </span>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <span style={{ fontSize: 30, fontWeight: 700 }}>
            Paginated results:
          </span>
          {paginatedResult?.map((video) => (
            <span key={video._id}>
              {video.title}, {video.status}, {video.channelId}
            </span>
          ))}
        </div>
      </div>

      <button
        onClick={() => loadMore(2)}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Load more
      </button>
    </div>
  );
}

export default App;
