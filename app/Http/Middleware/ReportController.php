<?php

namespace App\Http\Controllers;

use App\Facades\ReportFacade;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReportController extends Controller
{
    public function index(): Response
    {
        $stats = ReportFacade::getStats();

        return Inertia::render('Reports/Generate', [
            'stats' => $stats,
        ]);
    }

    public function generate(Request $request)
    {
        $validated = $request->validate([
            'start_date'  => 'required|date',
            'end_date'    => 'required|date|after_or_equal:start_date',
            'status'      => 'required|in:all,active,inactive',
            'report_type' => 'required|in:summary,detailed',
        ]);

        $data = ReportFacade::generateReport($validated);

        if (empty($data['students']) && $validated['report_type'] === 'detailed') {
            return back()->with('error', 'No student records found for the selected filters.');
        }

        return back()->with([
            'success'     => 'Report generated successfully!',
            'reportData'  => $data,
        ]);
    }

    public function downloadPdf(Request $request)
    {
        $validated = $request->validate([
            'start_date'  => 'required|date',
            'end_date'    => 'required|date|after_or_equal:start_date',
            'status'      => 'required|in:all,active,inactive',
            'report_type' => 'required|in:summary,detailed',
        ]);

        $data = ReportFacade::generateReport($validated);

        $pdf = ReportFacade::generatePdf($data, $validated);

        $filename = 'student-report-' . now()->format('Y-m-d') . '.pdf';

        return $pdf->download($filename);
    }
}
