<?php


namespace App\Repositories;


use App\Models\Comment;

class CommentRepository extends AbstractRepository
{


    public function __construct(Comment $model)
    {
        $this->model = $model;
    }

}