<?php

namespace App\Facades;

use App\Models\Student;
use App\Services\StudentService;
use Illuminate\Pagination\LengthAwarePaginator;

/**
 * ┌─────────────────────────────────────────────────────┐
 * │           FACADE DESIGN PATTERN                      │
 * │                                                      │
 * │  StudentController                                   │
 * │       ↓  (calls)                                     │
 * │  StudentFacade   ← You are here                      │
 * │       ↓  (delegates to)                              │
 * │  StudentService                                      │
 * │       ↓  (queries)                                   │
 * │  Student Model → MySQL Database                      │
 * └─────────────────────────────────────────────────────┘
 *
 * The Facade provides a clean, simple API so the Controller
 * never needs to know HOW things are done — only WHAT to ask for.
 */
class StudentFacade
{
    public function __construct(protected StudentService $service) {}

    public function getAll(int $perPage = 10): LengthAwarePaginator
    {
        return $this->service->getAll($perPage);
    }

    public function totalCount(): int   { return $this->service->totalCount(); }
    public function activeCount(): int  { return $this->service->activeCount(); }
    public function inactiveCount(): int { return $this->service->inactiveCount(); }

    public function find(int $id): Student
    {
        return $this->service->find($id);
    }

    public function create(array $data): Student
    {
        return $this->service->create($data);
    }

    public function update(int $id, array $data): Student
    {
        return $this->service->update($id, $data);
    }

    public function delete(int $id): bool
    {
        return $this->service->delete($id);
    }

    public function toggleStatus(int $id): Student
    {
        return $this->service->toggleStatus($id);
    }
}
