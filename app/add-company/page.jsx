'use client'
import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function AddCompany() {
  const [form, setForm] = useState({
    name: '', category: '', description: '',
    location: '', phone: '', email: '', website: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const categories = [
    'الزراعة والبن', 'الطاقة والبتروكيماويات',
    'تقنية المعلومات', 'السياحة والجزر',
    'الملاحة واللوجستيات', 'الإنشاء والبنية التحتية'
  ]

  async function handleSubmit() {
    if (!form.name || !form.category) {
      alert('يرجى إدخال اسم الشركة والقطاع')
      return
    }
    setLoading(true)
    const { error } = await supabase.from('companies').insert([form])
    setLoading(false)
    if (error) { alert('حدث خطأ: ' + error.message); return }
    setSuccess(true)
    setForm({ name: '', category: '', description: '', location: '', phone: '', email: '', website: '' })
  }

  return (
    <main dir="rtl" style={{ fontFamily: 'Arial, sans-serif', background: '#F7F8FA', minHeight: '100vh', padding: '40px 5%' }}>
      
      {/* HEADER */}
      <div style={{ marginBottom: '32px' }}>
        <a href="/" style={{ color: '#0D3B5E', textDecoration: 'none', fontSize: '14px' }}>← العودة للرئيسية</a>
        <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#0D3B5E', marginTop: '12px' }}>سجّل شركتك في JAZ</h1>
        <p style={{ color: '#5A6475', marginTop: '8px' }}>أضف شركتك لدليل جازان الأعمال مجاناً</p>
      </div>

      {success && (
        <div style={{ background: '#E8F5EE', border: '1px solid #2D8C4E', borderRadius: '12px', padding: '20px', marginBottom: '24px', color: '#1A5C30', fontWeight: '700', fontSize: '16px' }}>
          🎉 تم تسجيل شركتك بنجاح! ستظهر في الدليل قريباً.
        </div>
      )}

      <div style={{ background: '#fff', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,.08)', maxWidth: '640px' }}>
        
        {/* اسم الشركة */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontWeight: '700', color: '#1A1F2E', marginBottom: '8px' }}>اسم الشركة *</label>
          <input
            value={form.name}
            onChange={e => setForm({...form, name: e.target.value})}
            placeholder="مثال: شركة جازان للطاقة"
            style={{ width: '100%', padding: '12px 16px', border: '1px solid #E2E8F0', borderRadius: '10px', fontSize: '15px', direction: 'rtl', outline: 'none' }}
          />
        </div>

        {/* القطاع */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontWeight: '700', color: '#1A1F2E', marginBottom: '8px' }}>القطاع *</label>
          <select
            value={form.category}
            onChange={e => setForm({...form, category: e.target.value})}
            style={{ width: '100%', padding: '12px 16px', border: '1px solid #E2E8F0', borderRadius: '10px', fontSize: '15px', direction: 'rtl', outline: 'none', background: '#fff' }}
          >
            <option value="">اختر القطاع</option>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>

        {/* الوصف */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontWeight: '700', color: '#1A1F2E', marginBottom: '8px' }}>وصف الشركة</label>
          <textarea
            value={form.description}
            onChange={e => setForm({...form, description: e.target.value})}
            placeholder="اكتب نبذة مختصرة عن شركتك..."
            rows={3}
            style={{ width: '100%', padding: '12px 16px', border: '1px solid #E2E8F0', borderRadius: '10px', fontSize: '15px', direction: 'rtl', outline: 'none', resize: 'vertical' }}
          />
        </div>

        {/* الموقع */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontWeight: '700', color: '#1A1F2E', marginBottom: '8px' }}>الموقع</label>
          <input
            value={form.location}
            onChange={e => setForm({...form, location: e.target.value})}
            placeholder="مثال: جازان الاقتصادية"
            style={{ width: '100%', padding: '12px 16px', border: '1px solid #E2E8F0', borderRadius: '10px', fontSize: '15px', direction: 'rtl', outline: 'none' }}
          />
        </div>

        {/* رقم الجوال */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontWeight: '700', color: '#1A1F2E', marginBottom: '8px' }}>رقم الجوال</label>
          <input
            value={form.phone}
            onChange={e => setForm({...form, phone: e.target.value})}
            placeholder="05xxxxxxxx"
            style={{ width: '100%', padding: '12px 16px', border: '1px solid #E2E8F0', borderRadius: '10px', fontSize: '15px', direction: 'rtl', outline: 'none' }}
          />
        </div>

        {/* البريد الإلكتروني */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontWeight: '700', color: '#1A1F2E', marginBottom: '8px' }}>البريد الإلكتروني</label>
          <input
            value={form.email}
            onChange={e => setForm({...form, email: e.target.value})}
            placeholder="info@company.com"
            style={{ width: '100%', padding: '12px 16px', border: '1px solid #E2E8F0', borderRadius: '10px', fontSize: '15px', direction: 'rtl', outline: 'none' }}
          />
        </div>

        {/* زر الإرسال */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{ width: '100%', background: loading ? '#999' : '#0D3B5E', color: '#fff', border: 'none', padding: '16px', borderRadius: '12px', fontSize: '17px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer' }}
        >
          {loading ? 'جاري التسجيل...' : '🏢 سجّل شركتك مجاناً'}
        </button>
      </div>
    </main>
  )
}