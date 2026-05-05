<?php

use App\Facades\StudentFacade;
use App\Http\Controllers\StudentController;
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

});

require __DIR__ . '/auth.php';
