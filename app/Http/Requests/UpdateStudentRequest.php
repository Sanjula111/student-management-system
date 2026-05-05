<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class UpdateStudentRequest extends FormRequest
{
    public function authorize(): bool { return Auth::check(); }

    public function rules(): array
    {
        return [
            'name'   => ['required', 'string', 'min:2', 'max:255'],
            'image'  => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif,webp', 'max:2048'],
            'age'    => ['required', 'integer', 'min:1', 'max:120'],
            'status' => ['required', 'in:active,inactive'],
        ];
    }
}
