<?php

namespace App\Services;

use App\Models\Student;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Support\Collection;

class ReportService
{
    public function getStats(): array
    {
        $total    = Student::count();
        $active   = Student::where('status', 'active')->count();
        $inactive = Student::where('status', 'inactive')->count();
        $newThisMonth = Student::whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->count();

        return compact('total', 'active', 'inactive', 'newThisMonth');
    }

    public function generateReport(array $filters): array
    {
        $query = Student::query()
            ->whereBetween('created_at', [
                Carbon::parse($filters['start_date'])->startOfDay(),
                Carbon::parse($filters['end_date'])->endOfDay(),
            ]);

        if ($filters['status'] !== 'all') {
            $query->where('status', $filters['status']);
        }

        $students = $query->orderBy('created_at', 'desc')->get();

        $total    = $students->count();
        $active   = $students->where('status', 'active')->count();
        $inactive = $students->where('status', 'inactive')->count();

        // Monthly breakdown for chart
        $monthly = $this->getMonthlyBreakdown($filters);

        $result = [
            'total'    => $total,
            'active'   => $active,
            'inactive' => $inactive,
            'monthly'  => $monthly,
            'filters'  => $filters,
        ];

        if ($filters['report_type'] === 'detailed') {
            $result['students'] = $students->map(fn($s) => [
                'id'         => $s->id,
                'name'       => $s->name,
                'age'        => $s->age,
                'status'     => $s->status,
                'created_at' => $s->created_at->format('M d, Y'),
            ])->values()->toArray();
        }

        return $result;
    }

    public function generatePdf(array $data, array $filters)
    {
        $html = view('pdf.report', compact('data', 'filters'))->render();

        return Pdf::loadHTML($html)->setPaper('a4', 'portrait');
    }

    private function getMonthlyBreakdown(array $filters): array
    {
        $start = Carbon::parse($filters['start_date']);
        $end   = Carbon::parse($filters['end_date']);

        $months = [];
        $current = $start->copy()->startOfMonth();

        while ($current->lte($end)) {
            $query = Student::whereYear('created_at', $current->year)
                ->whereMonth('created_at', $current->month);

            if ($filters['status'] !== 'all') {
                $query->where('status', $filters['status']);
            }

            $months[] = [
                'month'  => $current->format('M Y'),
                'total'  => (clone $query)->count(),
                'active' => (clone $query)->where('status', 'active')->count(),
            ];

            $current->addMonth();
        }

        return $months;
    }
}
