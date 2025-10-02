declare module "pg" {
  export interface QueryResultRow {
    [column: string]: unknown;
  }

  export interface QueryResult<T extends QueryResultRow = QueryResultRow> {
    rows: T[];
  }

  export interface QueryConfig {
    text: string;
    values?: ReadonlyArray<unknown>;
  }

  export interface PoolConfig {
    connectionString?: string;
    max?: number;
    idleTimeoutMillis?: number;
    ssl?: boolean | { rejectUnauthorized?: boolean };
  }

  export interface PoolClient {
    query<T extends QueryResultRow = QueryResultRow>(
      queryText: string,
      values?: ReadonlyArray<unknown>
    ): Promise<QueryResult<T>>;
    query<T extends QueryResultRow = QueryResultRow>(
      config: QueryConfig
    ): Promise<QueryResult<T>>;
    release(): void;
  }

  export class Pool {
    constructor(config?: PoolConfig);
    connect(): Promise<PoolClient>;
    query<T extends QueryResultRow = QueryResultRow>(
      queryText: string,
      values?: ReadonlyArray<unknown>
    ): Promise<QueryResult<T>>;
    query<T extends QueryResultRow = QueryResultRow>(
      config: QueryConfig
    ): Promise<QueryResult<T>>;
  }
}
