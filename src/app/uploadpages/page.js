'use client';

import { useState } from 'react';
import { classList } from '@/app/data/classList';
import { useRouter } from 'next/navigation';
import DescriptionIcon from '@mui/icons-material/Description';

export default function ClassroomTable() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [teacherFilter, setTeacherFilter] = useState('');
  const [startDateFilter, setStartDateFilter] = useState('');
  const [page, setPage] = useState(1);
  const router = useRouter();

  const itemsPerPage = 10;

  const filteredList = classList
    .filter((cls) => cls.name.toLowerCase().includes(search.toLowerCase()))
    .filter((cls) => !statusFilter || cls.status === statusFilter)
    .filter((cls) => !teacherFilter || cls.teacher === teacherFilter)
    .filter((cls) => !startDateFilter || cls.startDate === startDateFilter);

  const paginatedList = filteredList.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const totalPages = Math.ceil(filteredList.length / itemsPerPage);
  const teachers = [...new Set(classList.map((cls) => cls.teacher))];
  const statuses = [...new Set(classList.map((cls) => cls.status))];

  return (
    <div style={{ padding: '24px', background: '#fff', borderRadius: '12px', marginTop: '20px' }}>
      <h2 style={{ marginBottom: '16px' }}>Danh sách lớp học</h2>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>
        <input
          type="text"
          placeholder="Tìm kiếm tên lớp..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc', flex: 1 }}
        />

        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">Tất cả trạng thái</option>
          {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>

        <select value={teacherFilter} onChange={(e) => setTeacherFilter(e.target.value)}>
          <option value="">Tất cả giáo viên</option>
          {teachers.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>

        <input
          type="date"
          value={startDateFilter}
          onChange={(e) => setStartDateFilter(e.target.value)}
        />
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#f5f5f5' }}>
            <tr>
              {['Tên lớp', 'Trạng thái', 'Giáo viên', 'Ngày bắt đầu', 'Ngày kết thúc', 'Lịch học', 'Độ tuổi', 'Số buổi', 'Sĩ số', 'Số buổi đã học', 'Giáo trình', 'Ghi chú', 'Chấm điểm'].map((header, index) => (
                <th key={index} style={{ padding: '10px', border: '1px solid #ddd', fontWeight: 'bold', whiteSpace: 'nowrap' }}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedList.map((cls, index) => (
              <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                <td style={tdStyle}>{cls.name}</td>
                <td style={tdStyle}>{cls.status}</td>
                <td style={tdStyle}>{cls.teacher}</td>
                <td style={tdStyle}>{cls.startDate}</td>
                <td style={tdStyle}>{cls.endDate}</td>
                <td style={tdStyle}>{cls.schedule}</td>
                <td style={tdStyle}>{cls.age}</td>
                <td style={tdStyle}>{cls.sessions}</td>
                <td style={tdStyle}>{cls.students}</td>
                <td style={tdStyle}>{cls.completedSessions}</td>
                <td style={{ ...tdStyle, maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  <a href={cls.curriculum} target="_blank" rel="noopener noreferrer">{cls.curriculum}</a>
                </td>
                <td style={tdStyle}>{cls.note}</td>
                <td style={{ ...tdStyle, textAlign: 'center' }}>
                  <button
                    onClick={() => {
                      const query = new URLSearchParams({
                        name: cls.name,
                        teacher: cls.teacher,
                        status: cls.status,
                        startDate: cls.startDate,
                        endDate: cls.endDate,
                        schedule: cls.schedule,
                        age: cls.age,
                        sessions: cls.sessions.toString(),
                        students: cls.students.toString(),
                        completedSessions: cls.completedSessions.toString(),
                        curriculum: cls.curriculum,
                        note: cls.note,
                      }).toString();
                      router.push(`/pointManager?${query}`);
                    }}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      border: '1px solid #ccc',
                      cursor: 'pointer',
                      backgroundColor: '#f0f0f0'
                    }}
                  >
                    <DescriptionIcon />
                  </button>
                  {/* <button
                    onClick={() => router.push(`/pointManager`)}
                    style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #ccc', cursor: 'pointer', backgroundColor: '#f0f0f0' }}
                  >
                    <DescriptionIcon />
                  </button> */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px', gap: '8px' }}>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
          <button
            key={p}
            onClick={() => setPage(p)}
            style={{ padding: '6px 12px', backgroundColor: page === p ? '#ddd' : '#fff', border: '1px solid #ccc', borderRadius: '4px' }}
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}

const tdStyle = {
  padding: '10px',
  border: '1px solid #ddd',
  whiteSpace: 'nowrap'
};
