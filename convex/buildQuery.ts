import {
  DocumentByName,
  ExpressionOrValue,
  FilterBuilder,
  IndexNames,
  IndexRange,
  IndexRangeBuilder,
  NamedIndex,
  OrderedQuery,
  PaginationOptions,
  PaginationResult,
  Query,
  QueryInitializer,
} from "convex/server";
import { DataModel, TableNames } from "./_generated/dataModel";
import { QueryCtx } from "./_generated/server";

type TableInfo = DataModel[TableNames];

type QueryBuilderArgs<
  T extends TableNames,
  IndexName extends IndexNames<DataModel[T]>,
> = {
  table: T;
  index?: {
    name: IndexName;
    indexRange?: (
      q: IndexRangeBuilder<
        DocumentByName<DataModel, T>,
        NamedIndex<DataModel[T], IndexName>
      >
    ) => IndexRange;
  };
  order?: "asc" | "desc";
  filter?: (q: FilterBuilder<TableInfo>) => ExpressionOrValue<boolean>;
};

type PaginatedQueryBuilderArgs<
  T extends TableNames,
  IndexName extends IndexNames<DataModel[T]>,
> = QueryBuilderArgs<T, IndexName> & {
  paginate: PaginationOptions;
};

export function buildQuery<
  T extends TableNames,
  IndexName extends IndexNames<DataModel[T]>,
>(
  ctx: QueryCtx,
  args: QueryBuilderArgs<T, IndexName>
): OrderedQuery<DataModel[T]> {
  const qi: QueryInitializer<DataModel[T]> = ctx.db.query(args.table);

  let q: Query<DataModel[T]> = qi;

  if (args.index) {
    const K: Query<DataModel[T]> = qi.withIndex(
      args.index.name,
      args.index.indexRange
    );
    q = K;
  }

  if (args.filter) {
    q = q.filter(args.filter);
  }

  let qo: OrderedQuery<DataModel[T]> = q;

  if (args.order) {
    qo = q.order(args.order);
  }

  return qo;
}

export function buildPaginatedQuery<
  T extends TableNames,
  IndexName extends IndexNames<DataModel[T]>,
>(
  ctx: QueryCtx,
  args: PaginatedQueryBuilderArgs<T, IndexName>
): Promise<PaginationResult<DocumentByName<DataModel, T>>> {
  const qi: QueryInitializer<DataModel[T]> = ctx.db.query(args.table);

  let q: Query<DataModel[T]> = qi;

  if (args.index) {
    const K: Query<DataModel[T]> = qi.withIndex(
      args.index.name,
      args.index.indexRange
    );
    q = K;
  }

  if (args.filter) {
    q = q.filter(args.filter);
  }

  let qo: OrderedQuery<DataModel[T]> = q;

  if (args.order) {
    qo = q.order(args.order);
  }

  const P: Promise<PaginationResult<DocumentByName<DataModel, T>>> =
    qo.paginate(args.paginate);
  return P;
}
