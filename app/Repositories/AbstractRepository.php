<?php


namespace App\Repositories;


class AbstractRepository
{
    protected $model;

    public function create(array $data)
    {
        return $this->model->create($data);
    }

    public function edit(int $id,array $data)
    {
        $edit = $this->find($id);
        $edit->fill($data);
        $edit->save();
        return $edit;
    }

    public function delete($id)
    {
        $edit = $this->find($id);
        return $edit->delete();
    }

    public function findAll($limit = null, array $relations = [], $conditions = [])
    {
        $query = $this->model->newQuery();
        foreach ($conditions as $key => $value){
            $query->where($key,'=',$value);
        }
        if ($limit) {
            $query->limit($limit);
        }
        foreach ($relations as $r) {
            $query->with($r);
        }
        return $query->get();
    }

    public function find($id)
    {
        return $this->model->find($id);
    }
}