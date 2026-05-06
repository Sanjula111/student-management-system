<?php

namespace App\Exports;

use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Fill;

class StudentExport implements FromCollection, WithHeadings, WithStyles, WithColumnWidths
{
    protected Collection $students;
    protected array $fields;

    private array $fieldLabels = [
        'id'         => 'Student ID',
        'name'       => 'Full Name',
        'age'        => 'Age',
        'status'     => 'Status',
        'image'      => 'Image URL',
        'created_at' => 'Registered Date',
    ];

    public function __construct(Collection $students, array $fields)
    {
        $this->students = $students;
        $this->fields   = $fields;
    }

    public function collection(): Collection
    {
        return $this->students->map(function ($student) {
            $row = [];
            foreach ($this->fields as $field) {
                if ($field === 'created_at') {
                    $row[$field] = $student->created_at->format('Y-m-d');
                } else {
                    $row[$field] = $student->{$field} ?? '';
                }
            }
            return $row;
        });
    }

    public function headings(): array
    {
        return array_map(
            fn($f) => $this->fieldLabels[$f] ?? ucfirst($f),
            $this->fields
        );
    }

    public function styles(Worksheet $sheet): array
    {
        return [
            1 => [
                'font' => ['bold' => true, 'color' => ['rgb' => 'FFFFFF']],
                'fill' => [
                    'fillType'   => Fill::FILL_SOLID,
                    'startColor' => ['rgb' => '4F46E5'],
                ],
            ],
        ];
    }

    public function columnWidths(): array
    {
        $widths = [];
        $cols = range('A', 'Z');
        foreach ($this->fields as $i => $field) {
            $widths[$cols[$i]] = match ($field) {
                'name'       => 25,
                'image'      => 40,
                'created_at' => 18,
                default      => 15,
            };
        }
        return $widths;
    }
}
