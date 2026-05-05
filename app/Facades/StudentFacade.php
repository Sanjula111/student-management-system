<?php

namespace App\Facades;

use App\Models\Student;
use App\Services\StudentService;

/**
 * Facade Design Pattern
 * Controller → Facade → Service → Model → Database
 */
class StudentFacade
{
    public function __construct(protected StudentService $service) {}

    public function getAll(int $perPage = 10)         { return $this->service->getAll($perPage); }
    public function search(string $q, int $pp = 10)   { return $this->service->search($q, $pp); }
    public function totalCount(): int                 { return $this->service->totalCount(); }
    public function activeCount(): int                { return $this->service->activeCount(); }
    public function inactiveCount(): int              { return $this->service->inactiveCount(); }
    public function newThisMonth(): int               { return $this->service->newThisMonth(); }
    public function find(int $id): Student            { return $this->service->find($id); }
    public function create(array $data): Student      { return $this->service->create($data); }
    public function update(int $id, array $d): Student{ return $this->service->update($id, $d); }
    public function delete(int $id): bool             { return $this->service->delete($id); }
    public function toggleStatus(int $id): Student    { return $this->service->toggleStatus($id); }
}
