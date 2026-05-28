'use client'
import { useState } from 'react'

export default function ContactPage() {
  const [sent, setSent] = useState(false)

  return (
    <main dir="rtl" style={{minHeight:'100vh', background:'#F7F8FA', fontFamily:'Arial,sans-serif'}}>
      <div style={{background:'linear-gradient(135deg, #0D3B5E 0%, #1A5C30 100%)', padding:'50px 5%', color:'#fff'}}>
        <div style={{maxWidth:'800px', margin:'0 auto'}}>
          <a href="/" style={{color:'rgba(255,255,255,0.8)', fontSize:'14px', textDecoration:'none', display:'inline-block', marginBottom:'16px'}}>← الرجوع للرئيسية</a>
          <h1 style={{fontSize:'clamp(26px,4vw,38px)', fontWeight:'800', margin:0}}>تواصل معنا</h1>
        </div>
      </div>

      <div style={{maxWidth:'800px', margin:'0 auto', padding:'40px 5%'}}>
        <div style={{background:'#fff', borderRadius:'16px', padding:'32px', boxShadow:'0 2px 12px rgba(0,0,0,0.06)'}}>

          <p style={{color:'#334155', fontSize:'16px', lineHeight:'1.8', marginTop:0}}>
            يسعدنا تواصلك معنا! سواء عندك استفسار، اقتراح، أو ترغب في إضافة شركتك، نحن هنا لمساعدتك.
          </p>

          <div style={{display:'grid', gap:'16px', marginTop:'24px'}}>
            <a href="mailto:jaz.ceeo99@gmail.com" style={{display:'flex', alignItems:'center', gap:'14px', background:'#F7F8FA', padding:'18px', borderRadius:'12px', textDecoration:'none', color:'#0D3B5E'}}>
              <span style={{fontSize:'28px'}}>📧</span>
              <div>
                <div style={{fontSize:'13px', color:'#5A6475'}}>البريد الإلكتروني</div>
                <div style={{fontSize:'16px', fontWeight:'700'}}>jaz.ceeo99@gmail.com</div>
              </div>
            </a>

            <a href="tel:0536187768" style={{display:'flex', alignItems:'center', gap:'14px', background:'#F7F8FA', padding:'18px', borderRadius:'12px', textDecoration:'none', color:'#0D3B5E'}}>
              <span style={{fontSize:'28px'}}>📱</span>
              <div>
                <div style={{fontSize:'13px', color:'#5A6475'}}>الجوال</div>
                <div style={{fontSize:'16px', fontWeight:'700', direction:'ltr'}}>0536187768</div>
              </div>
            </a>

            <a href="https://wa.me/966536187768" target="_blank" style={{display:'flex', alignItems:'center', gap:'14px', background:'#E8F5E9', padding:'18px', borderRadius:'12px', textDecoration:'none', color:'#1A5C30'}}>
              <span style={{fontSize:'28px'}}>💬</span>
              <div>
                <div style={{fontSize:'13px', color:'#2E7D32'}}>واتساب</div>
                <div style={{fontSize:'16px', fontWeight:'700'}}>راسلنا مباشرة</div>
              </div>
            </a>
          </div>

          <div style={{marginTop:'28px', padding:'18px', background:'#FFF8E7', borderRadius:'12px', border:'1px solid #F5D08F'}}>
            <p style={{margin:0, fontSize:'14px', color:'#92400E'}}>
              📍 منطقة جازان، المملكة العربية السعودية
            </p>
          </div>

        </div>
      </div>
    </main>
  )
}