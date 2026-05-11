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

  const categories = ['البناء والمقاولات','التجزئة والمبيعات','الصناعة والتصنيع','الخدمات المالية','التعليم والتدريب','الصحة والرعاية الطبية','تقنية المعلومات','النقل والخدمات اللوجستية','السياحة والجزر','خدمات الأعمال','الزراعة والبين']

  useEffect(() => {
    const q = searchParams.get('q')
    const cat = searchParams.get('category')
    if (q) setSearch(q)
    if (cat) setFilter(cat)
    fetchCompanies()
  }, [])

  async function fetchCompanies() {
    setLoading(true)
    const { data } = await supabase.from('companies').select('*').order('created_at', { ascending: false })
    setCompanies(data || [])
    setLoading(false)
  }

  const filtered = companies.filter(c => {
    const matchSearch = !search || c.name?.includes(search) || c.description?.includes(search)
    const matchFilter = !filter || c.category === filter
    return matchSearch && matchFilter
  })

  return (
    <main dir="rtl" style={{minHeight:'100vh',background:'#0a0a0a',color:'white',padding:'2rem',fontFamily:'Arial,sans-serif'}}>
      <h1 style={{textAlign:'center',fontSize:'2rem',marginBottom:'1rem',color:'#F5A623'}}>الشركات</h1>

      <div style={{display:'flex',gap:'1rem',marginBottom:'2rem',flexWrap:'wrap',justifyContent:'center'}}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="ابحث عن شركة..."
          style={{padding:'0.5rem 1rem',borderRadius:'8px',border:'1px solid #333',background:'#111',color:'white',minWidth:'200px'}}
        />
        <select
          value={filter}
          onChange={e => setFilter(e.target.value)}
          style={{padding:'0.5rem 1rem',borderRadius:'8px',border:'1px solid #333',background:'#111',color:'white'}}
        >
          <option value="">-- اختر قطاع --</option>
          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
      </div>

      {!filter && !search ? (
        <p style={{textAlign:'center',color:'#aaa',marginTop:'4rem',fontSize:'1.2rem'}}>
          اختر قطاعاً أو ابحث عن شركة لعرض النتائج
        </p>
      ) : loading ? (
        <p style={{textAlign:'center'}}>جاري التحميل...</p>
      ) : filtered.length === 0 ? (
        <p style={{textAlign:'center',color:'#aaa'}}>لا توجد شركات في هذا القطاع</p>
      ) : (
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:'1.5rem',maxWidth:'1200px',margin:'0 auto'}}>
          {filtered.map(company => (
            <div key={company.id} style={{background:'#111',borderRadius:'12px',padding:'1.5rem',border:'1px solid #222'}}>
              <h2 style={{color:'#F5A623',marginBottom:'0.5rem'}}>{company.name}</h2>
              <p style={{color:'#aaa',fontSize:'0.9rem',marginBottom:'1rem'}}>{company.description}</p>
              {company.phone && <span style={{color:'#ccc',fontSize:'0.85rem',display:'block'}}>📞 {company.phone}</span>}
              {company.email && <span style={{color:'#ccc',fontSize:'0.85rem',display:'block'}}>✉️ {company.email}</span>}
            </div>
          ))}
        </div>
      )}

      <div style={{textAlign:'center',marginTop:'2rem'}}>
        <a href="/add-company" style={{background:'#F5A623',color:'black',padding:'0.75rem 1.5rem',borderRadius:'8px',textDecoration:'none',fontWeight:'bold'}}>+ أضف شركة</a>
      </div>
    </main>
  )
}

export default function Companies() {
  return (
    <Suspense fallback={<div style={{color:'white',textAlign:'center',padding:'2rem'}}>جاري التحميل...</div>}>
      <CompaniesContent />
    </Suspense>
  )
}