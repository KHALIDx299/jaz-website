'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function DashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [company, setCompany] = useState(null)
  const [jobs, setJobs] = useState([])
  const [uploading, setUploading] = useState(false)
  const [uploadMsg, setUploadMsg] = useState('')

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      setUser(user)

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      setProfile(profileData)

      const { data: companyData } = await supabase
        .from('companies')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle()

      setCompany(companyData)

      if (companyData) {
        const { data: jobsData } = await supabase
          .from('jobs')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        setJobs(jobsData || [])
      }

    } catch (err) {
      console.error('Error loading data:', err)
    } finally {
      setLoading(false)
    }
  }

  // 🆕 رفع شعار الشركة
  const handleLogoUpload = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    // التحقق من نوع الملف
    if (!file.type.startsWith('image/')) {
      setUploadMsg('❌ من فضلك اختر صورة فقط')
      return
    }

    // التحقق من الحجم (أقل من 2 ميجا)
    if (file.size > 2 * 1024 * 1024) {
      setUploadMsg('❌ حجم الصورة كبير، اختر صورة أقل من 2 ميجا')
      return
    }

    setUploading(true)
    setUploadMsg('')

    try {
      // اسم الملف: company-id + الامتداد
      const fileExt = file.name.split('.').pop()
      const fileName = `${company.id}-${Date.now()}.${fileExt}`

      // رفع الصورة لـ Storage
      const { error: uploadError } = await supabase.storage
        .from('company-logos')
        .upload(fileName, file, { upsert: true })

      if (uploadError) throw uploadError

      // الحصول على الرابط العام
      const { data: urlData } = supabase.storage
        .from('company-logos')
        .getPublicUrl(fileName)

      const logoUrl = urlData.publicUrl

      // حفظ الرابط في جدول الشركة
      const { error: updateError } = await supabase
        .from('companies')
        .update({ logo_url: logoUrl })
        .eq('id', company.id)

      if (updateError) throw updateError

      // تحديث الواجهة
      setCompany({ ...company, logo_url: logoUrl })
      setUploadMsg('✅ تم رفع الشعار بنجاح!')

    } catch (err) {
      console.error('Upload error:', err)
      setUploadMsg('❌ حدث خطأ: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  if (loading) {
    return (
      <div style={containerStyle}>
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
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

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
              مرحباً، <span style={{ color: '#f5a623' }}>{profile?.full_name || 'مستخدم'}</span>
            </h1>
            <p style={{ color: '#a0aec0', margin: '0.3rem 0 0 0' }}>{user?.email}</p>
          </div>
          <div style={{ display: 'flex', gap: '0.7rem', flexWrap: 'wrap' }}>
            <Link href="/" style={btnSecondary}>الرئيسية</Link>
            <button onClick={handleLogout} style={btnDanger}>تسجيل الخروج</button>
          </div>
        </div>

        <div style={cardStyle}>
          <h2 style={{ color: 'white', marginTop: 0 }}>🏢 شركتي</h2>

          {company ? (
            <div style={{ color: '#e2e8f0', lineHeight: 1.8 }}>

              {/* 🆕 قسم شعار الشركة */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.5rem',
                marginBottom: '1.5rem',
                flexWrap: 'wrap',
                padding: '1.2rem',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.08)'
              }}>
                {/* معاينة الشعار */}
                <div style={{
                  width: '90px',
                  height: '90px',
                  borderRadius: '16px',
                  background: company.logo_url ? 'white' : 'linear-gradient(135deg, #0D3B5E, #1A5C30)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  flexShrink: 0,
                  border: '2px solid rgba(255,255,255,0.1)'
                }}>
                  {company.logo_url ? (
                    <img src={company.logo_url} alt="شعار الشركة" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  ) : (
                    <span style={{ color: 'white', fontSize: '2.5rem', fontWeight: 'bold' }}>
                      {company.name?.charAt(0) || '🏢'}
                    </span>
                  )}
                </div>

                {/* زر الرفع */}
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <h3 style={{ color: 'white', margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>
                    {company.logo_url ? '🖼️ شعار شركتك' : '📤 أضف شعار شركتك'}
                  </h3>
                  <p style={{ color: '#a0aec0', fontSize: '0.85rem', margin: '0 0 0.8rem 0' }}>
                    صورة مربعة بصيغة PNG أو JPG، أقل من 2 ميجا
                  </p>
                  <label style={{
                    ...btnPrimary,
                    display: 'inline-block',
                    cursor: uploading ? 'not-allowed' : 'pointer',
                    opacity: uploading ? 0.6 : 1
                  }}>
                    {uploading ? '⏳ جاري الرفع...' : (company.logo_url ? '🔄 تغيير الشعار' : '📤 رفع شعار')}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      disabled={uploading}
                      style={{ display: 'none' }}
                    />
                  </label>
                  {uploadMsg && (
                    <p style={{
                      margin: '0.7rem 0 0 0',
                      fontSize: '0.85rem',
                      color: uploadMsg.startsWith('✅') ? '#22c55e' : '#fca5a5'
                    }}>
                      {uploadMsg}
                    </p>
                  )}
                </div>
              </div>

              <p><strong>الاسم:</strong> {company.name}</p>
              <p><strong>القطاع:</strong> {company.category || 'غير محدد'}</p>
              <p><strong>الحالة:</strong>{' '}
                {company.status === 'approved' ? (
                  <span style={{ color: '#22c55e' }}>✅ موافق عليها</span>
                ) : company.status === 'pending' ? (
                  <span style={{ color: '#f5a623' }}>⏳ بانتظار موافقة الأدمن</span>
                ) : (
                  <span style={{ color: '#ef4444' }}>❌ مرفوضة</span>
                )}
              </p>
            </div>
          ) : (
            <div>
              <p style={{ color: '#a0aec0', marginBottom: '1rem' }}>
                لم تسجّل شركتك بعد. سجّلها الآن لتتمكن من إضافة وظائف.
              </p>
              <Link href="/add-company" style={btnPrimary}>
                سجّل شركتك الآن
              </Link>
            </div>
          )}
        </div>

        {company && company.status === 'approved' && (
          <div style={cardStyle}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem',
            }}>
              <h2 style={{ color: 'white', margin: 0 }}>💼 وظائفي ({jobs.length})</h2>
              <Link href="/jobs" style={btnPrimary}>+ إضافة وظيفة</Link>
            </div>

            {jobs.length === 0 ? (
              <p style={{ color: '#a0aec0' }}>لم تضف أي وظيفة بعد.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                {jobs.map(job => (
                  <div key={job.id} style={{
                    background: 'rgba(255,255,255,0.03)',
                    padding: '1rem',
                    borderRadius: '10px',
                    border: '1px solid rgba(255,255,255,0.05)',
                  }}>
                    <h3 style={{ color: 'white', margin: '0 0 0.3rem 0' }}>{job.title}</h3>
                    <p style={{ color: '#a0aec0', margin: 0, fontSize: '0.9rem' }}>
                      {job.salary} • {job.job_type} • {job.location}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}

const containerStyle = {
  minHeight: '100vh',
  background: '#0a1929',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

const cardStyle = {
  background: 'rgba(255,255,255,0.05)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '15px',
  padding: '2rem',
  marginBottom: '1.5rem',
}

const btnPrimary = {
  background: 'linear-gradient(135deg, #f5a623, #f39c12)',
  color: 'white',
  padding: '0.6rem 1.2rem',
  borderRadius: '8px',
  textDecoration: 'none',
  fontWeight: 'bold',
  border: 'none',
  cursor: 'pointer',
  display: 'inline-block',
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