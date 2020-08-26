<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Repositories\CourseRepository;
use App\Utils\HttpUtils;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CourseController extends Controller
{
    public $repository;

    public function __construct(CourseRepository $repository)
    {
        $this->repository = $repository;
        $this->middleware('auth:api');
    }

    /**
     * Display a listing of the resource.
     *
     * @return JsonResponse
     */
    public function index()
    {
        $claims = jwtDecodeToken();
        $data = [];
        if (!$claims['is_student']){
            //teacher
            $data['waiting'] = $this->repository->findCourses($claims['id'],$claims['is_student'],true);
            $data['confirmed'] = $this->repository->findCourses($claims['id'],$claims['is_student'],false);
        } else {
            //student
            $data = $this->repository->findCourses($claims['id'],$claims['is_student'],false);
        }
        return HttpUtils::sendSuccessResponse('', $data);
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
        $claims = jwtDecodeToken();
        $data['waiting_for_approval'] = $claims['is_student'];
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

    public function accept($id)
    {
        $course = Course::findOrFail($id);
        $course->waiting_for_approval = 0;
        $course->save();
        return HttpUtils::sendSuccessResponse('true');
    }
}
