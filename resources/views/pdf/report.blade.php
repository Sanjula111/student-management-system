<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Student Report</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'DejaVu Sans', sans-serif; font-size: 12px; color: #1e293b; background: #fff; }
  .header { background: linear-gradient(135deg, #4f46e5, #7c3aed); color: white; padding: 30px 40px; }
  .header h1 { font-size: 26px; font-weight: 700; letter-spacing: -0.5px; }
  .header p { margin-top: 4px; opacity: 0.85; font-size: 13px; }
  .meta { display: flex; gap: 16px; margin-top: 14px; }
  .meta-item { background: rgba(255,255,255,0.15); border-radius: 6px; padding: 6px 14px; font-size: 11px; }
  .content { padding: 30px 40px; }
  .stats-grid { display: flex; gap: 16px; margin-bottom: 28px; }
  .stat-card { flex: 1; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 18px; text-align: center; }
  .stat-card .number { font-size: 28px; font-weight: 700; color: #4f46e5; }
  .stat-card .label { color: #64748b; font-size: 11px; margin-top: 4px; }
  .stat-card.active .number { color: #10b981; }
  .stat-card.inactive .number { color: #ef4444; }
  .section-title { font-size: 15px; font-weight: 700; color: #1e293b; margin-bottom: 14px; padding-bottom: 8px; border-bottom: 2px solid #e2e8f0; }
  table { width: 100%; border-collapse: collapse; margin-top: 8px; }
  thead tr { background: #4f46e5; color: white; }
  thead th { padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 600; }
  tbody tr:nth-child(even) { background: #f8fafc; }
  tbody tr:hover { background: #eff6ff; }
  tbody td { padding: 9px 12px; border-bottom: 1px solid #e2e8f0; font-size: 11px; }
  .badge { display: inline-block; padding: 2px 8px; border-radius: 20px; font-size: 10px; font-weight: 600; }
  .badge-active { background: #dcfce7; color: #16a34a; }
  .badge-inactive { background: #fee2e2; color: #dc2626; }
  .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #e2e8f0; text-align: center; color: #94a3b8; font-size: 10px; }
</style>
</head>
<body>

<div class="header">
  <h1>📊 Student Management Report</h1>
  <p>Generated on {{ now()->format('F d, Y \a\t h:i A') }}</p>
  <div class="meta">
    <div class="meta-item">📅 From: {{ \Carbon\Carbon::parse($filters['start_date'])->format('M d, Y') }}</div>
    <div class="meta-item">📅 To: {{ \Carbon\Carbon::parse($filters['end_date'])->format('M d, Y') }}</div>
    <div class="meta-item">👤 Status: {{ ucfirst($filters['status']) }}</div>
    <div class="meta-item">📋 Type: {{ ucfirst($filters['report_type']) }}</div>
  </div>
</div>

<div class="content">

  <div class="stats-grid">
    <div class="stat-card">
      <div class="number">{{ $data['total'] }}</div>
      <div class="label">Total Students</div>
    </div>
    <div class="stat-card active">
      <div class="number">{{ $data['active'] }}</div>
      <div class="label">Active Students</div>
    </div>
    <div class="stat-card inactive">
      <div class="number">{{ $data['inactive'] }}</div>
      <div class="label">Inactive Students</div>
    </div>
    @if($data['total'] > 0)
    <div class="stat-card">
      <div class="number">{{ round(($data['active'] / $data['total']) * 100) }}%</div>
      <div class="label">Active Rate</div>
    </div>
    @endif
  </div>

  @if(!empty($data['students']))
  <div class="section-title">Student Records ({{ count($data['students']) }})</div>
  <table>
    <thead>
      <tr>
        <th>#</th>
        <th>Student ID</th>
        <th>Name</th>
        <th>Age</th>
        <th>Status</th>
        <th>Registered Date</th>
      </tr>
    </thead>
    <tbody>
      @foreach($data['students'] as $i => $student)
      <tr>
        <td>{{ $i + 1 }}</td>
        <td>#{{ $student['id'] }}</td>
        <td>{{ $student['name'] }}</td>
        <td>{{ $student['age'] }}</td>
        <td>
          <span class="badge badge-{{ $student['status'] }}">{{ ucfirst($student['status']) }}</span>
        </td>
        <td>{{ $student['created_at'] }}</td>
      </tr>
      @endforeach
    </tbody>
  </table>
  @endif

  @if(!empty($data['monthly']))
  <div class="section-title" style="margin-top: 28px;">Monthly Breakdown</div>
  <table>
    <thead>
      <tr>
        <th>Month</th>
        <th>Total Students</th>
        <th>Active Students</th>
      </tr>
    </thead>
    <tbody>
      @foreach($data['monthly'] as $month)
      <tr>
        <td>{{ $month['month'] }}</td>
        <td>{{ $month['total'] }}</td>
        <td>{{ $month['active'] }}</td>
      </tr>
      @endforeach
    </tbody>
  </table>
  @endif

  <div class="footer">
    Student Management System &mdash; Confidential Report &mdash; {{ now()->format('Y') }}
  </div>
</div>

</body>
</html>
