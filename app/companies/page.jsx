'use client'
import { Suspense } from 'react'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '../../lib/supabase'

function CompaniesContent() {
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('')
  const searchParams = useSearchParams()

  const categories = [
    'الطاقة',
    'الزراعة والبن',
    'تقنية المعلومات',
    'السياحة والجزر',
    'الملاحة',
    'الإنشاء',
    'البناء والمقاولات',
    'التجزئة والمبيعات',
    'الصناعة والتصنيع',
    'الخدمات المالية',
    'التعليم والتدريب',
    'الصحة والرعاية الطبية',
    'النقل والخدمات اللوجستية',
    'خدمات الأعمال'
  ]

  useEffect(() => {
    const q = searchParams.get('q')
    const cat = searchParams.get('category')
    if (q) setSearch(q)
    if (cat) setFilter(cat)
    fetchCompanies()
  }, [])

  async function fetchCompanies() {
    setLoading(true)
    const { data } = await supabase
      .from('companies')
      .select('*')
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
    setCompanies(data || [])
    setLoading(false)
  }

  const filtered = companies.filter(c => {
    const matchSearch = !search || c.name?.includes(search) || c.description?.includes(search)
    const matchFilter = !filter || c.category === filter
    return matchSearch && matchFilter
  })

  return (
    <main dir="rtl" style={{minHeight:'100vh', background:'linear-gradient(135deg, #0D3B2E 0%, #1a5c45 100%)'}}>
      <div style={{padding:'40px 20px', textAlign:'center', color:'white'}}>
        <a href="/" style={{color:'#F5A623', fontSize:'14px', textDecoration:'none'}}>← الرئيسية</a>
        <h1 style={{fontSize:'2.5rem', fontWeight:'800', margin:'16px 0 8px'}}>شركات جازان</h1>
        <p style={{opacity:0.8}}>{filtered.length} من أصل {companies.length} شركة مسجلة</p>

        <div style={{display:'flex', gap:'1rem', marginTop:'20px', flexWrap:'wrap', justifyContent:'center'}}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="ابحث عن شركة..."
            style={{padding:'10px 16px', borderRadius:'10px', border:'none', background:'rgba(255,255,255,0.15)', color:'white', minWidth:'200px', fontSize:'14px', outline:'none'}}
          />
          <select
            value={filter}
            onChange={e => setFilter(e.target.value)}
            style={{padding:'10px 16px', borderRadius:'10px', border:'none', background:'rgba(255,255,255,0.15)', color:'white', fontSize:'14px', outline:'none'}}
          >
            <option value="" style={{background:'#0D3B2E'}}>-- كل القطاعات --</option>
            {categories.map(cat => <option key={cat} value={cat} style={{background:'#0D3B2E'}}>{cat}</option>)}
          </select>
          <a href="/add-company" style={{background:'#F5A623', color:'white', border:'none', padding:'10px 24px', borderRadius:'10px', fontWeight:'700', cursor:'pointer', fontSize:'15px', textDecoration:'none'}}>
            + أضف شركة
          </a>
        </div>
      </div>

      <div style={{maxWidth:'1200px', margin:'0 auto', padding:'0 20px 40px'}}>
        {loading ? (
          <p style={{color:'white', textAlign:'center'}}>جاري التحميل...</p>
        ) : filtered.length === 0 ? (
          <p style={{color:'rgba(255,255,255,0.7)', textAlign:'center', marginTop:'4rem'}}>
            {search || filter ? 'لا توجد شركات تطابق البحث' : 'لا توجد شركات مسجلة بعد'}
          </p>
        ) : (
          <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))', gap:'16px'}}>
            {filtered.map(company => (
              <a key={company.id} href={`/companies/${company.id}`} style={{background:'#fff', border:'1px solid #E2E8F0', borderRadius:'14px', padding:'20px 22px', transition:'all .2s', cursor:'pointer', textDecoration:'none', display:'block'}}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(13,59,46,.15)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)' }}
              >
                <h3 style={{fontSize:'16px', fontWeight:'700', color:'#1A1F2E', marginBottom:'8px'}}>{company.name}</h3>
                {company.category && <span style={{background:'#E8F5E9', color:'#2E7D32', padding:'4px 10px', borderRadius:'20px', fontSize:'12px', fontWeight:'600'}}>{company.category}</span>}
                {company.description && <p style={{color:'#5A6475', fontSize:'13px', lineHeight:'1.7', marginTop:'10px'}}>{company.description}</p>}
                <div style={{marginTop:'12px'}}>
                  {company.phone && <p style={{color:'#5A6475', fontSize:'13px', marginBottom:'4px'}}>📞 {company.phone}</p>}
                  {company.email && <p style={{color:'#5A6475', fontSize:'13px'}}>✉️ {company.email}</p>}
                  {company.location && <p style={{color:'#5A6475', fontSize:'13px', marginTop:'4px'}}>📍 {company.location}</p>}
                </div>
                <div style={{marginTop:'14px', color:'#F5A623', fontSize:'13px', fontWeight:'700'}}>
                  عرض التفاصيل ←
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

export default function Companies() {
  return (
    <Suspense fallback={<div style={{color:'white', textAlign:'center', padding:'2rem', background:'linear-gradient(135deg, #0D3B2E 0%, #1a5c45 100%)', minHeight:'100vh'}}>جاري التحميل...</div>}>
      <CompaniesContent />
    </Suspense>
  )
}