<?php

use App\Facades\StudentFacade;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\ExportController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', fn () => redirect()->route('dashboard'));

Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('/dashboard', function (StudentFacade $facade) {
        return Inertia::render('Dashboard', [
            'stats' => [
                'total'     => $facade->totalCount(),
                'active'    => $facade->activeCount(),
                'inactive'  => $facade->inactiveCount(),
                'new_month' => $facade->newThisMonth(),
            ],
        ]);
    })->name('dashboard');

    Route::prefix('students')->name('students.')->controller(StudentController::class)->group(function () {
        Route::get('/',              'index')->name('index');
        Route::get('/create',        'create')->name('create');
        Route::post('/',             'store')->name('store');
        Route::get('/{id}/edit',     'edit')->name('edit');
        Route::post('/{id}',         'update')->name('update');
        Route::delete('/{id}',       'destroy')->name('destroy');
        Route::patch('/{id}/status', 'toggleStatus')->name('status');
    });

    Route::get('/reports',               [ReportController::class, 'index'])->name('reports.index');
    Route::post('/reports/generate',     [ReportController::class, 'generate'])->name('reports.generate');
    Route::get('/reports/download-pdf',  [ReportController::class, 'downloadPdf'])->name('reports.download-pdf');

    Route::get('/export-data',           [ExportController::class, 'index'])->name('export.index');
    Route::post('/export-data/download', [ExportController::class, 'download'])->name('export.download');

});

require __DIR__ . '/auth.php';
