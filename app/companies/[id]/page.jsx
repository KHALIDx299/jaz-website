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

  const whatsappText = encodeURIComponent(
    '🏢 ' + company.name + '\n' +
    (company.category ? '🏷️ ' + company.category + '\n' : '') +
    (company.location ? '📍 ' + company.location + '\n' : '') +
    (company.description ? '\n' + company.description.slice(0, 120) + '...\n' : '') +
    '\n🔗 https://jazguide.com/companies/' + params.id
  )

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

          {/* زر مشاركة واتساب */}
          
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
                <a key={job.id} href={'/jobs/' + job.id} style={{background:'#F7F8FA', padding:'18px', borderRadius:'12px', textDecoration:'none', border:'1px solid #E2E8F0', display:'block', transition:'all .2s'}}>
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