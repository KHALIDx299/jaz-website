'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase'

export default function JobDetail({ params }) {
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
    fetchJob()
  }, [])

  if (loading) return <div style={{color:'white',textAlign:'center',padding:'4rem'}}>جاري التحميل...</div>
  if (!job) return <div style={{color:'white',textAlign:'center',padding:'4rem'}}>الوظيفة غير موجودة</div>

  return (
    <main dir="rtl" style={{minHeight:'100vh',background:'#0a0a0a',color:'white',padding:'2rem',fontFamily:'Arial,sans-serif'}}>
      <a href="/jobs" style={{color:'#F5A623',textDecoration:'none',fontSize:'14px'}}>← العودة للوظائف</a>

      <div style={{maxWidth:'800px',margin:'2rem auto',background:'#111',borderRadius:'16px',padding:'2rem',border:'1px solid #222'}}>
        
        <div style={{marginBottom:'2rem'}}>
          <h1 style={{color:'#F5A623',fontSize:'2rem',marginBottom:'0.5rem'}}>{job.title}</h1>
          <p style={{color:'#aaa',fontSize:'1.1rem'}}>{job.company_name}</p>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem',marginBottom:'2rem'}}>
          <div style={{background:'#1a1a1a',borderRadius:'8px',padding:'1rem'}}>
            <p style={{color:'#888',fontSize:'12px',marginBottom:'4px'}}>الراتب</p>
            <p style={{color:'#F5A623',fontWeight:'700',fontSize:'1.2rem'}}>💰 {job.salary}</p>
          </div>
          <div style={{background:'#1a1a1a',borderRadius:'8px',padding:'1rem'}}>
            <p style={{color:'#888',fontSize:'12px',marginBottom:'4px'}}>نوع الدوام</p>
            <p style={{color:'white',fontWeight:'600'}}>{job.job_type}</p>
          </div>
        </div>

        {job.requirements && (
          <div style={{marginBottom:'2rem'}}>
            <h2 style={{color:'#F5A623',fontSize:'1.2rem',marginBottom:'1rem'}}>📋 الشروط والمتطلبات</h2>
            <p style={{color:'#ccc',lineHeight:'1.8',whiteSpace:'pre-line'}}>{job.requirements}</p>
          </div>
        )}

        {job.company_details && (
          <div style={{marginBottom:'2rem'}}>
            <h2 style={{color:'#F5A623',fontSize:'1.2rem',marginBottom:'1rem'}}>🏢 عن الشركة</h2>
            <p style={{color:'#ccc',lineHeight:'1.8'}}>{job.company_details}</p>
          </div>
        )}

        {(job.phone || job.email) && (
          <div style={{background:'#1a1a1a',borderRadius:'12px',padding:'1.5rem'}}>
            <h2 style={{color:'#F5A623',fontSize:'1.2rem',marginBottom:'1rem'}}>📞 للتواصل</h2>
            {job.phone && <p style={{color:'#ccc',marginBottom:'0.5rem'}}>📱 {job.phone}</p>}
            {job.email && <p style={{color:'#ccc'}}>✉️ {job.email}</p>}
          </div>
        )}
      </div>
    </main>
  )
}