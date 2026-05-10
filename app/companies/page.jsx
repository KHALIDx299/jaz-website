'use client'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '../../lib/supabase'

export default function Companies() {
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('')
  const searchParams = useSearchParams()

  const categories = ['الكل','الزراعة والبن','الطاقة والبتروكيماويات','تقنية المعلومات','السياحة والجزر','الملاحة واللوجستيات','الإنشاء والبنية التحتية']

  useEffect(() => {
    const q = searchParams.get('q')
    if(q) setSearch(q)
    fetchCompanies()
  }, [])

  async function fetchCompanies() {
    setLoading(true)
    const { data } = await supabase.from('companies').select('*').order('created_at', { ascending: false })
    setCompanies(data || [])
    setLoading(false)
  }

  const filtered = companies.filter(c => {
    const matchSearch = !search || c.name?.includes(search) || c.description?.includes(search) || c.category?.includes(search)
    const matchFilter = !filter || filter === 'الكل' || c.category === filter
    return matchSearch && matchFilter
  })

  const icons = {'الزراعة والبن':'☕','الطاقة والبتروكيماويات':'⚡','تقنية المعلومات':'💻','السياحة والجزر':'🏝','الملاحة واللوجستيات':'⚓','الإنشاء والبنية التحتية':'🏗'}

  return (
    <main dir="rtl" style={{fontFamily:'Arial,sans-serif',background:'#F7F8FA',minHeight:'100vh'}}>
      <div style={{background:'linear-gradient(135deg,#0D3B5E,#1A5C30)',padding:'40px 5%'}}>
        <a href="/" style={{color:'rgba(255,255,255,.7)',textDecoration:'none',fontSize:'14px'}}>← الرئيسية</a>
        <h1 style={{fontSize:'clamp(24px,5vw,36px)',fontWeight:'800',color:'#fff',margin:'12px 0 8px'}}>دليل شركات جازان</h1>
        <p style={{color:'rgba(255,255,255,.7)',marginBottom:'20px'}}>{companies.length} شركة مسجّلة</p>
        <div style={{display:'flex',background:'#fff',borderRadius:'12px',overflow:'hidden',maxWidth:'500px'}}>
          <input value={search} onChange={e=>setSearch(e.target.value)}
            placeholder="ابحث عن شركة..."
            style={{flex:1,padding:'14px 16px',border:'none',outline:'none',fontSize:'15px',direction:'rtl'}}/>
          <button style={{background:'#C8831A',color:'#fff',border:'none',padding:'14px 20px',fontWeight:'700',cursor:'pointer'}}>بحث</button>
        </div>
      </div>

      <div style={{padding:'32px 5%'}}>
        <div style={{display:'flex',gap:'10px',flexWrap:'wrap',marginBottom:'28px'}}>
          {categories.map(cat=>(
            <button key={cat} onClick={()=>setFilter(cat==='الكل'?'':cat)}
              style={{padding:'8px 16px',borderRadius:'20px',border:'1px solid',
                borderColor:filter===cat||(cat==='الكل'&&!filter)?'#0D3B5E':'#E2E8F0',
                background:filter===cat||(cat==='الكل'&&!filter)?'#0D3B5E':'#fff',
                color:filter===cat||(cat==='الكل'&&!filter)?'#fff':'#5A6475',
                fontSize:'13px',fontWeight:'600',cursor:'pointer'}}>
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{textAlign:'center',padding:'60px',color:'#5A6475'}}>جاري التحميل...</div>
        ) : filtered.length === 0 ? (
          <div style={{textAlign:'center',padding:'60px',color:'#5A6475'}}>
            <div style={{fontSize:'48px',marginBottom:'16px'}}>🔍</div>
            <div style={{fontSize:'18px',fontWeight:'700'}}>لا توجد نتائج</div>
            <a href="/add-company" style={{color:'#0D3B5E',fontWeight:'700',marginTop:'12px',display:'block'}}>+ أضف شركة</a>
          </div>
        ) : (
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:'18px'}}>
            {filtered.map(company=>(
              <div key={company.id} style={{background:'#fff',border:'1px solid #E2E8F0',borderRadius:'14px',padding:'22px',cursor:'pointer'}}
                onMouseEnter={e=>e.currentTarget.style.boxShadow='0 8px 24px rgba(13,59,94,.12)'}
                onMouseLeave={e=>e.currentTarget.style.boxShadow='none'}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'12px'}}>
                  <div style={{width:'48px',height:'48px',borderRadius:'10px',background:'#E8F4FD',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'22px'}}>
                    {icons[company.category]||'🏢'}
                  </div>
                  {company.verified&&<span style={{background:'#E8F5EE',color:'#1A5C30',fontSize:'11px',fontWeight:'700',padding:'4px 10px',borderRadius:'20px'}}>✔ موثّق</span>}
                </div>
                <div style={{fontWeight:'700',fontSize:'16px',color:'#1A1F2E',marginBottom:'4px'}}>{company.name}</div>
                <div style={{fontSize:'13px',color:'#5A6475',marginBottom:'10px'}}>{company.category}{company.location?` · ${company.location}`:''}</div>
                {company.description&&<div style={{fontSize:'13px',color:'#5A6475',lineHeight:'1.7',marginBottom:'12px'}}>{company.description}</div>}
                <div style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>
                  {company.phone&&<span style={{background:'#F7F8FA',color:'#5A6475',fontSize:'12px',padding:'4px 10px',borderRadius:'6px'}}>📞 {company.phone}</span>}
                  {company.email&&<span style={{background:'#F7F8FA',color:'#5A6475',fontSize:'12px',padding:'4px 10px',borderRadius:'6px'}}>✉ {company.email}</span>}
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{textAlign:'center',marginTop:'48px'}}>
          <a href="/add-company" style={{background:'#0D3B5E',color:'#fff',textDecoration:'none',padding:'14px 32px',borderRadius:'10px',fontSize:'16px',fontWeight:'700'}}>+ سجّل شركتك مجاناً</a>
        </div>
      </div>
    </main>
  )
}