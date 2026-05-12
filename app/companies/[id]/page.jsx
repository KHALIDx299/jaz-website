'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '../../../lib/supabase'

export default function CompanyDetail() {
  const params = useParams()
  const [company, setCompany] = useState(null)
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [isOwnerOrAdmin, setIsOwnerOrAdmin] = useState(false)

  useEffect(() => {
    fetchCompany()
    checkUser()
  }, [])

  async function fetchCompany() {
    setLoading(true)
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error || !data) {
      setLoading(false)
      return
    }

    setCompany(data)

    const { data: jobsData } = await supabase
      .from('jobs')
      .select('*')
      .eq('company_name', data.name)
      .order('created_at', { ascending: false })

    setJobs(jobsData || [])
    setLoading(false)
  }

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) setUser(user)
  }

  useEffect(() => {
    async function checkOwnership() {
      if (!user || !company) return
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      const isAdmin = profile?.role === 'admin'
      const isOwner = company.user_id === user.id
      setIsOwnerOrAdmin(isAdmin || isOwner)
    }
    checkOwnership()
  }, [user, company])

  if (loading) {
    return (
      <main dir="rtl" style={{minHeight:'100vh', background:'linear-gradient(135deg, #0D3B2E 0%, #1a5c45 100%)', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontSize:'18px'}}>
        جاري التحميل...
      </main>
    )
  }

  if (!company) {
    return (
      <main dir="rtl" style={{minHeight:'100vh', background:'linear-gradient(135deg, #0D3B2E 0%, #1a5c45 100%)', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', color:'white'}}>
        <h1 style={{fontSize:'2rem', marginBottom:'1rem'}}>الشركة غير موجودة 😔</h1>
        <a href="/companies" style={{color:'#F5A623', textDecoration:'none', fontSize:'16px'}}>← رجوع لقائمة الشركات</a>
      </main>
    )
  }

  return (
    <main dir="rtl" style={{minHeight:'100vh', background:'linear-gradient(135deg, #0D3B2E 0%, #1a5c45 100%)', padding:'40px 20px'}}>
      <div style={{maxWidth:'900px', margin:'0 auto'}}>

        <a href="/companies" style={{color:'#F5A623', fontSize:'14px', textDecoration:'none', display:'inline-block', marginBottom:'24px'}}>
          ← رجوع لقائمة الشركات
        </a>

        <div style={{background:'#fff', borderRadius:'16px', padding:'32px', marginBottom:'20px', boxShadow:'0 4px 12px rgba(0,0,0,0.1)'}}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'16px'}}>
            <div style={{flex:1, minWidth:'250px'}}>
              {company.category && (
                <span style={{background:'#E8F5E9', color:'#2E7D32', padding:'6px 14px', borderRadius:'20px', fontSize:'13px', fontWeight:'600', display:'inline-block', marginBottom:'12px'}}>
                  {company.category}
                </span>
              )}
              <h1 style={{fontSize:'2rem', fontWeight:'800', color:'#1A1F2E', marginBottom:'12px', lineHeight:'1.3'}}>
                {company.name}
              </h1>
              {company.location && (
                <p style={{color:'#5A6475', fontSize:'15px'}}>
                  📍 {company.location}
                </p>
              )}
            </div>

            {isOwnerOrAdmin && (
              <a href="/dashboard" style={{background:'#0D3B5E', color:'#fff', padding:'10px 20px', borderRadius:'8px', fontSize:'14px', fontWeight:'700', textDecoration:'none'}}>
                ✏️ تعديل
              </a>
            )}
          </div>
        </div>

        {company.description && (
          <div style={{background:'#fff', borderRadius:'16px', padding:'28px', marginBottom:'20px', boxShadow:'0 4px 12px rgba(0,0,0,0.1)'}}>
            <h2 style={{fontSize:'1.3rem', fontWeight:'700', color:'#1A1F2E', marginBottom:'16px', display:'flex', alignItems:'center', gap:'8px'}}>
              📝 عن الشركة
            </h2>
            <p style={{color:'#5A6475', fontSize:'15px', lineHeight:'1.9'}}>
              {company.description}
            </p>
          </div>
        )}

        {(company.phone || company.email || company.website) && (
          <div style={{background:'#fff', borderRadius:'16px', padding:'28px', marginBottom:'20px', boxShadow:'0 4px 12px rgba(0,0,0,0.1)'}}>
            <h2 style={{fontSize:'1.3rem', fontWeight:'700', color:'#1A1F2E', marginBottom:'20px', display:'flex', alignItems:'center', gap:'8px'}}>
              📞 معلومات التواصل
            </h2>
            <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))', gap:'14px'}}>
              {company.phone && (
                <a href={`tel:${company.phone}`} style={{background:'#F7F8FA', padding:'16px', borderRadius:'12px', textDecoration:'none', border:'1px solid #E2E8F0', display:'block'}}>
                  <div style={{fontSize:'12px', color:'#888', marginBottom:'4px'}}>📞 الهاتف</div>
                  <div style={{color:'#0D3B5E', fontWeight:'700', fontSize:'15px'}}>{company.phone}</div>
                </a>
              )}
              {company.email && (
                <a href={`mailto:${company.email}`} style={{background:'#F7F8FA', padding:'16px', borderRadius:'12px', textDecoration:'none', border:'1px solid #E2E8F0', display:'block'}}>
                  <div style={{fontSize:'12px', color:'#888', marginBottom:'4px'}}>✉️ البريد الإلكتروني</div>
                  <div style={{color:'#0D3B5E', fontWeight:'700', fontSize:'15px', wordBreak:'break-all'}}>{company.email}</div>
                </a>
              )}
              {company.website && (
                <a href={company.website} target="_blank" rel="noopener noreferrer" style={{background:'#F7F8FA', padding:'16px', borderRadius:'12px', textDecoration:'none', border:'1px solid #E2E8F0', display:'block'}}>
                  <div style={{fontSize:'12px', color:'#888', marginBottom:'4px'}}>🌐 الموقع الإلكتروني</div>
                  <div style={{color:'#0D3B5E', fontWeight:'700', fontSize:'15px', wordBreak:'break-all'}}>{company.website}</div>
                </a>
              )}
            </div>
          </div>
        )}

        {jobs.length > 0 && (
          <div style={{background:'#fff', borderRadius:'16px', padding:'28px', marginBottom:'20px', boxShadow:'0 4px 12px rgba(0,0,0,0.1)'}}>
            <h2 style={{fontSize:'1.3rem', fontWeight:'700', color:'#1A1F2E', marginBottom:'20px', display:'flex', alignItems:'center', gap:'8px'}}>
              💼 الوظائف المتاحة ({jobs.length})
            </h2>
            <div style={{display:'flex', flexDirection:'column', gap:'12px'}}>
              {jobs.map(job => (
                <a key={job.id} href={`/jobs/${job.id}`} style={{background:'#F7F8FA', padding:'18px', borderRadius:'12px', textDecoration:'none', border:'1px solid #E2E8F0', display:'block', transition:'all .2s'}}>
                  <h3 style={{color:'#1A1F2E', fontSize:'16px', fontWeight:'700', marginBottom:'8px'}}>{job.title}</h3>
                  <div style={{display:'flex', gap:'16px', flexWrap:'wrap', fontSize:'13px', color:'#5A6475'}}>
                    {job.job_type && <span>🏢 {job.job_type}</span>}
                    {job.location && <span>📍 {job.location}</span>}
                    {job.salary && <span>💰 {job.salary}</span>}
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

      </div>
    </main>
  )
}