<?php

namespace App\Http\Controllers;

use App\Facades\StudentFacade;
use App\Http\Requests\StoreStudentRequest;
use App\Http\Requests\UpdateStudentRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StudentController extends Controller
{
    public function __construct(protected StudentFacade $facade) {}

    public function index(Request $request): Response
    {
        $query    = $request->get('search', '');
        $students = $query
            ? $this->facade->search($query)
            : $this->facade->getAll();

        $students->getCollection()->transform(function ($s) {
            $s->image_url = $s->image ? asset('storage/' . $s->image) : null;
            return $s;
        });

        return Inertia::render('Students/Index', [
            'students' => $students,
            'search'   => $query,
            'stats'    => [
                'total'     => $this->facade->totalCount(),
                'active'    => $this->facade->activeCount(),
                'inactive'  => $this->facade->inactiveCount(),
                'new_month' => $this->facade->newThisMonth(),
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Students/Create');
    }

    public function store(StoreStudentRequest $request): RedirectResponse
    {
        $student = $this->facade->create($request->validated());
        return redirect()->route('students.index')
            ->with('success', "🎉 Student \"{$student->name}\" added successfully!");
    }

    public function edit(int $id): Response
    {
        $student = $this->facade->find($id);
        $student->image_url = $student->image ? asset('storage/' . $student->image) : null;
        return Inertia::render('Students/Edit', ['student' => $student]);
    }

    public function update(UpdateStudentRequest $request, int $id): RedirectResponse
    {
        $student = $this->facade->update($id, $request->validated());
        return redirect()->route('students.index')
            ->with('success', "✅ Student \"{$student->name}\" updated successfully!");
    }

    public function destroy(int $id): RedirectResponse
    {
        $student = $this->facade->find($id);
        $name    = $student->name;
        $this->facade->delete($id);
        return redirect()->route('students.index')
            ->with('success', "🗑️ Student \"{$name}\" deleted successfully!");
    }

    public function toggleStatus(int $id): RedirectResponse
    {
        $student = $this->facade->toggleStatus($id);
        $label   = ucfirst($student->status);
        return redirect()->route('students.index')
            ->with('success', "🔄 \"{$student->name}\" is now {$label}.");
    }
}
