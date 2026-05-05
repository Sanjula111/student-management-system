<?php

namespace App\Http\Controllers;

use App\Facades\StudentFacade;
use App\Http\Requests\StoreStudentRequest;
use App\Http\Requests\UpdateStudentRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * StudentController
 *
 * THIN controller — contains ZERO business logic.
 * Every operation is delegated to StudentFacade.
 *
 * Flow: Controller → Facade → Service → Model → DB
 */
class StudentController extends Controller
{
    public function __construct(protected StudentFacade $facade) {}

    /**
     * GET /students — list all students (paginated)
     */
    public function index(): Response
    {
        $students = $this->facade->getAll(10);

        // Append computed image_url to each student
        $students->getCollection()->transform(function ($s) {
            $s->image_url = $s->image ? asset('storage/' . $s->image) : null;
            return $s;
        });

        return Inertia::render('Students/Index', [
            'students' => $students,
            'stats'    => [
                'total'    => $this->facade->totalCount(),
                'active'   => $this->facade->activeCount(),
                'inactive' => $this->facade->inactiveCount(),
            ],
        ]);
    }

    /**
     * GET /students/create — show create form
     */
    public function create(): Response
    {
        return Inertia::render('Students/Create');
    }

    /**
     * POST /students — save new student
     */
    public function store(StoreStudentRequest $request): RedirectResponse|JsonResponse
    {
        $student = $this->facade->create($request->validated());
        
        // Append image_url
        $student->image_url = $student->image ? asset('storage/' . $student->image) : null;
        
        // Return JSON for AJAX requests, redirect otherwise
        if ($request->expectsJson()) {
            return response()->json([
                'success' => true,
                'message' => '🎉 Student added successfully!',
                'student' => $student,
            ], 201);
        }

        return redirect()
            ->route('students.index')
            ->with('success', '🎉 Student added successfully!');
    }

    /**
     * GET /students/{id}/edit — show edit form
     */
    public function edit(int $id): Response
    {
        $student = $this->facade->find($id);|JsonResponse
    {
        $student = $this->facade->update($id, $request->validated());
        
        // Append image_url
        $student->image_url = $student->image ? asset('storage/' . $student->image) : null;
        
        // Return JSON for AJAX requests, redirect otherwise
        if ($request->expectsJson()) {
            return response()->json([
                'success' => true,
                'message' => '✅ Student updated successfully!',
                'student' => $student,
            ], 200);
        }
        return Inertia::render('Students/Edit', [
            'student' => $student,
        ]);
    }

    /**
     * POST /students/{id} — update student
     * (POST used instead of PUT to support multipart/form-data)
     */
    public function update(URequest $request, int $id): RedirectResponse|JsonResponse
    {
        $this->facade->delete($id);

        // Return JSON for AJAX requests, redirect otherwise
        if ($request->expectsJson()) {
            return response()->json([
                'success' => true,
                'message' => '🗑️ Student deleted successfully!',
                'id' => $id,
            ], 200);
        }$request->validated());
Request $request, int $id): RedirectResponse|JsonResponse
    {
        $student = $this->facade->toggleStatus($id);
        
        // Append image_url
        $student->image_url = $student->image ? asset('storage/' . $student->image) : null;
        
        $label   = ucfirst($student->status);

        // Return JSON for AJAX requests, redirect otherwise
        if ($request->expectsJson()) {
            return response()->json([
                'success' => true,
                'message' => "🔄 Student marked as {$label}.",
                'student' => $student,
            ], 200);
        }ted successfully!');
    }

    /**
     * DELETE /students/{id} — delete student + image
     */
    public function destroy(int $id): RedirectResponse
    {
        $this->facade->delete($id);

        return redirect()
            ->route('students.index')
            ->with('success', '🗑️ Student deleted successfully!');
    }

    /**
     * PATCH /students/{id}/status — toggle active / inactive
     */
    public function toggleStatus(int $id): RedirectResponse
    {
        $student = $this->facade->toggleStatus($id);
        $label   = ucfirst($student->status);

        return redirect()
            ->route('students.index')
            ->with('success', "🔄 Student marked as {$label}.");
    }
}
