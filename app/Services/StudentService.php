<?php

namespace App\Services;

use App\Models\Student;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class StudentService
{
    public function getAll(int $perPage = 10)
    {
        return Student::latest()->paginate($perPage);
    }

    public function search(string $query, int $perPage = 10)
    {
        return Student::where('name', 'like', "%{$query}%")
            ->orWhere('id', $query)
            ->orWhere('age', $query)
            ->orWhere('status', 'like', "%{$query}%")
            ->latest()
            ->paginate($perPage)
            ->withQueryString();
    }

    public function totalCount(): int    { return DB::table('students')->count(); }
    public function activeCount(): int   { return DB::table('students')->where('status', 'active')->count(); }
    public function inactiveCount(): int { return DB::table('students')->where('status', 'inactive')->count(); }

    public function newThisMonth(): int
    {
        return DB::table('students')
            ->whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->count();
    }

    public function find(int $id): Student  { return Student::findOrFail($id); }

    public function create(array $data): Student
    {
        if (isset($data['image']) && $data['image'] instanceof UploadedFile) {
            $data['image'] = $data['image']->store('students', 'public');
        }
        return Student::create($data);
    }

    public function update(int $id, array $data): Student
    {
        $student = $this->find($id);
        if (isset($data['image']) && $data['image'] instanceof UploadedFile) {
            if ($student->image) Storage::disk('public')->delete($student->image);
            $data['image'] = $data['image']->store('students', 'public');
        } else {
            unset($data['image']);
        }
        $student->update($data);
        return $student->fresh();
    }

    public function delete(int $id): bool
    {
        $student = $this->find($id);
        if ($student->image) Storage::disk('public')->delete($student->image);
        return $student->delete();
    }

    public function toggleStatus(int $id): Student
    {
        $student = $this->find($id);
        $student->update(['status' => $student->status === 'active' ? 'inactive' : 'active']);
        return $student->fresh();
    }
}
