import { useState, useMemo } from 'react';
import styles from './AttendanceTable.module.css';

export default function AttendanceTable({
  rows = [],
  onMark,
  onRowClick,
  showActions = true,
  showStats = true,
  sortable = true,
  filterable = true,
  striped = true,
  hoverable = true,
  size = 'medium', // 'small' | 'medium' | 'large'
  className = ''
}) {
  const [sortField, setSortField] = useState('subject');
  const [sortDirection, setSortDirection] = useState('asc');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter and sort rows
  const processedRows = useMemo(() => {
    let filtered = rows.filter(row => {
      const matchesStatus = statusFilter === 'all' || row.status === statusFilter;
      const matchesSearch = row.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.studentName?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    });

    if (sortable) {
      filtered.sort((a, b) => {
        const aValue = a[sortField] || '';
        const bValue = b[sortField] || '';

        if (sortDirection === 'asc') {
          return aValue.toString().localeCompare(bValue.toString());
        } else {
          return bValue.toString().localeCompare(aValue.toString());
        }
      });
    }

    return filtered;
  }, [rows, sortField, sortDirection, statusFilter, searchTerm, sortable]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = rows.length;
    const present = rows.filter(r => r.status === 'PRESENT').length;
    const absent = rows.filter(r => r.status === 'ABSENT').length;
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

    return { total, present, absent, percentage };
  }, [rows]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleStatusToggle = (row, e) => {
    e.stopPropagation();
    if (onMark) {
      onMark({
        ...row,
        status: row.status === 'PRESENT' ? 'ABSENT' : 'PRESENT'
      });
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return '↕️';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  const getStatusIcon = (status) => {
    return status === 'PRESENT' ? '✅' : '❌';
  };

  if (rows.length === 0) {
    return (
      <div className={`${styles.emptyState} ${styles[size]}`}>
        <div className={styles.emptyIcon}>📊</div>
        <h3>No Attendance Records</h3>
        <p>No attendance data available for the selected criteria.</p>
      </div>
    );
  }

  return (
    <div className={`${styles.wrapper} ${styles[size]} ${className}`}>
      {/* Table Header with Stats and Filters */}
      {(showStats || filterable) && (
        <div className={styles.tableHeader}>
          {showStats && (
            <div className={styles.stats}>
              <div className={styles.statItem}>
                <span className={styles.statValue}>{stats.total}</span>
                <span className={styles.statLabel}>Total</span>
              </div>
              <div className={styles.statItem}>
                <span className={`${styles.statValue} ${styles.present}`}>
                  {stats.present}
                </span>
                <span className={styles.statLabel}>Present</span>
              </div>
              <div className={styles.statItem}>
                <span className={`${styles.statValue} ${styles.absent}`}>
                  {stats.absent}
                </span>
                <span className={styles.statLabel}>Absent</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statValue}>{stats.percentage}%</span>
                <span className={styles.statLabel}>Attendance</span>
              </div>
            </div>
          )}

          {filterable && (
            <div className={styles.filters}>
              <div className={styles.searchBox}>
                <input
                  type="text"
                  placeholder="Search subjects or students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={styles.searchInput}
                />
                <span className={styles.searchIcon}>🔍</span>
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="all">All Status</option>
                <option value="PRESENT">Present Only</option>
                <option value="ABSENT">Absent Only</option>
              </select>
            </div>
          )}
        </div>
      )}

      {/* Table */}
      <div className={styles.tableContainer}>
        <table className={`${styles.table} ${striped ? styles.striped : ''} ${hoverable ? styles.hoverable : ''}`}>
          <thead>
            <tr>
              <th
                className={sortable ? styles.sortable : ''}
                onClick={() => sortable && handleSort('subject')}
              >
                <span>
                  Subject {sortable && getSortIcon('subject')}
                </span>
              </th>
              <th
                className={sortable ? styles.sortable : ''}
                onClick={() => sortable && handleSort('studentName')}
              >
                <span>
                  Student {sortable && getSortIcon('studentName')}
                </span>
              </th>
              <th
                className={sortable ? styles.sortable : ''}
                onClick={() => sortable && handleSort('date')}
              >
                <span>
                  Date {sortable && getSortIcon('date')}
                </span>
              </th>
              <th
                className={sortable ? styles.sortable : ''}
                onClick={() => sortable && handleSort('status')}
              >
                <span>
                  Status {sortable && getSortIcon('status')}
                </span>
              </th>
              {showActions && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {processedRows.map((row, index) => (
              <tr
                key={row.id || index}
                className={onRowClick ? styles.clickable : ''}
                onClick={() => onRowClick && onRowClick(row)}
              >
                <td className={styles.subjectCell}>
                  <span className={styles.subjectName}>{row.subject}</span>
                  {row.subjectCode && (
                    <span className={styles.subjectCode}>{row.subjectCode}</span>
                  )}
                </td>
                <td className={styles.studentCell}>
                  {row.studentName || 'N/A'}
                </td>
                <td className={styles.dateCell}>
                  {row.date ? new Date(row.date).toLocaleDateString() : 'Today'}
                  {row.time && <span className={styles.time}>{row.time}</span>}
                </td>
                <td>
                  <span className={`${styles.status} ${styles[row.status?.toLowerCase()]}`}>
                    <span className={styles.statusIcon}>
                      {getStatusIcon(row.status)}
                    </span>
                    {row.status}
                    {row.markedBy && (
                      <span className={styles.markedBy}>by {row.markedBy}</span>
                    )}
                  </span>
                </td>
                {showActions && (
                  <td className={styles.actionsCell}>
                    <button
                      className={`${styles.toggleButton} ${row.status === 'PRESENT' ? styles.present : styles.absent}`}
                      onClick={(e) => handleStatusToggle(row, e)}
                      title={`Mark as ${row.status === 'PRESENT' ? 'Absent' : 'Present'}`}
                    >
                      {row.status === 'PRESENT' ? 'Mark Absent' : 'Mark Present'}
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className={styles.tableFooter}>
        <div className={styles.paginationInfo}>
          Showing {processedRows.length} of {rows.length} records
        </div>
        <div className={styles.lastUpdated}>
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}