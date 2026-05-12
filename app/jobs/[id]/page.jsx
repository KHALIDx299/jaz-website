'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '../../../lib/supabase'

export default function JobDetail() {
  const params = useParams()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchJob() {
      const { data } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', params.id)
        .single()
      setJob(data)
      setLoading(false)
    }
    if (params.id) fetchJob()
  }, [params.id])

  if (loading) {
    return (
      <main dir="rtl" style={{minHeight:'100vh', background:'linear-gradient(135deg, #0D3B2E 0%, #1a5c45 100%)', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontSize:'18px', fontFamily:'Arial,sans-serif'}}>
        جاري التحميل...
      </main>
    )
  }

  if (!job) {
    return (
      <main dir="rtl" style={{minHeight:'100vh', background:'linear-gradient(135deg, #0D3B2E 0%, #1a5c45 100%)', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', color:'white', fontFamily:'Arial,sans-serif'}}>
        <h1 style={{fontSize:'2rem', marginBottom:'1rem'}}>الوظيفة غير موجودة 😔</h1>
        <a href="/jobs" style={{color:'#F5A623', textDecoration:'none', fontSize:'16px'}}>← رجوع لقائمة الوظائف</a>
      </main>
    )
  }

  return (
    <main dir="rtl" style={{minHeight:'100vh', background:'linear-gradient(135deg, #0D3B2E 0%, #1a5c45 100%)', padding:'40px 20px', fontFamily:'Arial,sans-serif'}}>
      <div style={{maxWidth:'900px', margin:'0 auto'}}>

        <a href="/jobs" style={{color:'#F5A623', fontSize:'14px', textDecoration:'none', display:'inline-block', marginBottom:'24px'}}>
          ← رجوع لقائمة الوظائف
        </a>

        <div style={{background:'#fff', borderRadius:'16px', padding:'32px', marginBottom:'20px', boxShadow:'0 4px 12px rgba(0,0,0,0.1)'}}>
          {job.job_type && (
            <span style={{background:'#E8F5E9', color:'#2E7D32', padding:'6px 14px', borderRadius:'20px', fontSize:'13px', fontWeight:'600', display:'inline-block', marginBottom:'12px'}}>
              {job.job_type}
            </span>
          )}
          <h1 style={{fontSize:'2rem', fontWeight:'800', color:'#1A1F2E', marginBottom:'12px', lineHeight:'1.3'}}>
            {job.title}
          </h1>
          {job.company_name && (
            <p style={{color:'#5A6475', fontSize:'15px', marginBottom:'6px'}}>
              🏢 {job.company_name}
            </p>
          )}
          {job.location && (
            <p style={{color:'#5A6475', fontSize:'15px'}}>
              📍 {job.location}
            </p>
          )}
        </div>

        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))', gap:'14px', marginBottom:'20px'}}>
          {job.salary && (
            <div style={{background:'#fff', borderRadius:'16px', padding:'20px', boxShadow:'0 4px 12px rgba(0,0,0,0.1)'}}>
              <div style={{fontSize:'12px', color:'#888', marginBottom:'6px'}}>💰 الراتب</div>
              <div style={{color:'#0D3B5E', fontWeight:'700', fontSize:'17px'}}>{job.salary}</div>
            </div>
          )}
          {job.job_type && (
            <div style={{background:'#fff', borderRadius:'16px', padding:'20px', boxShadow:'0 4px 12px rgba(0,0,0,0.1)'}}>
              <div style={{fontSize:'12px', color:'#888', marginBottom:'6px'}}>⏰ نوع الدوام</div>
              <div style={{color:'#0D3B5E', fontWeight:'700', fontSize:'17px'}}>{job.job_type}</div>
            </div>
          )}
        </div>

        {job.description && (
          <div style={{background:'#fff', borderRadius:'16px', padding:'28px', marginBottom:'20px', boxShadow:'0 4px 12px rgba(0,0,0,0.1)'}}>
            <h2 style={{fontSize:'1.3rem', fontWeight:'700', color:'#1A1F2E', marginBottom:'16px', display:'flex', alignItems:'center', gap:'8px'}}>
              📝 وصف الوظيفة
            </h2>
            <p style={{color:'#5A6475', fontSize:'15px', lineHeight:'1.9', whiteSpace:'pre-line'}}>
              {job.description}
            </p>
          </div>
        )}

        {job.requirements && (
          <div style={{background:'#fff', borderRadius:'16px', padding:'28px', marginBottom:'20px', boxShadow:'0 4px 12px rgba(0,0,0,0.1)'}}>
            <h2 style={{fontSize:'1.3rem', fontWeight:'700', color:'#1A1F2E', marginBottom:'16px', display:'flex', alignItems:'center', gap:'8px'}}>
              ✅ الشروط والمتطلبات
            </h2>
            <p style={{color:'#5A6475', fontSize:'15px', lineHeight:'1.9', whiteSpace:'pre-line'}}>
              {job.requirements}
            </p>
          </div>
        )}

        {job.company_details && (
          <div style={{background:'#fff', borderRadius:'16px', padding:'28px', marginBottom:'20px', boxShadow:'0 4px 12px rgba(0,0,0,0.1)'}}>
            <h2 style={{fontSize:'1.3rem', fontWeight:'700', color:'#1A1F2E', marginBottom:'16px', display:'flex', alignItems:'center', gap:'8px'}}>
              🏢 عن الشركة
            </h2>
            <p style={{color:'#5A6475', fontSize:'15px', lineHeight:'1.9', whiteSpace:'pre-line'}}>
              {job.company_details}
            </p>
          </div>
        )}

        {(job.phone || job.email) && (
          <div style={{background:'#fff', borderRadius:'16px', padding:'28px', marginBottom:'20px', boxShadow:'0 4px 12px rgba(0,0,0,0.1)'}}>
            <h2 style={{fontSize:'1.3rem', fontWeight:'700', color:'#1A1F2E', marginBottom:'20px', display:'flex', alignItems:'center', gap:'8px'}}>
              📞 للتقديم والتواصل
            </h2>
            <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))', gap:'14px'}}>
              {job.phone && (
                <a href={`tel:${job.phone}`} style={{background:'#F7F8FA', padding:'16px', borderRadius:'12px', textDecoration:'none', border:'1px solid #E2E8F0', display:'block'}}>
                  <div style={{fontSize:'12px', color:'#888', marginBottom:'4px'}}>📞 الهاتف</div>
                  <div style={{color:'#0D3B5E', fontWeight:'700', fontSize:'15px'}}>{job.phone}</div>
                </a>
              )}
              {job.email && (
                <a href={`mailto:${job.email}`} style={{background:'#F7F8FA', padding:'16px', borderRadius:'12px', textDecoration:'none', border:'1px solid #E2E8F0', display:'block'}}>
                  <div style={{fontSize:'12px', color:'#888', marginBottom:'4px'}}>✉️ البريد الإلكتروني</div>
                  <div style={{color:'#0D3B5E', fontWeight:'700', fontSize:'15px', wordBreak:'break-all'}}>{job.email}</div>
                </a>
              )}
            </div>
          </div>
        )}

      </div>
    </main>
  )
}