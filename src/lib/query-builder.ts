export class QueryBuilder {
  private _select: string = '*';
  private _from: string = '';
  private _where: string[] = [];
  private _orderBy: string = '';
  private _limit: number | null = null;
  private _offset: number | null = null;
  private _params: any[] = [];

  static table(tableName: string) {
    const instance = new QueryBuilder();
    instance._from = `\`${tableName}\``;
    return instance;
  }

  select(fields: string) {
    this._select = fields;
    return this;
  }

  where(column: string, operator: string, value: any) {
    this._where.push(`\`${column}\` ${operator} ?`);
    this._params.push(value);
    return this;
  }

  orderBy(column: string, direction: 'ASC' | 'DESC' = 'ASC') {
    this._orderBy = `ORDER BY \`${column}\` ${direction}`;
    return this;
  }

  limit(value: number) {
    this._limit = value;
    return this;
  }

  offset(value: number) {
    this._offset = value;
    return this;
  }

  // Phương thức để lấy câu query hoàn chỉnh và params
  build() {
    let sql = `SELECT ${this._select} FROM ${this._from}`;

    if (this._where.length > 0) {
      sql += ` WHERE ${this._where.join(' AND ')}`;
    }

    if (this._orderBy) {
      sql += ` ${this._orderBy}`;
    }

    if (this._limit !== null) {
      sql += ` LIMIT ${this._limit}`;
    }

    if (this._offset !== null) {
      sql += ` OFFSET ${this._offset}`;
    }

    return { sql, params: this._params };
  }
}
