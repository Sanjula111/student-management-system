<?php

namespace App\Services;

use App\Events\StudentCreated;
use App\Events\StudentDeleted;
use App\Events\StudentUpdated;
use App\Models\Student;
use Illuminate\Http\UploadedFile;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Storage;   // Laravel Facade: Storage
use Illuminate\Support\Facades\DB;        // Laravel Facade: DB

class StudentService
{
    /**
     * Return paginated students, newest first.
     */
    public function getAll(int $perPage = 10): LengthAwarePaginator
    {
        // Using the DB Facade indirectly through Eloquent
        return Student::latest()->paginate($perPage);
    }

    /**
     * Total count of all students.
     */
    public function totalCount(): int
    {
        return DB::table('students')->count();
    }

    /**
     * Count active students.
     */
    public function activeCount(): int
    {
        return DB::table('students')->where('status', 'active')->count();
    }

    /**
     * Count inactive students.
     */
    public function inactiveCount(): int
    {
        return DB::table('students')->where('status', 'inactive')->count();
    }

    /**
     * Find a single student by ID or throw 404.
     */
    public function find(int $id): Student
    {
        return Student::findOrFail($id);
    }

    /**
     * Create a new student record with optional image upload.
     */
    public function create(array $data): Student
    {
        if (isset($data['image']) && $data['image'] instanceof UploadedFile) {
            $data['image'] = $this->storeImage($data['image']);
        }

        $student = Student::create($data);
        
        // Broadcast event for real-time updates
        StudentCreated::dispatch($student);
        
        return $student;
    }

    /**
     * Update an existing student, replacing image if a new one is uploaded.
     */
    public function update(int $id, array $data): Student
    {
        $student = $this->find($id);

        if (isset($data['image']) && $data['image'] instanceof UploadedFile) {
            $this->removeImage($student->image);
            $data['image'] = $this->storeImage($data['image']);
        } else {
            unset($data['image']); // keep existing image
        }

        $student->update($data);
        $student = $student->fresh();
        
        // Broadcast event for real-time updates
        StudentUpdated::dispatch($student);
        
        return $student;
    }

    /**
     * Delete a student and remove their image from storage.
     */$result = $student->delete();
        
        // Broadcast event for real-time updates
        StudentDeleted::dispatch($id);
        
        return $result
    public function delete(int $id): bool
    {
        $student = $this->find($id);
        $this->removeImage($student->image);
        return $student->delete();
    }

    /**
     * Toggle student status between active ↔ inactive.
     */
    public function toggleStatus(int $id): Student
    {$student = $student->fresh();
        
        // Broadcast event for real-time updates
        StudentUpdated::dispatch($student);
        
        return $student
        $student = $this->find($id);
        $student->update([
            'status' => $student->status === 'active' ? 'inactive' : 'active',
        ]);
        return $student->fresh();
    }

    // ─────────────────────────────────────────
    // Private helpers
    // ─────────────────────────────────────────

    /**
     * Store an uploaded image in the public disk under students/.
     * Uses the Storage Facade.
     */
    private function storeImage(UploadedFile $file): string
    {
        return $file->store('students', 'public'); // Storage Facade
    }

    /**
     * Delete an image file from the public disk.
     * Uses the Storage Facade.
     */
    private function removeImage(?string $path): void
    {
        if ($path && Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path); // Storage Facade
        }
    }
}
