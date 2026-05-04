<?php

namespace App\Http\Controllers;

use App\Facades\StudentFacade;
use App\Http\Requests\StoreStudentRequest;
use App\Http\Requests\UpdateStudentRequest;
use Illuminate\Http\RedirectResponse;
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
    public function store(StoreStudentRequest $request): RedirectResponse
    {
        $this->facade->create($request->validated());

        return redirect()
            ->route('students.index')
            ->with('success', '🎉 Student added successfully!');
    }

    /**
     * GET /students/{id}/edit — show edit form
     */
    public function edit(int $id): Response
    {
        $student = $this->facade->find($id);
        $student->image_url = $student->image ? asset('storage/' . $student->image) : null;

        return Inertia::render('Students/Edit', [
            'student' => $student,
        ]);
    }

    /**
     * POST /students/{id} — update student
     * (POST used instead of PUT to support multipart/form-data)
     */
    public function update(UpdateStudentRequest $request, int $id): RedirectResponse
    {
        $this->facade->update($id, $request->validated());

        return redirect()
            ->route('students.index')
            ->with('success', '✅ Student updated successfully!');
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
