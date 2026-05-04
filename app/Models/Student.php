<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'image',
        'age',
        'status',
    ];

    protected $casts = [
        'age' => 'integer',
    ];

    /**
     * Get the full public URL for the student's image.
     */
    public function getImageUrlAttribute(): ?string
    {
        return $this->image
            ? asset('storage/' . $this->image)
            : null;
    }

    /**
     * Check whether the student is active.
     */
    public function isActive(): bool
    {
        return $this->status === 'active';
    }
}
