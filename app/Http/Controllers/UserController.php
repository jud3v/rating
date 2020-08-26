<?php

namespace App\Http\Controllers;

use App\Repositories\UserRepository;
use App\Utils\HttpUtils;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public $repository;

    public function __construct(UserRepository $repository)
    {
        $this->repository = $repository;
        $this->middleware('auth:api');
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request)
    {
        $where = [];
        if (!is_null($request->input('is_student'))){
            $where['is_student'] = $request->input('is_student') == 1;
        }
        return HttpUtils::sendSuccessResponse('',$this->repository->findAll($where));
    }


    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request)
    {
        $data = $request->all();
        $this->repository->create($data);
        return HttpUtils::sendSuccessResponse('resource created');
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return JsonResponse
     */
    public function show($id)
    {
        return HttpUtils::sendSuccessResponse('',$this->repository->find($id));
    }



    /**
     * Update the specified resource in storage.
     *
     * @param Request $request
     * @param  int  $id
     * @return JsonResponse
     */
    public function update(Request $request, $id)
    {
        $data = $request->all();
        return HttpUtils::sendSuccessResponse('',$this->repository->edit($id,$data));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return JsonResponse
     */
    public function destroy($id)
    {
        return HttpUtils::sendSuccessResponse('',$this->repository->delete($id));
    }
}
