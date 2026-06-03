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
      const { data } = await supabase.from('jobs').select('*').eq('id', params.id).single()
      setJob(data)
      setLoading(false)
    }
    if (params.id) fetchJob()
  }, [params.id])

  if (loading) return (
    <main dir="rtl" style={{minHeight:'100vh', background:'linear-gradient(135deg, #0D3B2E 0%, #1a5c45 100%)', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontFamily:'Arial,sans-serif'}}>جاري التحميل...</main>
  )

  if (!job) return (
    <main dir="rtl" style={{minHeight:'100vh', background:'linear-gradient(135deg, #0D3B2E 0%, #1a5c45 100%)', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', color:'white', fontFamily:'Arial,sans-serif'}}>
      <h1>الوظيفة غير موجودة 😔</h1>
      <a href="/jobs" style={{color:'#F5A623', textDecoration:'none', marginTop:'1rem'}}>← رجوع لقائمة الوظائف</a>
    </main>
  )

  const whatsappText = encodeURIComponent(
    '💼 وظيفة: ' + job.title + '\n' +
    (job.company_name ? '🏢 ' + job.company_name + '\n' : '') +
    (job.location ? '📍 ' + job.location + '\n' : '') +
    (job.salary ? '💰 ' + job.salary + '\n' : '') +
    (job.job_type ? '⏰ ' + job.job_type + '\n' : '') +
    '\n🔗 https://jazguide.com/jobs/' + params.id
  )

  return (
    <main dir="rtl" style={{minHeight:'100vh', background:'linear-gradient(135deg, #0D3B2E 0%, #1a5c45 100%)', padding:'40px 20px', fontFamily:'Arial,sans-serif'}}>
      <div style={{maxWidth:'900px', margin:'0 auto'}}>
        <a href="/jobs" style={{color:'#F5A623', fontSize:'14px', textDecoration:'none', display:'inline-block', marginBottom:'24px'}}>← رجوع لقائمة الوظائف</a>

        <div style={{background:'#fff', borderRadius:'16px', padding:'32px', marginBottom:'20px', boxShadow:'0 4px 12px rgba(0,0,0,0.1)'}}>
          {job.job_type && <span style={{background:'#E8F5E9', color:'#2E7D32', padding:'6px 14px', borderRadius:'20px', fontSize:'13px', fontWeight:'600', display:'inline-block', marginBottom:'12px'}}>{job.job_type}</span>}
          <h1 style={{fontSize:'2rem', fontWeight:'800', color:'#1A1F2E', marginBottom:'12px', lineHeight:'1.3'}}>{job.title}</h1>
          {job.company_name && <p style={{color:'#5A6475', fontSize:'15px', marginBottom:'6px'}}>🏢 {job.company_name}</p>}
          {job.location && <p style={{color:'#5A6475', fontSize:'15px', marginBottom:'0'}}>📍 {job.location}</p>}

          
            href={'https://wa.me/?text=' + whatsappText}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display:'inline-flex',
              alignItems:'center',
              gap:'8px',
              backgroundColor:'#25D366',
              color:'#fff',
              padding:'10px 22px',
              borderRadius:'10px',
              textDecoration:'none',
              fontWeight:'700',
              fontSize:'15px',
              marginTop:'20px',
              boxShadow:'0 4px 12px rgba(37,211,102,0.35)'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.118.554 4.1 1.523 5.82L0 24l6.338-1.499A11.946 11.946 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.371l-.36-.214-3.732.882.939-3.618-.235-.374A9.818 9.818 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/>
            </svg>
            📤 شارك على واتساب
          </a>
        </div>

        {job.apply_url && (
          <a href={job.apply_url} target="_blank" rel="noopener noreferrer" style={{display:'block', background:'linear-gradient(135deg, #F5A623, #C8831A)', color:'#fff', padding:'20px', borderRadius:'16px', textDecoration:'none', marginBottom:'20px', textAlign:'center', boxShadow:'0 6px 20px rgba(245,166,35,0.4)'}}>
            <div style={{fontSize:'1.2rem', fontWeight:'800', marginBottom:'4px'}}>🚀 قدّم الآن على المنصة</div>
            <div style={{fontSize:'13px', opacity:0.9}}>اضغط للانتقال لرابط التقديم في مصدر الوظيفة</div>
          </a>
        )}

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
            <h2 style={{fontSize:'1.3rem', fontWeight:'700', color:'#1A1F2E', marginBottom:'16px'}}>📝 وصف الوظيفة</h2>
            <p style={{color:'#5A6475', fontSize:'15px', lineHeight:'1.9', whiteSpace:'pre-line'}}>{job.description}</p>
          </div>
        )}

        {job.requirements && (
          <div style={{background:'#fff', borderRadius:'16px', padding:'28px', marginBottom:'20px', boxShadow:'0 4px 12px rgba(0,0,0,0.1)'}}>
            <h2 style={{fontSize:'1.3rem', fontWeight:'700', color:'#1A1F2E', marginBottom:'16px'}}>✅ الشروط والمتطلبات</h2>
            <p style={{color:'#5A6475', fontSize:'15px', lineHeight:'1.9', whiteSpace:'pre-line'}}>{job.requirements}</p>
          </div>
        )}

        {job.company_details && (
          <div style={{background:'#fff', borderRadius:'16px', padding:'28px', marginBottom:'20px', boxShadow:'0 4px 12px rgba(0,0,0,0.1)'}}>
            <h2 style={{fontSize:'1.3rem', fontWeight:'700', color:'#1A1F2E', marginBottom:'16px'}}>🏢 عن الشركة</h2>
            <p style={{color:'#5A6475', fontSize:'15px', lineHeight:'1.9', whiteSpace:'pre-line'}}>{job.company_details}</p>
          </div>
        )}

        {(job.phone || job.email) && (
          <div style={{background:'#fff', borderRadius:'16px', padding:'28px', marginBottom:'20px', boxShadow:'0 4px 12px rgba(0,0,0,0.1)'}}>
            <h2 style={{fontSize:'1.3rem', fontWeight:'700', color:'#1A1F2E', marginBottom:'20px'}}>📞 للتقديم والتواصل</h2>
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