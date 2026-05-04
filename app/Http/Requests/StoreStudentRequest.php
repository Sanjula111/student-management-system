<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth; // Auth Facade

class StoreStudentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Auth::check(); // Auth Facade usage
    }

    public function rules(): array
    {
        return [
            'name'   => ['required', 'string', 'min:2', 'max:255'],
            'image'  => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif,webp', 'max:2048'],
            'age'    => ['required', 'integer', 'min:1', 'max:120'],
            'status' => ['required', 'in:active,inactive'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required'   => 'Student name is required.',
            'name.min'        => 'Name must be at least 2 characters.',
            'name.max'        => 'Name cannot exceed 255 characters.',
            'image.image'     => 'The uploaded file must be an image.',
            'image.mimes'     => 'Allowed formats: jpeg, png, jpg, gif, webp.',
            'image.max'       => 'Image size must not exceed 2MB.',
            'age.required'    => 'Age is required.',
            'age.integer'     => 'Age must be a whole number.',
            'age.min'         => 'Age must be at least 1.',
            'age.max'         => 'Age cannot exceed 120.',
            'status.required' => 'Please select a status.',
            'status.in'       => 'Status must be active or inactive.',
        ];
    }
}
