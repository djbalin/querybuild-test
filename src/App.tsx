import { usePaginatedQuery, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import "./App.css";

function App() {
  const result = useQuery(api.queries.testQuery, {});

  const { results: paginatedResult, loadMore } = usePaginatedQuery(
    api.queries.testPaginatedQuery,
    {},
    { initialNumItems: 2 }
  );

  return (
    <div className="App">
      Normal results:
      {result?.map((video) => <div key={video._id}>{video.title}</div>)}
      Paginated results:
      {paginatedResult?.map((video) => (
        <div key={video._id}>{video.title}</div>
      ))}
      <button onClick={() => loadMore(2)}>Load more</button>
    </div>
  );
}

export default App;
