'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function AdminPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [companies, setCompanies] = useState([])
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 })
  const [filter, setFilter] = useState('pending')
  const [actionLoading, setActionLoading] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profileData?.role !== 'admin') {
        router.push('/dashboard')
        return
      }

      setUser(user)
      setProfile(profileData)

      const { data: companiesData } = await supabase
        .from('companies')
        .select('*')
        .order('created_at', { ascending: false })

      setCompanies(companiesData || [])

      const all = companiesData || []
      setStats({
        total: all.length,
        pending: all.filter(c => c.status === 'pending').length,
        approved: all.filter(c => c.status === 'approved').length,
        rejected: all.filter(c => c.status === 'rejected').length,
      })

    } catch (err) {
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (companyId, newStatus) => {
    setActionLoading(companyId)
    
    const { error } = await supabase
      .from('companies')
      .update({ status: newStatus })
      .eq('id', companyId)

    if (!error) {
      await loadData()
    } else {
      alert('حدث خطأ: ' + error.message)
    }
    
    setActionLoading(null)
  }

  const handleDelete = async (companyId, name) => {
    if (!confirm(`هل أنت متأكد من حذف "${name}"؟`)) return
    
    setActionLoading(companyId)
    
    const { error } = await supabase
      .from('companies')
      .delete()
      .eq('id', companyId)

    if (!error) {
      await loadData()
    } else {
      alert('حدث خطأ: ' + error.message)
    }
    
    setActionLoading(null)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const filteredCompanies = filter === 'all' 
    ? companies 
    : companies.filter(c => c.status === filter)

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a1929', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'white' }}>جارٍ التحميل...</p>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a1929 0%, #1a3a52 50%, #2d5f3f 100%)',
      padding: '2rem',
      fontFamily: 'system-ui, sans-serif',
    }}>
      <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
        
        {/* الشريط العلوي */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <div>
            <h1 style={{ color: 'white', fontSize: '2rem', margin: 0 }}>
              👑 لوحة الأدمن
            </h1>
            <p style={{ color: '#a0aec0', margin: '0.3rem 0 0 0' }}>{profile?.full_name} • {user?.email}</p>
          </div>
          <div style={{ display: 'flex', gap: '0.7rem', flexWrap: 'wrap' }}>
            <Link href="/" style={btnSecondary}>الرئيسية</Link>
            <Link href="/dashboard" style={btnSecondary}>حسابي</Link>
            <button onClick={handleLogout} style={btnDanger}>خروج</button>
          </div>
        </div>

        {/* الإحصائيات */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem',
        }}>
          <StatCard label="الإجمالي" value={stats.total} color="#3b82f6" />
          <StatCard label="بانتظار الموافقة" value={stats.pending} color="#f5a623" />
          <StatCard label="موافق عليها" value={stats.approved} color="#22c55e" />
          <StatCard label="مرفوضة" value={stats.rejected} color="#ef4444" />
        </div>

        {/* الفلاتر */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <FilterBtn active={filter === 'pending'} onClick={() => setFilter('pending')}>
            ⏳ بانتظار الموافقة ({stats.pending})
          </FilterBtn>
          <FilterBtn active={filter === 'approved'} onClick={() => setFilter('approved')}>
            ✅ موافق عليها ({stats.approved})
          </FilterBtn>
          <FilterBtn active={filter === 'rejected'} onClick={() => setFilter('rejected')}>
            ❌ مرفوضة ({stats.rejected})
          </FilterBtn>
          <FilterBtn active={filter === 'all'} onClick={() => setFilter('all')}>
            📋 الكل ({stats.total})
          </FilterBtn>
        </div>

        {/* قائمة الشركات */}
        <div style={cardStyle}>
          <h2 style={{ color: 'white', marginTop: 0 }}>الشركات</h2>
          
          {filteredCompanies.length === 0 ? (
            <p style={{ color: '#a0aec0' }}>لا توجد شركات في هذا التصنيف.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {filteredCompanies.map(company => (
                <div key={company.id} style={{
                  background: 'rgba(255,255,255,0.03)',
                  padding: '1.5rem',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.05)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ flex: 1, minWidth: '200px' }}>
                      <h3 style={{ color: 'white', margin: '0 0 0.5rem 0', fontSize: '1.2rem' }}>
                        {company.name}
                      </h3>
                      <div style={{ color: '#a0aec0', fontSize: '0.9rem', lineHeight: 1.7 }}>
                        <div>📂 {company.category || 'غير محدد'}</div>
                        {company.location && <div>📍 {company.location}</div>}
                        {company.phone && <div>📞 {company.phone}</div>}
                        {company.email && <div>📧 {company.email}</div>}
                        {company.description && (
                          <div style={{ marginTop: '0.5rem', color: '#cbd5e0' }}>
                            {company.description}
                          </div>
                        )}
                      </div>
                      <div style={{ marginTop: '0.7rem' }}>
                        {company.status === 'pending' && <StatusBadge color="#f5a623">⏳ بانتظار</StatusBadge>}
                        {company.status === 'approved' && <StatusBadge color="#22c55e">✅ موافق</StatusBadge>}
                        {company.status === 'rejected' && <StatusBadge color="#ef4444">❌ مرفوضة</StatusBadge>}
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {company.status !== 'approved' && (
                        <button
                          onClick={() => handleStatusChange(company.id, 'approved')}
                          disabled={actionLoading === company.id}
                          style={btnApprove}
                        >
                          ✅ موافقة
                        </button>
                      )}
                      {company.status !== 'rejected' && (
                        <button
                          onClick={() => handleStatusChange(company.id, 'rejected')}
                          disabled={actionLoading === company.id}
                          style={btnReject}
                        >
                          ❌ رفض
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(company.id, company.name)}
                        disabled={actionLoading === company.id}
                        style={btnDelete}
                      >
                        🗑️ حذف
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

function StatCard({ label, value, color }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.05)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '15px',
      padding: '1.5rem',
      textAlign: 'center',
    }}>
      <div style={{ color, fontSize: '2.5rem', fontWeight: 'bold' }}>{value}</div>
      <div style={{ color: '#a0aec0', marginTop: '0.3rem' }}>{label}</div>
    </div>
  )
}

function FilterBtn({ active, onClick, children }) {
  return (
    <button onClick={onClick} style={{
      padding: '0.6rem 1.2rem',
      background: active ? 'linear-gradient(135deg, #f5a623, #f39c12)' : 'rgba(255,255,255,0.05)',
      color: 'white',
      border: active ? 'none' : '1px solid rgba(255,255,255,0.1)',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: active ? 'bold' : 'normal',
      fontSize: '0.95rem',
    }}>
      {children}
    </button>
  )
}

function StatusBadge({ color, children }) {
  return (
    <span style={{
      display: 'inline-block',
      padding: '0.3rem 0.8rem',
      background: `${color}22`,
      color,
      border: `1px solid ${color}44`,
      borderRadius: '20px',
      fontSize: '0.85rem',
      fontWeight: 'bold',
    }}>
      {children}
    </span>
  )
}

const cardStyle = {
  background: 'rgba(255,255,255,0.05)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '15px',
  padding: '2rem',
}

const btnSecondary = {
  background: 'rgba(255,255,255,0.1)',
  color: 'white',
  padding: '0.6rem 1.2rem',
  borderRadius: '8px',
  textDecoration: 'none',
  border: '1px solid rgba(255,255,255,0.2)',
  cursor: 'pointer',
  display: 'inline-block',
}

const btnDanger = {
  background: 'rgba(239,68,68,0.2)',
  color: '#fca5a5',
  padding: '0.6rem 1.2rem',
  borderRadius: '8px',
  border: '1px solid rgba(239,68,68,0.3)',
  cursor: 'pointer',
  fontWeight: 'bold',
}

const btnApprove = {
  background: 'linear-gradient(135deg, #22c55e, #16a34a)',
  color: 'white',
  padding: '0.5rem 1rem',
  borderRadius: '8px',
  border: 'none',
  cursor: 'pointer',
  fontWeight: 'bold',
  fontSize: '0.9rem',
}

const btnReject = {
  background: 'rgba(239,68,68,0.2)',
  color: '#fca5a5',
  padding: '0.5rem 1rem',
  borderRadius: '8px',
  border: '1px solid rgba(239,68,68,0.3)',
  cursor: 'pointer',
  fontSize: '0.9rem',
}

const btnDelete = {
  background: 'rgba(100,100,100,0.2)',
  color: '#cbd5e0',
  padding: '0.5rem 1rem',
  borderRadius: '8px',
  border: '1px solid rgba(255,255,255,0.1)',
  cursor: 'pointer',
  fontSize: '0.85rem',
}