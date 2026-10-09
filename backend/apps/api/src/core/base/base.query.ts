import type { ObjectLiteral, Repository, SelectQueryBuilder } from 'typeorm';

/** Root alias of every base-class query. */
export const ALIAS = 'e';

/**
 * Joins relations given as dot paths (`'district'`, `'district.region'`).
 * Nested aliases are `parent_child`, e.g. `district_region`.
 */
export function applyNestedJoins(
  qb: SelectQueryBuilder<ObjectLiteral>,
  relations: string[] = [],
) {
  const joined = new Set<string>();
  for (const path of relations) {
    let parent = ALIAS;
    let alias = '';
    for (const part of path.split('.')) {
      alias = alias ? `${alias}_${part}` : part;
      if (!joined.has(alias)) {
        qb.leftJoinAndSelect(`${parent}.${part}`, alias);
        joined.add(alias);
      }
      parent = alias;
    }
  }
}

/** Only real columns are accepted from requests, so input never reaches SQL as an identifier. */
export function findColumn(
  repository: Repository<ObjectLiteral>,
  name: string,
) {
  return repository.metadata.columns.find((c) => c.propertyName === name);
}

/** Casting to text also makes jsonb translations searchable in every language at once. */
export function textExpression(propertyName: string) {
  return `CAST(${ALIAS}.${propertyName} AS text)`;
}

export function escapeLike(value: string) {
  return value.replace(/[\\%_]/g, (char) => `\\${char}`);
}

/** `(col1 ILIKE :search OR col2 ILIKE :search)` over the given columns. */
export function applySearch(
  qb: SelectQueryBuilder<ObjectLiteral>,
  repository: Repository<ObjectLiteral>,
  fields: string[] = [],
  search?: string | null,
) {
  const columns = fields
    .map((field) => findColumn(repository, field))
    .filter((c) => c !== undefined);
  if (!search?.trim() || columns.length === 0) {
    return;
  }
  const conditions = columns.map(
    (c) => `${textExpression(c.propertyName)} ILIKE :search`,
  );
  qb.andWhere(`(${conditions.join(' OR ')})`, {
    search: `%${escapeLike(search.trim())}%`,
  });
}
