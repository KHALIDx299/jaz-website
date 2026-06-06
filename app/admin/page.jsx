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
  const [uploadingId, setUploadingId] = useState(null)
  const [editingCompany, setEditingCompany] = useState(null)
  const [editFormData, setEditFormData] = useState({})
  const [savingEdit, setSavingEdit] = useState(false)

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
    const { error } = await supabase.from('companies').update({ status: newStatus }).eq('id', companyId)
    if (!error) await loadData()
    else alert('حدث خطأ: ' + error.message)
    setActionLoading(null)
  }

  const handleDelete = async (companyId, name) => {
    if (!confirm(`هل أنت متأكد من حذف "${name}"؟`)) return
    setActionLoading(companyId)
    const { error } = await supabase.from('companies').delete().eq('id', companyId)
    if (!error) await loadData()
    else alert('حدث خطأ: ' + error.message)
    setActionLoading(null)
  }

  const handleLogoUpload = async (event, companyId, companyName) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) { alert('❌ صورة فقط'); return }
    if (file.size > 2 * 1024 * 1024) { alert('❌ أقل من 2 ميجا'); return }

    setUploadingId(companyId)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${companyId}-${Date.now()}.${fileExt}`
      const { error: uploadError } = await supabase.storage.from('company-logos').upload(fileName, file, { upsert: true })
      if (uploadError) throw uploadError
      const { data: urlData } = supabase.storage.from('company-logos').getPublicUrl(fileName)
      const { error: updateError } = await supabase.from('companies').update({ logo_url: urlData.publicUrl }).eq('id', companyId)
      if (updateError) throw updateError
      await loadData()
      alert(`✅ تم رفع شعار "${companyName}"`)
    } catch (err) {
      alert('❌ ' + err.message)
    } finally {
      setUploadingId(null)
    }
  }

  const handleRemoveLogo = async (companyId, companyName) => {
    if (!confirm(`حذف شعار "${companyName}"؟`)) return
    setUploadingId(companyId)
    const { error } = await supabase.from('companies').update({ logo_url: null }).eq('id', companyId)
    if (!error) { await loadData(); alert('✅ تم') } else alert('❌ ' + error.message)
    setUploadingId(null)
  }

  const startEdit = (company) => {
    setEditingCompany(company.id)
    setEditFormData({
      name: company.name || '',
      category: company.category || '',
      description: company.description || '',
      phone: company.phone || '',
      email: company.email || '',
      website: company.website || '',
      location: company.location || '',
      apply_url: company.apply_url || '',
    })
  }

  const cancelEdit = () => {
    setEditingCompany(null)
    setEditFormData({})
  }

  const saveEdit = async () => {
    setSavingEdit(true)
    const { error } = await supabase.from('companies').update(editFormData).eq('id', editingCompany)
    if (!error) {
      await loadData()
      cancelEdit()
      alert('✅ تم حفظ التعديلات')
    } else {
      alert('❌ ' + error.message)
    }
    setSavingEdit(false)
  }

  const handleEditChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value })
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const filteredCompanies = filter === 'all' ? companies : companies.filter(c => c.status === filter)
  const categories = ['الطاقة', 'تقنية المعلومات', 'الزراعة', 'السياحة', 'الملاحة', 'الإنشاء', 'الجمعيات']

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a1929', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'white' }}>جارٍ التحميل...</p>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0a1929 0%, #1a3a52 50%, #2d5f3f 100%)', padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ maxWidth: '1300px', margin: '0 auto' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ color: 'white', fontSize: '2rem', margin: 0 }}>👑 لوحة الأدمن</h1>
            <p style={{ color: '#a0aec0', margin: '0.3rem 0 0 0' }}>{profile?.full_name} • {user?.email}</p>
          </div>
          <div style={{ display: 'flex', gap: '0.7rem', flexWrap: 'wrap' }}>
            <Link href="/admin/seekers" style={{ ...btnSecondary, background: 'linear-gradient(135deg, #22c55e, #16a34a)', border: 'none', fontWeight: 'bold' }}>👤 الباحثون عن عمل</Link>
            <Link href="/" style={btnSecondary}>الرئيسية</Link>
            <Link href="/dashboard" style={btnSecondary}>حسابي</Link>
            <button onClick={handleLogout} style={btnDanger}>خروج</button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <StatCard label="الإجمالي" value={stats.total} color="#3b82f6" />
          <StatCard label="بانتظار الموافقة" value={stats.pending} color="#f5a623" />
          <StatCard label="موافق عليها" value={stats.approved} color="#22c55e" />
          <StatCard label="مرفوضة" value={stats.rejected} color="#ef4444" />
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <FilterBtn active={filter === 'pending'} onClick={() => setFilter('pending')}>⏳ بانتظار ({stats.pending})</FilterBtn>
          <FilterBtn active={filter === 'approved'} onClick={() => setFilter('approved')}>✅ موافق ({stats.approved})</FilterBtn>
          <FilterBtn active={filter === 'rejected'} onClick={() => setFilter('rejected')}>❌ مرفوضة ({stats.rejected})</FilterBtn>
          <FilterBtn active={filter === 'all'} onClick={() => setFilter('all')}>📋 الكل ({stats.total})</FilterBtn>
        </div>

        <div style={cardStyle}>
          <h2 style={{ color: 'white', marginTop: 0 }}>الشركات</h2>

          {filteredCompanies.length === 0 ? (
            <p style={{ color: '#a0aec0' }}>لا توجد شركات.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {filteredCompanies.map(company => (
                <div key={company.id} style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>

                  {editingCompany === company.id ? (
                    <div>
                      <h3 style={{ color: '#F5A623', marginTop: 0, marginBottom: '1rem' }}>✏️ تعديل: {company.name}</h3>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                        <div>
                          <label style={editLabelStyle}>اسم الشركة</label>
                          <input name="name" value={editFormData.name} onChange={handleEditChange} style={editInputStyle} />
                        </div>

                        <div>
                          <label style={editLabelStyle}>القطاع</label>
                          <select name="category" value={editFormData.category} onChange={handleEditChange} style={editInputStyle}>
                            <option value="">-- اختر --</option>
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </div>

                        <div>
                          <label style={editLabelStyle}>الهاتف</label>
                          <input name="phone" value={editFormData.phone} onChange={handleEditChange} style={editInputStyle} />
                        </div>

                        <div>
                          <label style={editLabelStyle}>الإيميل</label>
                          <input name="email" value={editFormData.email} onChange={handleEditChange} style={editInputStyle} />
                        </div>

                        <div>
                          <label style={editLabelStyle}>الموقع الإلكتروني</label>
                          <input name="website" value={editFormData.website} onChange={handleEditChange} style={editInputStyle} />
                        </div>

                        <div>
                          <label style={editLabelStyle}>الموقع الجغرافي</label>
                          <input name="location" value={editFormData.location} onChange={handleEditChange} style={editInputStyle} />
                        </div>

                        <div style={{ gridColumn: '1 / -1' }}>
                          <label style={editLabelStyle}>رابط التقديم (اختياري)</label>
                          <input name="apply_url" value={editFormData.apply_url} onChange={handleEditChange} style={editInputStyle} />
                        </div>

                        <div style={{ gridColumn: '1 / -1' }}>
                          <label style={editLabelStyle}>الوصف</label>
                          <textarea name="description" value={editFormData.description} onChange={handleEditChange} rows="4" style={{ ...editInputStyle, resize: 'vertical' }} />
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                        <button onClick={saveEdit} disabled={savingEdit} style={btnApprove}>
                          {savingEdit ? '⏳ جاري الحفظ...' : '✅ حفظ التعديلات'}
                        </button>
                        <button onClick={cancelEdit} disabled={savingEdit} style={btnDelete}>
                          ❌ إلغاء
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>

                      <div style={{ flex: 1, minWidth: '200px', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>

                        <div style={{ width: '72px', height: '72px', borderRadius: '12px', background: company.logo_url ? '#fff' : 'linear-gradient(135deg, #0D3B5E, #1A5C30)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0, border: '2px solid rgba(255,255,255,0.1)' }}>
                          {company.logo_url ? (
                            <img src={company.logo_url} alt={company.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                          ) : (
                            <span style={{ color: 'white', fontSize: '1.8rem', fontWeight: 'bold' }}>{company.name?.charAt(0) || '🏢'}</span>
                          )}
                        </div>

                        <div style={{ flex: 1 }}>
                          <h3 style={{ color: 'white', margin: '0 0 0.5rem 0', fontSize: '1.2rem' }}>{company.name}</h3>
                          <div style={{ color: '#a0aec0', fontSize: '0.9rem', lineHeight: 1.7 }}>
                            <div>📂 {company.category || 'غير محدد'}</div>
                            {company.location && <div>📍 {company.location}</div>}
                            {company.phone && <div>📞 {company.phone}</div>}
                            {company.email && <div>📧 {company.email}</div>}
                            {company.website && <div>🌐 {company.website}</div>}
                          </div>
                          <div style={{ marginTop: '0.7rem' }}>
                            {company.status === 'pending' && <StatusBadge color="#f5a623">⏳ بانتظار</StatusBadge>}
                            {company.status === 'approved' && <StatusBadge color="#22c55e">✅ موافق</StatusBadge>}
                            {company.status === 'rejected' && <StatusBadge color="#ef4444">❌ مرفوضة</StatusBadge>}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>

                        <button onClick={() => startEdit(company)} style={btnEdit}>
                          ✏️ تعديل البيانات
                        </button>

                        <label style={{ ...btnLogo, opacity: uploadingId === company.id ? 0.6 : 1, cursor: uploadingId === company.id ? 'not-allowed' : 'pointer' }}>
                          {uploadingId === company.id ? '⏳ جاري الرفع...' : (company.logo_url ? '🔄 تغيير الشعار' : '🖼️ رفع شعار')}
                          <input type="file" accept="image/*" onChange={(e) => handleLogoUpload(e, company.id, company.name)} disabled={uploadingId === company.id} style={{ display: 'none' }} />
                        </label>

                        {company.logo_url && (
                          <button onClick={() => handleRemoveLogo(company.id, company.name)} disabled={uploadingId === company.id} style={btnRemoveLogo}>
                            🗑️ حذف الشعار
                          </button>
                        )}

                        {company.status !== 'approved' && (
                          <button onClick={() => handleStatusChange(company.id, 'approved')} disabled={actionLoading === company.id} style={btnApprove}>
                            ✅ موافقة
                          </button>
                        )}
                        {company.status !== 'rejected' && (
                          <button onClick={() => handleStatusChange(company.id, 'rejected')} disabled={actionLoading === company.id} style={btnReject}>
                            ❌ رفض
                          </button>
                        )}
                        <button onClick={() => handleDelete(company.id, company.name)} disabled={actionLoading === company.id} style={btnDelete}>
                          🗑️ حذف
                        </button>
                      </div>
                    </div>
                  )}

                  {company.description && editingCompany !== company.id && (
                    <div style={{ marginTop: '1rem', color: '#cbd5e0', fontSize: '0.9rem', lineHeight: 1.6, borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem' }}>
                      {company.description}
                    </div>
                  )}
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
    <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '15px', padding: '1.5rem', textAlign: 'center' }}>
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
    }}>{children}</button>
  )
}

function StatusBadge({ color, children }) {
  return (
    <span style={{ display: 'inline-block', padding: '0.3rem 0.8rem', background: `${color}22`, color, border: `1px solid ${color}44`, borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold' }}>{children}</span>
  )
}

const cardStyle = { background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '15px', padding: '2rem' }
const btnSecondary = { background: 'rgba(255,255,255,0.1)', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '8px', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer', display: 'inline-block' }
const btnDanger = { background: 'rgba(239,68,68,0.2)', color: '#fca5a5', padding: '0.6rem 1.2rem', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.3)', cursor: 'pointer', fontWeight: 'bold' }
const btnApprove = { background: 'linear-gradient(135deg, #22c55e, #16a34a)', color: 'white', padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem' }
const btnReject = { background: 'rgba(239,68,68,0.2)', color: '#fca5a5', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.3)', cursor: 'pointer', fontSize: '0.9rem' }
const btnDelete = { background: 'rgba(100,100,100,0.2)', color: '#cbd5e0', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', fontSize: '0.85rem' }
const btnLogo = { background: 'linear-gradient(135deg, #C8831A, #F5A623)', color: 'white', padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', fontWeight: 'bold', fontSize: '0.9rem', textAlign: 'center', display: 'inline-block' }
const btnRemoveLogo = { background: 'rgba(239,68,68,0.15)', color: '#fca5a5', padding: '0.4rem 0.8rem', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.3)', cursor: 'pointer', fontSize: '0.8rem' }
const btnEdit = { background: 'linear-gradient(135deg, #3b82f6, #2563eb)', color: 'white', padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem' }
const editLabelStyle = { display: 'block', color: '#a0aec0', fontSize: '0.85rem', marginBottom: '0.3rem' }
const editInputStyle = { width: '100%', padding: '0.6rem 0.8rem', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '0.9rem', outline: 'none', fontFamily: 'system-ui, sans-serif', direction: 'rtl' }