'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function Companies() {
  const [companies, setCompanies] = useState([])
  const [filteredCompanies, setFilteredCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('الكل')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('newest')

  useEffect(() => {
    fetchCompanies()
    const params = new URLSearchParams(window.location.search)
    const cat = params.get('category')
    if (cat) setSelectedCategory(cat)
    const q = params.get('q')
    if (q) setSearchTerm(q)
  }, [])

  useEffect(() => {
    filterAndSort()
  }, [companies, selectedCategory, searchTerm, sortBy])

  async function fetchCompanies() {
    const { data } = await supabase
      .from('companies')
      .select('*')
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
    setCompanies(data || [])
    setLoading(false)
  }

  function filterAndSort() {
    let result = [...companies]
    if (selectedCategory !== 'الكل') {
      result = result.filter(c => c.category === selectedCategory)
    }
    if (searchTerm.trim()) {
      const term = searchTerm.trim().toLowerCase()
      result = result.filter(c =>
        (c.name && c.name.toLowerCase().includes(term)) ||
        (c.description && c.description.toLowerCase().includes(term)) ||
        (c.location && c.location.toLowerCase().includes(term))
      )
    }
    if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    } else if (sortBy === 'oldest') {
      result.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
    } else if (sortBy === 'name') {
      result.sort((a, b) => (a.name || '').localeCompare(b.name || ''))
    }
    setFilteredCompanies(result)
  }

  function getCategoryStyle(category) {
    const styles = {
      'الطاقة': { bg: '#FEF3C7', color: '#92400E', icon: '⚡' },
      'تقنية المعلومات': { bg: '#DBEAFE', color: '#1E40AF', icon: '💻' },
      'الزراعة والبن': { bg: '#DCFCE7', color: '#166534', icon: '☕' },
      'السياحة والجزر': { bg: '#FCE7F3', color: '#9F1239', icon: '🏝' },
      'الملاحة': { bg: '#CFFAFE', color: '#155E75', icon: '⚓' },
      'الإنشاء': { bg: '#FED7AA', color: '#9A3412', icon: '🏗' }
    }
    return styles[category] || { bg: '#E5E7EB', color: '#374151', icon: '🏢' }
  }

  function getInitials(name) {
    if (!name) return '?'
    const cleaned = name.replace(/شركة|مؤسسة|مصنع|مكتب/g, '').trim()
    return cleaned.charAt(0) || '?'
  }

  function getLogoColor(name) {
    const colors = ['#0D3B5E', '#C8831A', '#1A5C30', '#7B2D8E', '#BE3144', '#0F766E']
    if (!name) return colors[0]
    let sum = 0
    for (let i = 0; i < name.length; i++) sum += name.charCodeAt(i)
    return colors[sum % colors.length]
  }

  const categories = ['الكل', 'الطاقة', 'تقنية المعلومات', 'الزراعة والبن', 'السياحة والجزر', 'الملاحة', 'الإنشاء']

  return (
    <main dir="rtl" style={{minHeight:'100vh', background:'#F7F8FA', fontFamily:'Arial,sans-serif'}}>
      <div style={{background:'linear-gradient(135deg, #0D3B5E 0%, #1A5C30 100%)', padding:'40px 5%', color:'#fff'}}>
        <div style={{maxWidth:'1200px', margin:'0 auto'}}>
          <a href="/" style={{color:'rgba(255,255,255,0.8)', fontSize:'14px', textDecoration:'none', display:'inline-block', marginBottom:'16px'}}>← الرجوع للرئيسية</a>
          <h1 style={{fontSize:'28px', fontWeight:'800', margin:'0 0 8px'}}>🏢 دليل الشركات</h1>
          <p style={{color:'rgba(255,255,255,0.8)', fontSize:'15px', margin:0}}>اكتشف أفضل الشركات في منطقة جازان</p>
        </div>
      </div>

      <div style={{maxWidth:'1200px', margin:'0 auto', padding:'24px 5%'}}>

        <div style={{background:'#fff', borderRadius:'14px', padding:'18px', marginBottom:'20px', boxShadow:'0 2px 8px rgba(0,0,0,0.04)', display:'grid', gridTemplateColumns:'1fr auto', gap:'12px', alignItems:'center'}}>
          <input type="text" placeholder="🔍 ابحث عن شركة..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{padding:'12px 16px', border:'1px solid #E2E8F0', borderRadius:'10px', fontSize:'14px', outline:'none', fontFamily:'Arial,sans-serif', direction:'rtl'}} />
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{padding:'12px 16px', border:'1px solid #E2E8F0', borderRadius:'10px', fontSize:'14px', outline:'none', fontFamily:'Arial,sans-serif', cursor:'pointer', background:'#fff'}}>
            <option value="newest">الأحدث أولاً</option>
            <option value="oldest">الأقدم أولاً</option>
            <option value="name">أبجدياً</option>
          </select>
        </div>

        <div style={{display:'flex', gap:'8px', marginBottom:'20px', flexWrap:'wrap'}}>
          {categories.map(cat => {
            const isActive = selectedCategory === cat
            const style = cat !== 'الكل' ? getCategoryStyle(cat) : null
            const label = cat !== 'الكل' && style ? style.icon + ' ' + cat : '🏢 ' + cat
            return (
              <button key={cat} onClick={() => setSelectedCategory(cat)} style={{padding:'10px 18px', borderRadius:'24px', border: isActive ? '2px solid #0D3B5E' : '1px solid #E2E8F0', background: isActive ? '#0D3B5E' : '#fff', color: isActive ? '#fff' : '#0D3B5E', fontSize:'13px', fontWeight:'700', cursor:'pointer', fontFamily:'Arial,sans-serif'}}>
                {label}
              </button>
            )
          })}
        </div>

        <div style={{color:'#5A6475', fontSize:'14px', marginBottom:'16px'}}>
          {loading ? 'جاري التحميل...' : <span>عرض <strong style={{color:'#0D3B5E'}}>{filteredCompanies.length}</strong> من أصل <strong style={{color:'#0D3B5E'}}>{companies.length}</strong> شركة</span>}
        </div>

        {loading ? (
          <div style={{textAlign:'center', padding:'60px', color:'#888'}}>جاري التحميل...</div>
        ) : filteredCompanies.length === 0 ? (
          <div style={{textAlign:'center', padding:'60px', background:'#fff', borderRadius:'14px', color:'#888'}}>
            <div style={{fontSize:'48px', marginBottom:'12px'}}>🔍</div>
            <p style={{fontSize:'16px', margin:0}}>لا توجد شركات تطابق البحث</p>
          </div>
        ) : (
          <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:'16px'}}>
            {filteredCompanies.map((company, index) => (
              <CompanyCard key={company.id} company={company} index={index} getCategoryStyle={getCategoryStyle} getLogoColor={getLogoColor} getInitials={getInitials} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

function CompanyCard({ company, index, getCategoryStyle, getLogoColor, getInitials }) {
  const catStyle = getCategoryStyle(company.category)
  const logoColor = getLogoColor(company.name)
  const isFeatured = index < 3
  const companyUrl = '/companies/' + company.id
  const shortDesc = company.description && company.description.length > 120 ? company.description.substring(0, 120) + '...' : company.description

  return (
    <a href={companyUrl} style={{background:'#fff', borderRadius:'14px', padding:'20px', textDecoration:'none', boxShadow:'0 2px 8px rgba(0,0,0,0.06)', border:'1px solid #E2E8F0', transition:'all 0.25s', display:'block', position:'relative', overflow:'hidden'}}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 28px rgba(13,59,94,0.15)'; e.currentTarget.style.borderColor = '#C8831A' }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)'; e.currentTarget.style.borderColor = '#E2E8F0' }}
    >
      {isFeatured && (
        <div style={{position:'absolute', top:'12px', left:'12px', background:'linear-gradient(135deg, #F5A623, #C8831A)', color:'#fff', fontSize:'10px', fontWeight:'700', padding:'4px 10px', borderRadius:'12px', boxShadow:'0 2px 6px rgba(245,166,35,0.4)'}}>
          ⭐ موصى به
        </div>
      )}

      <div style={{display:'flex', gap:'12px', marginBottom:'14px', alignItems:'flex-start'}}>
       <div style={{width:'56px', height:'56px', borderRadius:'14px', background: company.logo_url ? '#fff' : logoColor, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:'22px', fontWeight:'800', flexShrink:0, boxShadow:'0 4px 12px rgba(0,0,0,0.15)', overflow:'hidden', border: company.logo_url ? '1px solid #E2E8F0' : 'none'}}>
          {company.logo_url ? (
            <img src={company.logo_url} alt={company.name} style={{width:'100%', height:'100%', objectFit:'contain'}} />
          ) : (
            getInitials(company.name)
          )}
        </div>
        <div style={{flex:1, minWidth:0}}>
          <h3 style={{fontSize:'15px', fontWeight:'700', color:'#1A1F2E', margin:'0 0 4px', lineHeight:'1.3'}}>
            {company.name}
          </h3>
          {company.location && <p style={{fontSize:'12px', color:'#5A6475', margin:0}}>📍 {company.location}</p>}
        </div>
      </div>

      {company.category && (
        <div style={{display:'inline-block', background: catStyle.bg, color: catStyle.color, padding:'5px 12px', borderRadius:'14px', fontSize:'12px', fontWeight:'600', marginBottom:'12px'}}>
          {catStyle.icon} {company.category}
        </div>
      )}

      {shortDesc && <p style={{fontSize:'13px', color:'#5A6475', margin:'0 0 14px', lineHeight:'1.6'}}>{shortDesc}</p>}

      <div style={{display:'flex', gap:'8px', flexWrap:'wrap', borderTop:'1px solid #F0F0F0', paddingTop:'12px'}}>
        {company.phone && <div style={{fontSize:'11px', color:'#5A6475', background:'#F7F8FA', padding:'4px 8px', borderRadius:'8px'}}>📞 متاح</div>}
        {company.website && <div style={{fontSize:'11px', color:'#5A6475', background:'#F7F8FA', padding:'4px 8px', borderRadius:'8px'}}>🌐 موقع</div>}
        {company.email && <div style={{fontSize:'11px', color:'#5A6475', background:'#F7F8FA', padding:'4px 8px', borderRadius:'8px'}}>✉️ إيميل</div>}
      </div>

      <div style={{marginTop:'14px', textAlign:'center', color:'#0D3B5E', fontSize:'13px', fontWeight:'700', padding:'8px', borderRadius:'8px', background:'#F7F8FA'}}>
        عرض التفاصيل ←
      </div>
    </a>
  )
}