<?php

namespace App\Http\Controllers;

use App\Exports\StudentExport;
use App\Http\Controllers\Controller;
use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class ExportController extends Controller
{
    public function index(): \Inertia\Response
    {
        $total    = Student::count();
        $active   = Student::where('status', 'active')->count();
        $inactive = Student::where('status', 'inactive')->count();

        $students = Student::orderBy('created_at', 'desc')->get()->map(fn($s) => [
            'id'         => $s->id,
            'name'       => $s->name,
            'age'        => $s->age,
            'status'     => $s->status,
            'image'      => $s->image ?? null,
            'created_at' => $s->created_at->format('M d, Y'),
        ])->values()->toArray();

        return Inertia::render('Reports/Export', [
            'students' => $students,
            'stats'    => compact('total', 'active', 'inactive'),
        ]);
    }

    public function download(Request $request)
    {
        $validated = $request->validate([
            'student_ids'   => 'nullable|array',
            'student_ids.*' => 'integer',
            'fields'        => 'required|array|min:1',
            'fields.*'      => 'in:id,name,age,status,image,created_at',
            'status'        => 'nullable|in:all,active,inactive',
            'search'        => 'nullable|string|max:255',
        ]);

        $query = Student::query();

        // Apply search
        if (!empty($validated['search'])) {
            $search = $validated['search'];
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('id', $search)
                  ->orWhere('age', $search);
            });
        }

        // Apply status filter
        if (!empty($validated['status']) && $validated['status'] !== 'all') {
            $query->where('status', $validated['status']);
        }

        // Apply specific student selection
        if (!empty($validated['student_ids'])) {
            $query->whereIn('id', $validated['student_ids']);
        }

        $students = $query->orderBy('created_at', 'desc')->get();

        if ($students->isEmpty()) {
            return back()->with('error', 'No student records found to export.');
        }

        $fields   = $validated['fields'];
        $filename = 'students-export-' . now()->format('Y-m-d') . '.xlsx';

        return Excel::download(new StudentExport($students, $fields), $filename);
    }
}
