'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

export default function Jobs() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    title: '', company_name: '', salary: '',
    job_type: '', location: '', description: ''
  })
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => { fetchJobs() }, [])

  async function fetchJobs() {
    setLoading(true)
    const { data } = await supabase.from('jobs').select('*').order('created_at', { ascending: false })
    setJobs(data || [])
    setLoading(false)
  }

  async function handleSubmit() {
    if (!form.title || !form.company_name) {
      alert('يرجى إدخال المسمى الوظيفي واسم الشركة')
      return
    }
    setSaving(true)
    const { error } = await supabase.from('jobs').insert([form])
    setSaving(false)
    if (error) { alert('حدث خطأ: ' + error.message); return }
    setSuccess(true)
    setShowForm(false)
    setForm({ title: '', company_name: '', salary: '', job_type: '', location: '', description: '' })
    fetchJobs()
    setTimeout(() => setSuccess(false), 3000)
  }

  const typeColors = {
    'دوام كامل': { bg: '#E8F4FD', color: '#0D3B5E' },
    'دوام جزئي': { bg: '#FEF3E2', color: '#C8831A' },
    'عن بُعد': { bg: '#E8F5EE', color: '#1A5C30' },
    'عقد مؤقت': { bg: '#F3E8FD', color: '#6B21A8' },
  }

  return (
    <main dir="rtl" style={{ fontFamily: 'Arial, sans-serif', background: '#F7F8FA', minHeight: '100vh' }}>

      {/* HEADER */}
      <div style={{ background: 'linear-gradient(135deg, #0D3B5E, #1A5C30)', padding: '40px 5%' }}>
        <a href="/" style={{ color: 'rgba(255,255,255,.7)', textDecoration: 'none', fontSize: '14px' }}>← الرئيسية</a>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontSize: 'clamp(24px,5vw,36px)', fontWeight: '800', color: '#fff' }}>بوابة وظائف جازان</h1>
            <p style={{ color: 'rgba(255,255,255,.7)', marginTop: '6px' }}>{jobs.length} وظيفة متاحة</p>
          </div>
          <button onClick={() => setShowForm(!showForm)} style={{ background: '#C8831A', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '10px', fontSize: '15px', fontWeight: '700', cursor: 'pointer' }}>
            {showForm ? '✕ إغلاق' : '+ أضف وظيفة'}
          </button>
        </div>
      </div>

      <div style={{ padding: '32px 5%' }}>

        {/* رسالة النجاح */}
        {success && (
          <div style={{ background: '#E8F5EE', border: '1px solid #2D8C4E', borderRadius: '12px', padding: '16px 20px', marginBottom: '24px', color: '#1A5C30', fontWeight: '700' }}>
            🎉 تم نشر الوظيفة بنجاح!
          </div>
        )}

        {/* فورم إضافة وظيفة */}
        {showForm && (
          <div style={{ background: '#fff', borderRadius: '16px', padding: '28px', boxShadow: '0 4px 20px rgba(0,0,0,.08)', marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#0D3B5E', marginBottom: '20px' }}>نشر وظيفة جديدة</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px' }}>
              {[
                { label: 'المسمى الوظيفي *', key: 'title', placeholder: 'مثال: مهندس برمجيات' },
                { label: 'اسم الشركة *', key: 'company_name', placeholder: 'مثال: شركة جازان للطاقة' },
                { label: 'الراتب', key: 'salary', placeholder: 'مثال: ١٠,٠٠٠ ريال' },
                { label: 'الموقع', key: 'location', placeholder: 'مثال: جازان الاقتصادية' },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ display: 'block', fontWeight: '700', color: '#1A1F2E', marginBottom: '8px', fontSize: '14px' }}>{f.label}</label>
                  <input value={form[f.key]} onChange={e => setForm({...form, [f.key]: e.target.value})}
                    placeholder={f.placeholder}
                    style={{ width: '100%', padding: '12px 14px', border: '1px solid #E2E8F0', borderRadius: '10px', fontSize: '14px', direction: 'rtl', outline: 'none' }}
                  />
                </div>
              ))}
              <div>
                <label style={{ display: 'block', fontWeight: '700', color: '#1A1F2E', marginBottom: '8px', fontSize: '14px' }}>نوع الوظيفة</label>
                <select value={form.job_type} onChange={e => setForm({...form, job_type: e.target.value})}
                  style={{ width: '100%', padding: '12px 14px', border: '1px solid #E2E8F0', borderRadius: '10px', fontSize: '14px', direction: 'rtl', outline: 'none', background: '#fff' }}>
                  <option value="">اختر النوع</option>
                  {['دوام كامل', 'دوام جزئي', 'عن بُعد', 'عقد مؤقت'].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div style={{ marginTop: '16px' }}>
              <label style={{ display: 'block', fontWeight: '700', color: '#1A1F2E', marginBottom: '8px', fontSize: '14px' }}>وصف الوظيفة</label>
              <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                placeholder="اكتب تفاصيل الوظيفة والمتطلبات..."
                rows={3}
                style={{ width: '100%', padding: '12px 14px', border: '1px solid #E2E8F0', borderRadius: '10px', fontSize: '14px', direction: 'rtl', outline: 'none', resize: 'vertical' }}
              />
            </div>
            <button onClick={handleSubmit} disabled={saving}
              style={{ marginTop: '16px', background: saving ? '#999' : '#0D3B5E', color: '#fff', border: 'none', padding: '14px 32px', borderRadius: '10px', fontSize: '16px', fontWeight: '700', cursor: saving ? 'not-allowed' : 'pointer' }}>
              {saving ? 'جاري النشر...' : '📢 انشر الوظيفة'}
            </button>
          </div>
        )}

        {/* قائمة الوظائف */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#5A6475' }}>جاري التحميل...</div>
        ) : jobs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>💼</div>
            <div style={{ fontSize: '18px', fontWeight: '700', color: '#1A1F2E' }}>لا توجد وظائف بعد</div>
            <button onClick={() => setShowForm(true)} style={{ marginTop: '16px', background: '#0D3B5E', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '10px', fontSize: '15px', fontWeight: '700', cursor: 'pointer' }}>
              + أضف أول وظيفة
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
            {jobs.map(job => (
              <div key={job.id} style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '20px 22px', transition: 'all .2s', cursor: 'pointer' }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 24px rgba(13,59,94,.1)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'} onClick={() => window.location.href = `/jobs/${job.id}`}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <div style={{ fontWeight: '700', fontSize: '16px', color: '#1A1F2E' }}>{job.title}</div>
                  {job.job_type && (
                    <span style={{ background: typeColors[job.job_type]?.bg || '#F7F8FA', color: typeColors[job.job_type]?.color || '#5A6475', fontSize: '12px', fontWeight: '700', padding: '4px 10px', borderRadius: '20px', whiteSpace: 'nowrap' }}>
                      {job.job_type}
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '14px', color: '#5A6475', marginBottom: '10px' }}>
                  🏢 {job.company_name} {job.location ? `· 📍 ${job.location}` : ''}
                </div>
                {job.salary && (
                  <div style={{ fontSize: '14px', fontWeight: '700', color: '#C8831A', marginBottom: '10px' }}>💰 {job.salary}</div>
                )}
                {job.description && (
                  <div style={{ fontSize: '13px', color: '#5A6475', lineHeight: '1.7' }}>{job.description}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
