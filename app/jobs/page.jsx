'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function Jobs() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    title: '', company_name: '', salary: '',
    job_type: '', location: '', description: '',
    requirements: '', email: '', phone: '',
    company_details: '', apply_url: ''
  })
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => { fetchJobs() }, [])

  async function fetchJobs() {
    const { data } = await supabase
      .from('jobs')
      .select('*')
      .order('created_at', { ascending: false })
    setJobs(data || [])
    setLoading(false)
  }

  async function handleSubmit() {
    if (!form.title || !form.company_name) {
      alert('من فضلك أدخل العنوان والشركة')
      return
    }
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    const { error } = await supabase.from('jobs').insert([{
      ...form,
      user_id: user?.id || null
    }])
    setSaving(false)
    if (error) {
      alert('حدث خطأ: ' + error.message)
    } else {
      setSuccess(true)
      setForm({ title:'', company_name:'', salary:'', job_type:'',
        location:'', description:'', requirements:'', email:'',
        phone:'', company_details:'', apply_url:'' })
      fetchJobs()
      setTimeout(() => { setSuccess(false); setShowForm(false) }, 2000)
    }
  }

  const inputStyle = {
    width:'100%', padding:'12px 14px', border:'1px solid #E2E8F0',
    borderRadius:'10px', fontSize:'14px', marginBottom:'12px',
    fontFamily:'Arial,sans-serif', direction:'rtl'
  }

  return (
    <main dir="rtl" style={{minHeight:'100vh', background:'#F7F8FA', padding:'40px 20px', fontFamily:'Arial,sans-serif'}}>
      <div style={{maxWidth:'1100px', margin:'0 auto'}}>

        <a href="/" style={{color:'#0D3B5E', fontSize:'14px', textDecoration:'none', display:'inline-block', marginBottom:'20px'}}>← الرجوع للرئيسية</a>

        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'24px', flexWrap:'wrap', gap:'12px'}}>
          <h1 style={{fontSize:'1.8rem', fontWeight:'800', color:'#0D3B5E', margin:0}}>💼 الوظائف المتاحة ({jobs.length})</h1>
          <button onClick={()=>setShowForm(!showForm)} style={{background:'#C8831A', color:'#fff', border:'none', padding:'12px 24px', borderRadius:'10px', fontSize:'14px', fontWeight:'700', cursor:'pointer', fontFamily:'Arial,sans-serif'}}>
            {showForm ? '✕ إغلاق' : '+ أضف وظيفة'}
          </button>
        </div>

        {showForm && (
          <div style={{background:'#fff', borderRadius:'16px', padding:'28px', marginBottom:'24px', boxShadow:'0 4px 12px rgba(0,0,0,0.08)'}}>
            <h2 style={{fontSize:'1.3rem', fontWeight:'700', color:'#0D3B5E', marginBottom:'20px'}}>📝 إضافة وظيفة جديدة</h2>

            <input placeholder="* مسمى الوظيفة" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} style={inputStyle} />
            <input placeholder="* اسم الشركة" value={form.company_name} onChange={e=>setForm({...form, company_name:e.target.value})} style={inputStyle} />
            <input placeholder="الراتب (مثلاً: 5000 ريال)" value={form.salary} onChange={e=>setForm({...form, salary:e.target.value})} style={inputStyle} />
            <input placeholder="نوع الدوام (مثلاً: دوام كامل)" value={form.job_type} onChange={e=>setForm({...form, job_type:e.target.value})} style={inputStyle} />
            <input placeholder="موقع الوظيفة" value={form.location} onChange={e=>setForm({...form, location:e.target.value})} style={inputStyle} />
            <textarea placeholder="وصف الوظيفة" value={form.description} onChange={e=>setForm({...form, description:e.target.value})} style={{...inputStyle, minHeight:'80px'}} />
            <textarea placeholder="الشروط والمتطلبات" value={form.requirements} onChange={e=>setForm({...form, requirements:e.target.value})} style={{...inputStyle, minHeight:'80px'}} />
            <input placeholder="البريد الإلكتروني للتواصل" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} style={inputStyle} />
            <input placeholder="رقم الجوال" value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})} style={inputStyle} />
            <textarea placeholder="عن الشركة (اختياري)" value={form.company_details} onChange={e=>setForm({...form, company_details:e.target.value})} style={{...inputStyle, minHeight:'60px'}} />

            <div style={{background:'#FFF8E7', border:'1px solid #F5D08F', borderRadius:'10px', padding:'14px', marginBottom:'12px'}}>
              <div style={{fontSize:'13px', color:'#0D3B5E', fontWeight:'700', marginBottom:'8px'}}>
                🔗 رابط التقديم على المنصة (اختياري)
              </div>
              <input
                placeholder="https://example.com/apply"
                value={form.apply_url}
                onChange={e=>setForm({...form, apply_url:e.target.value})}
                style={{...inputStyle, marginBottom:0, direction:'ltr', textAlign:'left'}}
                type="url"
              />
              <div style={{fontSize:'12px', color:'#888', marginTop:'6px'}}>
                💡 لو الوظيفة منشورة في منصة ثانية (جدارات، صبّار، إلخ)، حط الرابط هنا
              </div>
            </div>

            <button onClick={handleSubmit} disabled={saving} style={{width:'100%', padding:'14px', background:saving?'#999':'#0D3B5E', color:'#fff', border:'none', borderRadius:'10px', fontSize:'15px', fontWeight:'700', cursor:saving?'not-allowed':'pointer', fontFamily:'Arial,sans-serif'}}>
              {saving ? 'جاري الحفظ...' : success ? '✅ تم بنجاح' : '💾 حفظ الوظيفة'}
            </button>
          </div>
        )}

        {loading ? (
          <p style={{textAlign:'center', color:'#888'}}>جاري التحميل...</p>
        ) : jobs.length === 0 ? (
          <p style={{textAlign:'center', color:'#888', padding:'40px'}}>لا توجد وظائف حالياً</p>
        ) : (
          <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))', gap:'16px'}}>
            {jobs.map(job => (
              <a key={job.id} href={`/jobs/${job.id}`} style={{background:'#fff', borderRadius:'14px', padding:'20px', textDecoration:'none', boxShadow:'0 4px 12px rgba(0,0,0,0.06)', border:'1px solid #E2E8F0', transition:'all .2s', display:'block'}}
                onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow='0 8px 20px rgba(0,0,0,0.1)' }}
                onMouseLeave={e=>{ e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 4px 12px rgba(0,0,0,0.06)' }}
              >
                {job.job_type && (
                  <span style={{background:'#E8F5E9', color:'#2E7D32', padding:'4px 10px', borderRadius:'12px', fontSize:'11px', fontWeight:'600', display:'inline-block', marginBottom:'10px'}}>
                    {job.job_type}
                  </span>
                )}
                <h3 style={{fontSize:'1.1rem', fontWeight:'700', color:'#1A1F2E', margin:'0 0 8px'}}>{job.title}</h3>
                {job.company_name && <p style={{color:'#5A6475', fontSize:'13px', margin:'0 0 4px'}}>🏢 {job.company_name}</p>}
                {job.location && <p style={{color:'#5A6475', fontSize:'13px', margin:'0 0 8px'}}>📍 {job.location}</p>}
                {job.salary && <p style={{color:'#0D3B5E', fontSize:'13px', fontWeight:'700', margin:0}}>💰 {job.salary}</p>}
                {job.apply_url && (
                  <div style={{marginTop:'10px', display:'inline-block', background:'#F5A623', color:'#fff', padding:'4px 10px', borderRadius:'8px', fontSize:'11px', fontWeight:'700'}}>
                    🔗 تقديم خارجي
                  </div>
                )}
              </a>
            ))}
          </div>
        )}

      </div>
    </main>
  )
}