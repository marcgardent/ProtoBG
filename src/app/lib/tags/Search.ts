
export class Request<TIndex, TValue>{

  private readonly atLeastOneClause = [];
  private readonly withClause = [];

  constructor(private readonly search: Search<TIndex, TValue>) {

  }

  public atLeastOne(...indexes: TIndex[]) {
    this.atLeastOneClause.push(...indexes);
    return this;
  }

  public with(...indexes: TIndex[]) {
    this.withClause.push(...indexes);
    return this;
  }

  public toList(): Set<TValue> {
    return this.search.atLeastOneWith(this.atLeastOneClause, this.withClause);
  }

  public toUnique(): TValue {
    const request = this.toList();
    return request.size == 1 ? request.values().next().value : null;
  }
}

export class Search<TIndex, TValue> {
  public indexToValue = new Map<TIndex, TValue[]>();
  public valueToIndex = new Map<TValue, TIndex[]>();
  public indexes = new Set<TIndex>();

  public add(value: TValue, indexes: TIndex[]) {
    for (let index of indexes) {
      this.addEntry(index, value);
    }
  }

  public addEntry(index: TIndex, value: TValue) {
    this.merge(this.indexToValue, index, value);
    this.merge(this.valueToIndex, value, index);
    this.indexes.add(index);
  }

  private merge<MKey, MValue>(
    target: Map<MKey, MValue[]>,
    key: MKey,
    value: MValue
  ) {
    if (target.has(key)) {
      target.get(key).push(value);
    } else {
      target.set(key, [value]);
    }
  }

  public atLeastOne(...indexes: TIndex[]): Request<TIndex, TValue> {
    return new Request<TIndex, TValue>(this).atLeastOne(...indexes);
  }

  public atLeastOneWith(atLeastOneClause: TIndex[], withClause: TIndex[]) {
    const result = new Set<TValue>();

    for (let k of atLeastOneClause) {
      for (let v of this.getValuesOf(k)) {
        if (withClause.length == 0 || this.fromWith(v, withClause)) {
          result.add(v);
        }
      }
    }
    return result;
  }

  public getIndexesOf(value: TValue) {
    if (this.valueToIndex.has(value)) {
      return Array.from(this.valueToIndex.get(value));
    } else {
      return [];
    }
  }

  public getValuesOf(index: TIndex) {
    if (this.indexToValue.has(index)) {
      return Array.from(this.indexToValue.get(index));
    } else {
      return [];
    }
  }

  public fromWith(from: TValue, withClause: TIndex[]): boolean {
    if (this.valueToIndex.has(from)) {
      const all = this.valueToIndex.get(from);
      for (let i of withClause) {
        if (all.indexOf(i) < 0) {
          return false;
        }
      }
      return true;
    } else {
      return false;
    }
  }
}
