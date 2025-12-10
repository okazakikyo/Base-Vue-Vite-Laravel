<?php

namespace App\Repositories;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Query\Builder as QueryBuilder;

/**¸
 * Abstract base repository providing common data-access methods.
 */
abstract class BaseRepository
{
    /**
     * The Eloquent model instance bound to this repository.
     *
     * @var Model
     */
    public Model $model;

    /**
     * BaseRepository constructor.
     *
     * @param Model $model An Eloquent model instance (e.g. new Company()).
     */
    public function __construct(Model $model)
    {
        $this->model = $model;
    }

    /**
     * Fetch all records, optionally with pagination.
     *
     * @param int|null $perPage If provided, return a paginator; otherwise return a Collection.
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator|\Illuminate\Database\Eloquent\Collection
     */
    public function all(?int $perPage = null)
    {
        if ($perPage) {
            return $this->model->paginate($perPage);
        }

        return $this->model->all();
    }

    /**
     * Create a new record with the given data.
     *
     * @param array $data
     * @return Model
     */
    public function create(array $data): Model
    {
        return $this->model->create($data);
    }

    /**
     * Update an existing record by its primary key.
     *
     * @param int|string $id
     * @param array $data
     * @return Model
     *
     * @throws ModelNotFoundException
     */
    public function update(int|string $id, array $data): Model
    {
        $record = $this->find($id);
        $record->update($data);

        return $record;
    }

    /**
     * Find a record by its primary key or fail.
     *
     * @param int|string $id
     * @return Model
     *
     * @throws ModelNotFoundException
     */
    public function find(int|string $id): Model
    {
        return $this->model->findOrFail($id);
    }

    /**
     * Delete a record by its primary key.
     *
     * @param int|string $id
     * @return bool|null
     *
     * @throws ModelNotFoundException
     */
    public function delete(int|string $id): ?bool
    {
        $record = $this->model->find($id);
        return $record->delete();
    }

    /**
     * Generic method to find a record by a specified field and value.
     *
     * @param string $field Column name to search by.
     * @param mixed $value Value to match.
     * @return Model|null
     */
    public function findOneBy(string $field, mixed $value): ?Model
    {
        return $this->model->where($field, $value)->first();
    }

    /**
     * Find records matching multiple field=>value conditions.
     *
     * @param array $conditions Associative array of field => value
     * @return Collection           Eloquent collection of matching models
     */
    public function findWhere(array $conditions): Collection
    {
        $query = $this->model->newQuery();

        foreach ($conditions as $field => $value) {
            if (is_array($value)) {
                $query->whereIn($field, $value);
            } else {
                $query->where($field, $value);
            }
        }

        // Return the Collection directly
        return $query->get();
    }

    /**
     * Return a new query builder for the model.
     *
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function query()
    {
        return $this->model->newQuery();
    }

    /**
     * updateOrCreate a record based on the given attributes and values.
     */

    public function updateOrCreate(array $attributes, array $values = []): mixed
    {
        return $this->model->updateOrCreate($attributes, $values);
    }

    /**
     * upsert records based on the given attributes and values.
     *
     * @return Model
     */

    public function upsert(array $values, array $uniqueBy, array $update = []): mixed
    {
        return $this->model->upsert($values, $uniqueBy, $update);
    }

    public function fillQuery(array $filters, ?Builder $query = null): Builder
    {
        if ($query === null) {
            $query = $this->model->newQuery();
        }

        // Iterate over each filter and apply it to the query
        foreach ($filters as $key => $value) {
            if (is_array($value)) {
                $query->where(function ($subQuery) use ($key, $value) {
                    $subQuery->whereIn($key, $value);
                    if (in_array(null, $value)) {
                        $subQuery->orWhereNull($key);
                    }
                });
            } elseif ($value !== null) {
                $query->where($key, $value);
            }elseif(empty($value) ){
                $query->whereNull($key);
            }
        }
        return $query;
    }

    public function findLockForUpdate(): QueryBuilder
    {
        return DB::table($this->model->getTable())->lockForUpdate();
    }
}
