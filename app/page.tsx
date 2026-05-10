'use client'
import { useState } from 'react'

export default function Home() {
  const [searchType, setSearchType] = useState('companies')

  function handleSearch() {
    const val = (document.getElementById('searchInput') as HTMLInputElement)?.value
    if(val) window.location.href = `/${searchType}?q=${val}`
    else window.location.href = `/${searchType}`
  }

  return (
    <main dir="rtl" style={{fontFamily:'Arial,sans-serif',background:'#F7F8FA',minHeight:'100vh'}}>
      <nav style={{background:'#fff',padding:'16px 5%',display:'flex',justifyContent:'space-between',alignItems:'center',borderBottom:'1px solid #E2E8F0',position:'sticky',top:0,zIndex:100}}>
        <div style={{fontSize:'24px',fontWeight:'800',color:'#0D3B5E'}}>J<span style={{color:'#F5A623'}}>A</span>Z <small style={{fontSize:'14px',color:'#888'}}>جاز</small></div>
        <div style={{display:'flex',gap:'12px',alignItems:'center',flexWrap:'wrap'}}>
          <a href="/companies" style={{color:'#0D3B5E',textDecoration:'none',fontSize:'14px',fontWeight:'600'}}>الشركات</a>
          <a href="/jobs" style={{color:'#0D3B5E',textDecoration:'none',fontSize:'14px',fontWeight:'600'}}>الوظائف</a>
          <a href="/add-company" style={{background:'#0D3B5E',color:'#fff',padding:'10px 20px',borderRadius:'8px',fontSize:'14px',fontWeight:'700',textDecoration:'none'}}>سجّل شركتك</a>
        </div>
      </nav>

      <div style={{background:'linear-gradient(135deg,#0D3B5E 0%,#0A2A44 60%,#1A5C30 100%)',padding:'80px 5%',textAlign:'center'}}>
        <div style={{display:'inline-block',background:'rgba(200,131,26,.2)',border:'1px solid rgba(200,131,26,.4)',color:'#F5C06A',padding:'6px 16px',borderRadius:'20px',fontSize:'13px',marginBottom:'20px'}}>✦ دليل الأعمال الرائد في المنطقة</div>
        <h1 style={{fontSize:'clamp(28px,5vw,52px)',fontWeight:'800',color:'#fff',marginBottom:'16px',lineHeight:'1.2'}}>JAZ: تواصل مع <span style={{color:'#F5A623'}}>مستقبل جازان</span></h1>
        <p style={{color:'rgba(255,255,255,.7)',fontSize:'18px',marginBottom:'36px'}}>منصتك الذكية للعثور على الشركات والوظائف والفرص في جازان</p>

        {/* خانة تحديد نوع البحث */}
        <div style={{display:'flex',justifyContent:'center',gap:'0',marginBottom:'16px',maxWidth:'520px',margin:'0 auto 16px'}}>
          <button onClick={()=>setSearchType('companies')}
            style={{flex:1,padding:'11px',border:'none',borderRadius:'10px 0 0 10px',
              background:searchType==='companies'?'#C8831A':'rgba(255,255,255,.15)',
              color:'#fff',fontFamily:'Arial,sans-serif',fontSize:'14px',fontWeight:'700',cursor:'pointer'}}>
            🏢 شركة
          </button>
          <button onClick={()=>setSearchType('jobs')}
            style={{flex:1,padding:'11px',border:'none',borderRadius:'0 10px 10px 0',
              background:searchType==='jobs'?'#C8831A':'rgba(255,255,255,.15)',
              color:'#fff',fontFamily:'Arial,sans-serif',fontSize:'14px',fontWeight:'700',cursor:'pointer'}}>
            💼 وظيفة
          </button>
        </div>

        <div style={{display:'flex',maxWidth:'520px',margin:'0 auto',background:'#fff',borderRadius:'12px',overflow:'hidden',boxShadow:'0 8px 32px rgba(0,0,0,.3)'}}>
          <input id="searchInput" type="text"
            placeholder={searchType==='companies'?'ابحث عن شركة...':'ابحث عن وظيفة...'}
            style={{flex:1,padding:'16px 18px',border:'none',outline:'none',fontSize:'16px',direction:'rtl'}}
            onKeyDown={(e)=>{ if(e.key==='Enter') handleSearch() }}
          />
          <button onClick={handleSearch} style={{background:'#C8831A',color:'#fff',border:'none',padding:'14px 22px',fontSize:'15px',fontWeight:'700',cursor:'pointer'}}>🔍 بحث</button>
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',background:'#fff',borderBottom:'1px solid #E2E8F0'}}>
        {[{num:'+٢٤٠٠',label:'شركة مسجّلة'},{num:'١٨',label:'قطاعاً اقتصادياً'},{num:'+٨٧٠',label:'وظيفة متاحة'},{num:'٩٨٪',label:'رضا المستخدمين'}].map((s,i)=>(
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
          {[{icon:'☕',name:'الزراعة والبن',count:'٣٨٤'},{icon:'⚡',name:'الطاقة',count:'٢١٧'},{icon:'💻',name:'تقنية المعلومات',count:'١٥٦'},{icon:'🏝',name:'السياحة والجزر',count:'٢٩٤'},{icon:'⚓',name:'الملاحة',count:'١٨٣'},{icon:'🏗',name:'الإنشاء',count:'٣٤١'}].map((cat,i)=>(
            <a key={i} href="/companies" style={{background:'#fff',border:'1px solid #E2E8F0',borderRadius:'14px',padding:'24px 14px',textAlign:'center',cursor:'pointer',textDecoration:'none',display:'block'}}>
              <div style={{fontSize:'36px',marginBottom:'10px'}}>{cat.icon}</div>
              <div style={{fontSize:'14px',fontWeight:'700',color:'#0D3B5E'}}>{cat.name}</div>
              <div style={{fontSize:'12px',color:'#888',marginTop:'4px'}}>{cat.count} شركة</div>
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

      <footer style={{background:'#081522',color:'rgba(255,255,255,.4)',textAlign:'center',padding:'24px',fontSize:'14px'}}>
        <span style={{color:'#F5A623',fontWeight:'700'}}>JAZ جاز</span> © ٢٠٢٥ — جميع الحقوق محفوظة
      </footer>
    </main>
  )
}