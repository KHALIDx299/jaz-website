'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function Home() {
  const [searchType, setSearchType] = useState('companies')
  const [user, setUser] = useState<any>(null)
  const [role, setRole] = useState<string | null>(null)
  const [loadingUser, setLoadingUser] = useState(true)
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({})
  const [totalCompanies, setTotalCompanies] = useState(0)
  const [totalJobs, setTotalJobs] = useState(0)

  useEffect(() => {
    checkUser()
    fetchStats()
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user)
        fetchRole(session.user.id)
      } else {
        setUser(null)
        setRole(null)
      }
    })
    return () => { listener?.subscription.unsubscribe() }
  }, [])

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      setUser(user)
      await fetchRole(user.id)
    }
    setLoadingUser(false)
  }

  async function fetchRole(userId: string) {
    const { data } = await supabase.from('profiles').select('role').eq('id', userId).single()
    if (data) setRole(data.role)
  }

  async function fetchStats() {
    const { data: companies } = await supabase
      .from('companies')
      .select('category')
      .eq('status', 'approved')

    if (companies) {
      setTotalCompanies(companies.length)
      const counts: Record<string, number> = {}
      companies.forEach(c => {
        if (c.category) {
          counts[c.category] = (counts[c.category] || 0) + 1
        }
      })
      setCategoryCounts(counts)
    }

    const { count: jobsCount } = await supabase
      .from('jobs')
      .select('*', { count: 'exact', head: true })
    setTotalJobs(jobsCount || 0)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    setUser(null)
    setRole(null)
    window.location.href = '/'
  }

  function handleSearch() {
    const val = (document.getElementById('searchInput') as HTMLInputElement)?.value
    if(val) window.location.href = `/${searchType}?q=${val}`
    else window.location.href = `/${searchType}`
  }

  const categoryList = [
    { icon: '☕', name: 'الزراعة والبن' },
    { icon: '⚡', name: 'الطاقة' },
    { icon: '💻', name: 'تقنية المعلومات' },
    { icon: '🏝', name: 'السياحة والجزر' },
    { icon: '⚓', name: 'الملاحة' },
    { icon: '🏗', name: 'الإنشاء' }
  ]

  return (
    <main dir="rtl" style={{fontFamily:'Arial,sans-serif',background:'#F7F8FA',minHeight:'100vh'}}>
      <nav style={{background:'#fff',padding:'16px 5%',display:'flex',justifyContent:'space-between',alignItems:'center',borderBottom:'1px solid #E2E8F0',position:'sticky',top:0,zIndex:100}}>

        {/* الشعار النصي */}
        <a href="/" style={{display:'inline-flex',alignItems:'center',background:'#0D3B5E',padding:'8px 18px',borderRadius:'10px',gap:'8px',textDecoration:'none'}}>
          <span style={{fontSize:'24px',fontWeight:'800',color:'#fff'}}>J</span>
          <span style={{width:'1px',height:'24px',background:'#F5A623'}}></span>
          <span style={{fontSize:'24px',fontWeight:'800',color:'#F5A623'}}>A</span>
          <span style={{width:'1px',height:'24px',background:'#F5A623'}}></span>
          <span style={{fontSize:'24px',fontWeight:'800',color:'#fff'}}>Z</span>
          <span style={{fontSize:'14px',color:'#F5A623',fontWeight:'700',marginRight:'4px'}}>جاز</span>
        </a>

        <div style={{display:'flex',gap:'12px',alignItems:'center',flexWrap:'wrap'}}>
          <a href="/companies" style={{color:'#0D3B5E',textDecoration:'none',fontSize:'14px',fontWeight:'600'}}>الشركات</a>
          <a href="/jobs" style={{color:'#0D3B5E',textDecoration:'none',fontSize:'14px',fontWeight:'600'}}>الوظائف</a>

          {loadingUser ? (
            <div style={{width:'180px',height:'40px'}}></div>
          ) : !user ? (
            <>
              <a href="/login" style={{color:'#0D3B5E',textDecoration:'none',fontSize:'14px',fontWeight:'600',padding:'10px 16px'}}>تسجيل دخول</a>
              <a href="/add-company" style={{background:'#0D3B5E',color:'#fff',padding:'10px 20px',borderRadius:'8px',fontSize:'14px',fontWeight:'700',textDecoration:'none'}}>سجّل شركتك</a>
            </>
          ) : role === 'admin' ? (
            <>
              <a href="/admin" style={{background:'#C8831A',color:'#fff',padding:'10px 20px',borderRadius:'8px',fontSize:'14px',fontWeight:'700',textDecoration:'none'}}>لوحة الأدمن 👑</a>
              <button onClick={handleLogout} style={{background:'transparent',border:'1px solid #E2E8F0',color:'#5A6475',padding:'10px 20px',borderRadius:'8px',fontSize:'14px',fontWeight:'600',cursor:'pointer',fontFamily:'Arial,sans-serif'}}>خروج</button>
            </>
          ) : (
            <>
              <a href="/dashboard" style={{background:'#0D3B5E',color:'#fff',padding:'10px 20px',borderRadius:'8px',fontSize:'14px',fontWeight:'700',textDecoration:'none'}}>حسابي</a>
              <button onClick={handleLogout} style={{background:'transparent',border:'1px solid #E2E8F0',color:'#5A6475',padding:'10px 20px',borderRadius:'8px',fontSize:'14px',fontWeight:'600',cursor:'pointer',fontFamily:'Arial,sans-serif'}}>خروج</button>
            </>
          )}
        </div>
      </nav>

      <div style={{background:'linear-gradient(135deg,#0D3B5E 0%,#0A2A44 60%,#1A5C30 100%)',padding:'80px 5%',textAlign:'center'}}>
        <div style={{display:'inline-block',background:'rgba(200,131,26,.2)',border:'1px solid rgba(200,131,26,.4)',color:'#F5C06A',padding:'6px 16px',borderRadius:'20px',fontSize:'13px',marginBottom:'20px'}}>✦ دليل الأعمال الرائد في المنطقة</div>
        <h1 style={{fontSize:'clamp(28px,5vw,52px)',fontWeight:'800',color:'#fff',marginBottom:'16px',lineHeight:'1.2'}}>JAZ: تواصل مع <span style={{color:'#F5A623'}}>مستقبل جازان</span></h1>
        <p style={{color:'rgba(255,255,255,.7)',fontSize:'18px',marginBottom:'36px'}}>منصتك الذكية للعثور على الشركات والوظائف والفرص في جازان</p>

        <div style={{display:'flex',justifyContent:'center',gap:'0',marginBottom:'16px',maxWidth:'520px',margin:'0 auto 16px'}}>
          <button onClick={()=>setSearchType('companies')} style={{flex:1,padding:'11px',border:'none',borderRadius:'10px 0 0 10px',background:searchType==='companies'?'#C8831A':'rgba(255,255,255,.15)',color:'#fff',fontFamily:'Arial,sans-serif',fontSize:'14px',fontWeight:'700',cursor:'pointer'}}>🏢 شركة</button>
          <button onClick={()=>setSearchType('jobs')} style={{flex:1,padding:'11px',border:'none',borderRadius:'0 10px 10px 0',background:searchType==='jobs'?'#C8831A':'rgba(255,255,255,.15)',color:'#fff',fontFamily:'Arial,sans-serif',fontSize:'14px',fontWeight:'700',cursor:'pointer'}}>💼 وظيفة</button>
        </div>

        <div style={{display:'flex',maxWidth:'520px',margin:'0 auto',background:'#fff',borderRadius:'12px',overflow:'hidden',boxShadow:'0 8px 32px rgba(0,0,0,.3)'}}>
          <input id="searchInput" type="text" placeholder={searchType==='companies'?'ابحث عن شركة...':'ابحث عن وظيفة...'} style={{flex:1,padding:'16px 18px',border:'none',outline:'none',fontSize:'16px',direction:'rtl'}} onKeyDown={(e)=>{ if(e.key==='Enter') handleSearch() }} />
          <button onClick={handleSearch} style={{background:'#C8831A',color:'#fff',border:'none',padding:'14px 22px',fontSize:'15px',fontWeight:'700',cursor:'pointer'}}>🔍 بحث</button>
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',background:'#fff',borderBottom:'1px solid #E2E8F0'}}>
        {[
          {num:`+${totalCompanies}`,label:'شركة مسجّلة'},
          {num:`${Object.keys(categoryCounts).length}`,label:'قطاعاً اقتصادياً'},
          {num:`+${totalJobs}`,label:'وظيفة متاحة'},
          {num:'٩٨٪',label:'رضا المستخدمين'}
        ].map((s,i)=>(
          <div key={i} style={{padding:'24px 16px',textAlign:'center',borderLeft:i<3?'1px solid #E2E8F0':'none'}}>
            <div style={{fontSize:'clamp(22px,4vw,32px)',fontWeight:'800',color:'#0D3B5E'}}>{s.num}</div>
            <div style={{fontSize:'13px',color:'#5A6475',marginTop:'4px'}}>{s.label}</div>
          </div>
        ))}
      </div>

      <section style={{padding:'60px 5%',background:'#F7F8FA'}}>
        <div style={{marginBottom:'36px'}}>
          <div style={{width:'44px',height:'4px',background:'#C8831A',borderRadius:'2px',marginBottom:'12px'}}></div>
          <div style={{fontSize:'12px',color:'#C8831A',fontWeight:'700',letterSpacing:'1px',marginBottom:'8px'}}>القطاعات</div>
          <div style={{fontSize:'clamp(22px,4vw,32px)',fontWeight:'800',color:'#0D3B5E'}}>اكتشف قطاعات جازان</div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(150px,1fr))',gap:'14px'}}>
          {categoryList.map((cat,i)=>(
            <a key={i} href={`/companies?category=${encodeURIComponent(cat.name)}`} style={{background:'#fff',border:'1px solid #E2E8F0',borderRadius:'14px',padding:'24px 14px',textAlign:'center',cursor:'pointer',textDecoration:'none',display:'block',transition:'all .2s'}}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#C8831A'; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(200,131,26,0.15)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
            >
              <div style={{fontSize:'36px',marginBottom:'10px'}}>{cat.icon}</div>
              <div style={{fontSize:'14px',fontWeight:'700',color:'#0D3B5E'}}>{cat.name}</div>
              <div style={{fontSize:'12px',color:'#888',marginTop:'4px'}}>{categoryCounts[cat.name] || 0} شركة</div>
            </a>
          ))}
        </div>
      </section>

      <section style={{background:'linear-gradient(135deg,#0D3B5E,#0A2A44)',padding:'80px 5%',textAlign:'center'}}>
        <h2 style={{fontSize:'clamp(22px,5vw,38px)',fontWeight:'800',color:'#fff',marginBottom:'12px'}}>ابدأ رحلتك مع JAZ اليوم</h2>
        <p style={{color:'rgba(255,255,255,.7)',fontSize:'17px',marginBottom:'36px'}}>سجّل شركتك أو اكتشف وظيفة أحلامك في جازان</p>
        <div style={{display:'flex',gap:'14px',justifyContent:'center',flexWrap:'wrap'}}>
          <a href="/add-company" style={{background:'#C8831A',color:'#fff',textDecoration:'none',padding:'14px 28px',borderRadius:'10px',fontSize:'16px',fontWeight:'700'}}>🏢 سجّل شركتك مجاناً</a>
          <a href="/jobs" style={{background:'transparent',color:'#fff',border:'2px solid rgba(255,255,255,.4)',textDecoration:'none',padding:'14px 28px',borderRadius:'10px',fontSize:'16px',fontWeight:'700'}}>💼 استعرض الوظائف</a>
        </div>
      </section>

      <footer style={{background:'#081522',color:'rgba(255,255,255,.4)',padding:'40px 5% 24px',fontSize:'14px'}}>
        <div style={{maxWidth:'1200px',margin:'0 auto',display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:'30px',marginBottom:'24px'}}>

          <div>
            <div style={{display:'inline-flex',alignItems:'center',background:'#0D3B5E',padding:'8px 18px',borderRadius:'10px',gap:'8px',marginBottom:'10px'}}>
              <span style={{fontSize:'20px',fontWeight:'800',color:'#fff'}}>J</span>
              <span style={{width:'1px',height:'20px',background:'#F5A623'}}></span>
              <span style={{fontSize:'20px',fontWeight:'800',color:'#F5A623'}}>A</span>
              <span style={{width:'1px',height:'20px',background:'#F5A623'}}></span>
              <span style={{fontSize:'20px',fontWeight:'800',color:'#fff'}}>Z</span>
              <span style={{fontSize:'13px',color:'#F5A623',fontWeight:'700',marginRight:'4px'}}>جاز</span>
            </div>
            <p style={{color:'rgba(255,255,255,.5)',fontSize:'13px',lineHeight:'1.7',margin:0}}>
              دليل الأعمال والوظائف في منطقة جازان
            </p>
          </div>

          <div>
            <div style={{color:'#F5A623',fontSize:'14px',fontWeight:'700',marginBottom:'14px'}}>
              تواصل معنا
            </div>
            <a href="mailto:jaz.ceeo99@gmail.com" style={{display:'flex',alignItems:'center',gap:'8px',color:'rgba(255,255,255,.7)',textDecoration:'none',fontSize:'13px',marginBottom:'10px'}}>
              📧 jaz.ceeo99@gmail.com
            </a>
            <a href="tel:0536187768" style={{display:'flex',alignItems:'center',gap:'8px',color:'rgba(255,255,255,.7)',textDecoration:'none',fontSize:'13px'}}>
              📱 0536187768
            </a>
          </div>

          <div>
            <div style={{color:'#F5A623',fontSize:'14px',fontWeight:'700',marginBottom:'14px'}}>
              روابط سريعة
            </div>
            <a href="/companies" style={{display:'block',color:'rgba(255,255,255,.7)',textDecoration:'none',fontSize:'13px',marginBottom:'8px'}}>الشركات</a>
            <a href="/jobs" style={{display:'block',color:'rgba(255,255,255,.7)',textDecoration:'none',fontSize:'13px',marginBottom:'8px'}}>الوظائف</a>
            <a href="/add-company" style={{display:'block',color:'rgba(255,255,255,.7)',textDecoration:'none',fontSize:'13px'}}>سجّل شركتك</a>
          </div>

        </div>

        <div style={{borderTop:'1px solid rgba(255,255,255,.1)',paddingTop:'20px',textAlign:'center'}}>
          <span style={{color:'#F5A623',fontWeight:'700'}}>JAZ جاز</span> © ٢٠٢٥ — جميع الحقوق محفوظة
        </div>
      </footer>
    </main>
  )
}