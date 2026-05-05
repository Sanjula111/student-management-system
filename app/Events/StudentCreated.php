<?php

namespace App\Events;

use App\Models\Student;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class StudentCreated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $student;

    public function __construct(Student $student)
    {
        $this->student = $student;
    }

    public function broadcastOn(): array
    {
        return [
            new Channel('students'),
        ];
    }

    public function broadcastAs(): string
    {
        return 'student.created';
    }

    public function broadcastWith(): array
    {
        return [
            'id' => $this->student->id,
            'name' => $this->student->name,
            'age' => $this->student->age,
            'status' => $this->student->status,
            'image' => $this->student->image,
            'image_url' => $this->student->image ? asset('storage/' . $this->student->image) : null,
            'created_at' => $this->student->created_at,
            'updated_at' => $this->student->updated_at,
        ];
    }
}
