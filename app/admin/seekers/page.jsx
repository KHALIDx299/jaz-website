'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import * as XLSX from 'xlsx'

export default function AdminSeekersPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [seekers, setSeekers] = useState([])
  const [filteredSeekers, setFilteredSeekers] = useState([])
  const [selectedIds, setSelectedIds] = useState([])
  const [filterSpec, setFilterSpec] = useState('all')
  const [filterExp, setFilterExp] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    filterSeekers()
  }, [seekers, filterSpec, filterExp, searchTerm])

  const loadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profile?.role !== 'admin') {
        router.push('/dashboard')
        return
      }

      const { data } = await supabase
        .from('job_seekers')
        .select('*')
        .order('created_at', { ascending: false })

      setSeekers(data || [])
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  function filterSeekers() {
    let result = [...seekers]

    if (filterSpec !== 'all') {
      result = result.filter(s => s.specialization === filterSpec)
    }

    if (filterExp !== 'all') {
      result = result.filter(s => s.experience_years === filterExp)
    }

    if (searchTerm.trim()) {
      const term = searchTerm.trim().toLowerCase()
      result = result.filter(s =>
        s.full_name.toLowerCase().includes(term) ||
        s.email.toLowerCase().includes(term) ||
        s.phone.includes(term)
      )
    }

    setFilteredSeekers(result)
  }

  function toggleSelect(id) {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id))
    } else {
      setSelectedIds([...selectedIds, id])
    }
  }

  function toggleSelectAll() {
    if (selectedIds.length === filteredSeekers.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(filteredSeekers.map(s => s.id))
    }
  }

  function exportToExcel() {
    const selected = filteredSeekers.filter(s => selectedIds.includes(s.id))

    if (selected.length === 0) {
      alert('من فضلك اختر مرشّحين أولاً')
      return
    }

    const data = selected.map((s, i) => ({
      'م': i + 1,
      'الاسم': s.full_name,
      'التخصص': s.specialization,
      'سنوات الخبرة': s.experience_years,
      'الجوال': s.phone,
      'الإيميل': s.email,
      'لينكدإن': s.linkedin_url || '-',
      'رابط السيرة الذاتية': s.cv_url || '-',
      'تاريخ التسجيل': new Date(s.created_at).toLocaleDateString('ar-SA'),
    }))

    const ws = XLSX.utils.json_to_sheet(data)
    ws['!cols'] = [
      { wch: 5 },
      { wch: 25 },
      { wch: 20 },
      { wch: 20 },
      { wch: 15 },
      { wch: 25 },
      { wch: 30 },
      { wch: 50 },
      { wch: 15 },
    ]

    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'المرشحون')

    const fileName = `مرشحين-JAZ-${new Date().toLocaleDateString('ar-SA').replace(/\//g, '-')}.xlsx`
    XLSX.writeFile(wb, fileName)
  }

  async function deleteSeeker(id, name) {
    if (!confirm(`هل أنت متأكد من حذف "${name}"؟`)) return

    const { error } = await supabase.from('job_seekers').delete().eq('id', id)
    if (!error) loadData()
    else alert('خطأ: ' + error.message)
  }

  const specializations = [...new Set(seekers.map(s => s.specialization))]
  const experienceLevels = [...new Set(seekers.map(s => s.experience_years))]

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a1929', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'white' }}>جارٍ التحميل...</p>
      </div>
    )
  }

  return (
    <div dir="rtl" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0a1929 0%, #1a3a52 50%, #2d5f3f 100%)', padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ color: 'white', fontSize: '2rem', margin: 0 }}>👤 الباحثون عن عمل</h1>
            <p style={{ color: '#a0aec0', margin: '0.3rem 0 0 0' }}>قاعدة بيانات المرشحين</p>
          </div>
          <div style={{ display: 'flex', gap: '0.7rem', flexWrap: 'wrap' }}>
            <Link href="/admin" style={btnSecondary}>← لوحة الأدمن</Link>
            <Link href="/" style={btnSecondary}>الرئيسية</Link>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <StatCard label="إجمالي المسجّلين" value={seekers.length} color="#3b82f6" />
          <StatCard label="المعروضون حالياً" value={filteredSeekers.length} color="#22c55e" />
          <StatCard label="المختارون للتصدير" value={selectedIds.length} color="#f5a623" />
        </div>

        <div style={cardStyle}>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            <input
              type="text"
              placeholder="🔍 بحث بالاسم أو الإيميل..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={filterStyle}
            />
            <select value={filterSpec} onChange={e => setFilterSpec(e.target.value)} style={filterStyle}>
              <option value="all">كل التخصصات</option>
              {specializations.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select value={filterExp} onChange={e => setFilterExp(e.target.value)} style={filterStyle}>
              <option value="all">كل مستويات الخبرة</option>
              {experienceLevels.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
          </div>

          <div style={{ display: 'flex', gap: '0.7rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <button onClick={toggleSelectAll} style={btnSelectAll}>
              {selectedIds.length === filteredSeekers.length && filteredSeekers.length > 0 ? '☐ إلغاء تحديد الكل' : '☑ تحديد الكل'}
            </button>
            <button
              onClick={exportToExcel}
              disabled={selectedIds.length === 0}
              style={{ ...btnExport, opacity: selectedIds.length === 0 ? 0.5 : 1, cursor: selectedIds.length === 0 ? 'not-allowed' : 'pointer' }}
            >
              📥 تصدير المختارين Excel ({selectedIds.length})
            </button>
          </div>

          {filteredSeekers.length === 0 ? (
            <p style={{ color: '#a0aec0', textAlign: 'center', padding: '2rem' }}>لا يوجد باحثون عن عمل يطابقون الفلاتر.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', color: 'white' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid rgba(255,255,255,0.1)' }}>
                    <th style={thStyle}>☑</th>
                    <th style={thStyle}>الاسم</th>
                    <th style={thStyle}>التخصص</th>
                    <th style={thStyle}>الخبرة</th>
                    <th style={thStyle}>الجوال</th>
                    <th style={thStyle}>الإيميل</th>
                    <th style={thStyle}>السيرة</th>
                    <th style={thStyle}>التاريخ</th>
                    <th style={thStyle}>إجراء</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSeekers.map(seeker => (
                    <tr key={seeker.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={tdStyle}>
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(seeker.id)}
                          onChange={() => toggleSelect(seeker.id)}
                          style={{ cursor: 'pointer', width: '18px', height: '18px' }}
                        />
                      </td>
                      <td style={tdStyle}><strong>{seeker.full_name}</strong></td>
                      <td style={tdStyle}>{seeker.specialization}</td>
                      <td style={tdStyle}>{seeker.experience_years}</td>
                      <td style={tdStyle}>
                        <a href={'tel:' + seeker.phone} style={{ color: '#22c55e', textDecoration: 'none' }}>{seeker.phone}</a>
                      </td>
                      <td style={tdStyle}>
                        <a href={'mailto:' + seeker.email} style={{ color: '#3b82f6', textDecoration: 'none', fontSize: '0.85rem' }}>{seeker.email}</a>
                      </td>
                      <td style={tdStyle}>
                        {seeker.cv_url ? (
                          <a href={seeker.cv_url} target="_blank" rel="noopener noreferrer" style={btnDownload}>
                            📥 تنزيل
                          </a>
                        ) : <span style={{ color: '#888' }}>—</span>}
                      </td>
                      <td style={tdStyle}>{new Date(seeker.created_at).toLocaleDateString('ar-SA')}</td>
                      <td style={tdStyle}>
                        <button onClick={() => deleteSeeker(seeker.id, seeker.full_name)} style={btnDelete}>🗑️</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

function StatCard({ label, value, color }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '15px', padding: '1.5rem', textAlign: 'center' }}>
      <div style={{ color, fontSize: '2.5rem', fontWeight: 'bold' }}>{value}</div>
      <div style={{ color: '#a0aec0', marginTop: '0.3rem' }}>{label}</div>
    </div>
  )
}

const cardStyle = {
  background: 'rgba(255,255,255,0.05)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '15px',
  padding: '1.5rem',
}

const filterStyle = {
  padding: '0.7rem 1rem',
  background: 'rgba(255,255,255,0.05)',
  color: 'white',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '8px',
  fontSize: '0.9rem',
  outline: 'none',
  fontFamily: 'system-ui, sans-serif',
}

const btnSecondary = {
  background: 'rgba(255,255,255,0.1)',
  color: 'white',
  padding: '0.6rem 1.2rem',
  borderRadius: '8px',
  textDecoration: 'none',
  border: '1px solid rgba(255,255,255,0.2)',
  display: 'inline-block',
}

const btnSelectAll = {
  background: 'rgba(59,130,246,0.2)',
  color: '#93c5fd',
  padding: '0.6rem 1.2rem',
  borderRadius: '8px',
  border: '1px solid rgba(59,130,246,0.3)',
  cursor: 'pointer',
  fontSize: '0.9rem',
  fontFamily: 'system-ui, sans-serif',
}

const btnExport = {
  background: 'linear-gradient(135deg, #22c55e, #16a34a)',
  color: 'white',
  padding: '0.6rem 1.5rem',
  borderRadius: '8px',
  border: 'none',
  fontWeight: 'bold',
  fontSize: '0.95rem',
  fontFamily: 'system-ui, sans-serif',
}

const thStyle = {
  textAlign: 'right',
  padding: '0.8rem',
  fontSize: '0.85rem',
  color: '#a0aec0',
  fontWeight: 'normal',
}

const tdStyle = {
  padding: '0.8rem',
  fontSize: '0.9rem',
}

const btnDownload = {
  background: 'rgba(34,197,94,0.2)',
  color: '#86efac',
  padding: '0.4rem 0.8rem',
  borderRadius: '6px',
  textDecoration: 'none',
  fontSize: '0.85rem',
  border: '1px solid rgba(34,197,94,0.3)',
}

const btnDelete = {
  background: 'rgba(239,68,68,0.2)',
  color: '#fca5a5',
  padding: '0.4rem 0.7rem',
  borderRadius: '6px',
  border: '1px solid rgba(239,68,68,0.3)',
  cursor: 'pointer',
  fontSize: '0.9rem',
}