'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

export default function Jobs() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    title: '', company_name: '', salary: '',
    job_type: '', location: '', description: '',
    requirements: '', email: '', phone: '', company_details: ''
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
    if (!form.title || !form.company_name) return
    setSaving(true)
    await supabase.from('jobs').insert([form])
    setForm({ title: '', company_name: '', salary: '', job_type: '', location: '', description: '', requirements: '', email: '', phone: '', company_details: '' })
    setSuccess(true)
    fetchJobs()
    setTimeout(() => { setSuccess(false); setShowForm(false) }, 2000)
    setSaving(false)
  }

  const inputStyle = { width: '100%', padding: '12px 16px', border: '1px solid #E2E8F0', borderRadius: '10px', fontSize: '14px', fontFamily: 'Arial', boxSizing: 'border-box' }
  const labelStyle = { display: 'block', fontWeight: '700', color: '#1A1F2E', marginBottom: '8px', fontSize: '14px' }

  return (
    <main dir="rtl" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0D3B2E 0%, #1a5c45 100%)' }}>
      <div style={{ padding: '40px 20px', textAlign: 'center', color: 'white' }}>
        <a href="/" style={{ color: '#F5A623', fontSize: '14px', textDecoration: 'none' }}>← الرئيسية</a>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', margin: '16px 0 8px' }}>بوابة وظائف جازان</h1>
        <p style={{ opacity: 0.8 }}>{jobs.length} وظيفة متاحة</p>
        <button onClick={() => setShowForm(!showForm)} style={{ marginTop: '16px', background: '#F5A623', color: 'white', border: 'none', padding: '12px 28px', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', fontSize: '15px' }}>
          {showForm ? '✕ إغلاق' : '+ أضف وظيفة'}
        </button>
      </div>

      {showForm && (
        <div style={{ maxWidth: '600px', margin: '0 auto 40px', background: 'white', borderRadius: '16px', padding: '32px' }}>
          <h2 style={{ color: '#1A1F2E', marginBottom: '24px' }}>إضافة وظيفة جديدة</h2>

          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>المسمى الوظيفي *</label>
            <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="مثال: مهندس برمجيات" style={inputStyle} />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>اسم الشركة *</label>
            <input value={form.company_name} onChange={e => setForm({...form, company_name: e.target.value})} placeholder="اسم الشركة" style={inputStyle} />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>الراتب</label>
            <input value={form.salary} onChange={e => setForm({...form, salary: e.target.value})} placeholder="مثال: 5000 ريال" style={inputStyle} />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>نوع الدوام</label>
            <select value={form.job_type} onChange={e => setForm({...form, job_type: e.target.value})} style={inputStyle}>
              <option value="">اختر نوع الدوام</option>
              {['دوام كامل', 'دوام جزئي', 'عن بُعد', 'عقد مؤقت'].map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>الموقع</label>
            <input value={form.location} onChange={e => setForm({...form, location: e.target.value})} placeholder="مثال: جازان" style={inputStyle} />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>وصف الوظيفة</label>
            <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="اكتب وصفاً للوظيفة..." rows={3} style={inputStyle} />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>الشروط والمتطلبات</label>
            <textarea value={form.requirements} onChange={e => setForm({...form, requirements: e.target.value})} placeholder="اكتب الشروط والمتطلبات..." rows={3} style={inputStyle} />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>تفاصيل عن الشركة</label>
            <textarea value={form.company_details} onChange={e => setForm({...form, company_details: e.target.value})} placeholder="اكتب تفاصيل عن الشركة..." rows={3} style={inputStyle} />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>رقم التواصل</label>
            <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="05xxxxxxxx" style={inputStyle} />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={labelStyle}>إيميل التواصل</label>
            <input value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="example@email.com" style={inputStyle} />
          </div>

          {success && <div style={{ background: '#d4edda', color: '#155724', padding: '12px', borderRadius: '8px', marginBottom: '16px', textAlign: 'center' }}>✅ تمت إضافة الوظيفة بنجاح!</div>}

          <button onClick={handleSubmit} disabled={saving} style={{ width: '100%', background: '#0D3B2E', color: 'white', border: 'none', padding: '14px', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', fontSize: '16px' }}>
            {saving ? 'جاري الحفظ...' : 'نشر الوظيفة'}
          </button>
        </div>
      )}

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px 40px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
        {loading ? (
          <p style={{ color: 'white', textAlign: 'center' }}>جاري التحميل...</p>
        ) : (
          jobs.map(job => (
            <div key={job.id} style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '20px 22px', transition: 'all .2s', cursor: 'pointer' }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 24px rgba(13,59,46,.1)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
              onClick={() => window.location.href = `/jobs/${job.id}`}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1A1F2E' }}>{job.title}</h3>
                {job.job_type && <span style={{ background: '#E8F5E9', color: '#2E7D32', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', whiteSpace: 'nowrap' }}>{job.job_type}</span>}
              </div>
              <p style={{ color: '#5A6475', fontSize: '14px', marginBottom: '8px' }}>🏢 {job.company_name} · 📍 {job.location || 'جازان'}</p>
              {job.salary && <div style={{ fontSize: '14px', fontWeight: '700', color: '#C8831A', marginBottom: '10px' }}>💰 {job.salary}</div>}
              {job.description && <div style={{ fontSize: '13px', color: '#5A6475', lineHeight: '1.7' }}>{job.description}</div>}
            </div>
          ))
        )}
      </div>
    </main>
  )
}