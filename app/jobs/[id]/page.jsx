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
    setTimeout(() => setSuccess(false), 3000)
    setSaving(false)
    setShowForm(false)
  }

  const inputStyle = { width: '100%', padding: '12px 16px', border: '1px solid #E2E8F0', borderRadius: '10px', fontSize: '14px', fontFamily: 'Arial', boxSizing: 'border-box', marginBottom: '16px' }
  const labelStyle = { display: 'block', fontWeight: '700', color: '#1A1F2E', marginBottom: '8px', fontSize: '14px' }

  return (
    <main dir="rtl" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0D3B2E 0%, #1a5c45 100%)', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ background: 'rgba(0,0,0,0.3)', padding: '40px 20px', textAlign: 'right' }}>
        <a href="/" style={{ color: '#F5A623', fontSize: '14px', textDecoration: 'none' }}>← الرئيسية</a>
        <h1 style={{ color: 'white', fontSize: '2.5rem', fontWeight: '800', margin: '10px 0 5px' }}>بوابة وظائف جازان</h1>
        <p style={{ color: 'rgba(255,255,255,0.7)' }}>{jobs.length} وظيفة متاحة</p>
        <button onClick={() => setShowForm(!showForm)} style={{ background: '#F5A623', color: 'black', border: 'none', padding: '12px 24px', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', marginTop: '10px' }}>
          {showForm ? '✕ إغلاق' : '+ أضف وظيفة'}
        </button>
      </div>

      {showForm && (
        <div style={{ maxWidth: '600px', margin: '20px auto', background: 'white', borderRadius: '16px', padding: '30px' }}>
          <h2 style={{ marginBottom: '20px', color: '#1A1F2E' }}>إضافة وظيفة جديدة</h2>

          <label style={labelStyle}>المسمى الوظيفي *</label>
          <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="مثال: مهندس برمجيات" style={inputStyle} />

          <label style={labelStyle}>اسم الشركة *</label>
          <input value={form.company_name} onChange={e => setForm({...form, company_name: e.target.value})} placeholder="اسم الشركة" style={inputStyle} />

          <label style={labelStyle}>الراتب</label>
          <input value={form.salary} onChange={e => setForm({...form, salary: e.target.value})} placeholder="مثال: 5000 ريال" style={inputStyle} />

          <label style={labelStyle}>نوع الدوام</label>
          <select value={form.job_type} onChange={e => setForm({...form, job_type: e.target.value})} style={inputStyle}>
            <option value="">اختر نوع الدوام</option>
            <option value="دوام كامل">دوام كامل</option>
            <option value="دوام جزئي">دوام جزئي</option>
            <option value="عن بعد">عن بعد</option>
            <option value="عقد">عقد</option>
          </select>

          <label style={labelStyle}>الموقع</label>
          <input value={form.location} onChange={e => setForm({...form, location: e.target.value})} placeholder="مثال: جازان" style={inputStyle} />

          <label style={labelStyle}>وصف الوظيفة</label>
          <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="اكتب وصفاً للوظيفة..." rows={3} style={{...inputStyle}} />

          <label style={labelStyle}>الشروط والمتطلبات</label>
          <textarea value={form.requirements} onChange={e => setForm({...form, requirements: e.target.value})} placeholder="اكتب الشروط والمتطلبات..." rows={3} style={{...inputStyle}} />

          <label style={labelStyle}>رقم التواصل</label>
          <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="05xxxxxxxx" style={inputStyle} />

          <label style={labelStyle}>إيميل التواصل</label>
          <input value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="example@email.com" style={inputStyle} />

          <label style={labelStyle}>تفاصيل عن الشركة</label>
          <textarea value={form.company_details} onChange={e => setForm({...form, company_details: e.target.value})} placeholder="اكتب تفاصيل عن الشركة..." rows={3} style={{...inputStyle}} />

          {success && <p style={{ color: 'green', textAlign: 'center' }}>✅ تمت الإضافة بنجاح!</p>}

          <button onClick={handleSubmit} disabled={saving} style={{ width: '100%', background: '#0D3B2E', color: 'white', border: 'none', padding: '14px', borderRadius: '10px', fontWeight: '700', fontSize: '16px', cursor: 'pointer' }}>
            {saving ? 'جاري الحفظ...' : '💾 حفظ الوظيفة'}
          </button>
        </div>
      )}

      <div style={{ maxWidth: '1200px', margin: '20px auto', padding: '0 20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
        {jobs.map(job => (
          <div key={job.id} style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '20px 22px', transition: 'all .2s', cursor: 'pointer' }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 24px rgba(13,59,46,.1)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
            onClick={() => window.location.href = `/jobs/${job.id}`}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1A1F2E' }}>{job.title}</h3>
              {job.job_type && <span style={{ background: '#F0FDF4', color: '#16A34A', fontSize: '12px', padding: '4px 10px', borderRadius: '20px', fontWeight: '600' }}>{job.job_type}</span>}
            </div>
            <p style={{ color: '#5A6475', fontSize: '14px', marginBottom: '8px' }}>🏢 {job.company_name} {job.location && `· 📍 ${job.location}`}</p>
            {job.salary && <div style={{ fontSize: '14px', fontWeight: '700', color: '#C8831A' }}>💰 {job.salary}</div>}
            {job.description && <p style={{ fontSize: '13px', color: '#5A6475', lineHeight: '1.7', marginTop: '8px' }}>{job.description}</p>}
          </div>
        ))}
      </div>
    </main>
  )
}