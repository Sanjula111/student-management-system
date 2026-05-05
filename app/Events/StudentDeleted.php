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

class StudentDeleted implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $studentId;

    public function __construct(int $studentId)
    {
        $this->studentId = $studentId;
    }

    public function broadcastOn(): array
    {
        return [
            new Channel('students'),
        ];
    }

    public function broadcastAs(): string
    {
        return 'student.deleted';
    }

    public function broadcastWith(): array
    {
        return [
            'id' => $this->studentId,
        ];
    }
}
