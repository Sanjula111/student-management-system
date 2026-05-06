<?php

namespace App\Facades;

use Illuminate\Support\Facades\Facade;

/**
 * @method static array getStats()
 * @method static array generateReport(array $filters)
 * @method static \Barryvdh\DomPDF\PDF generatePdf(array $data, array $filters)
 */
class ReportFacade extends Facade
{
    protected static function getFacadeAccessor(): string
    {
        return 'report.service';
    }
}
