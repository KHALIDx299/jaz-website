'use client'
import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function SeekersPage() {
  const [formData, setFormData] = useState({
    full_name: '',
    specialization: '',
    experience_years: '',
    phone: '',
    email: '',
    linkedin_url: '',
  })
  const [cvFile, setCvFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  const specializations = [
    'إدارة أعمال',
    'محاسبة ومالية',
    'موارد بشرية',
    'تسويق ومبيعات',
    'تقنية المعلومات والبرمجة',
    'هندسة (جميع التخصصات)',
    'طب وصحة',
    'تعليم وتدريب',
    'قانون',
    'إعلام واتصال',
    'صناعة وإنتاج',
    'نفط وغاز',
    'لوجستيات ونقل',
    'خدمة عملاء',
    'تصميم وإبداع',
    'بناء وإنشاءات',
    'أمن وسلامة',
    'مهن أخرى',
  ]

  const experienceLevels = [
    'خريج جديد (بدون خبرة)',
    'أقل من سنة',
    '1-3 سنوات',
    '3-5 سنوات',
    '5-10 سنوات',
    'أكثر من 10 سنوات',
  ]

  function validateField(name, value) {
    let err = ''

    if (name === 'full_name') {
      if (!value.trim()) err = 'الاسم مطلوب'
      else if (value.trim().length < 5) err = 'الاسم قصير جداً (5 حروف على الأقل)'
      else if (!value.trim().includes(' ')) err = 'اكتب الاسم الكامل (اسم أول + عائلة)'
      else if (/\d/.test(value)) err = 'الاسم لا يحتوي على أرقام'
    }

    if (name === 'phone') {
      const cleaned = value.replace(/\s/g, '')
      if (!cleaned) err = 'رقم الجوال مطلوب'
      else if (!/^\d+$/.test(cleaned)) err = 'الرقم يحتوي أرقام فقط'
      else if (!cleaned.startsWith('05')) err = 'الرقم يبدأ بـ 05'
      else if (cleaned.length !== 10) err = 'الرقم يجب أن يكون 10 أرقام'
    }

    if (name === 'email') {
      if (!value.trim()) err = 'الإيميل مطلوب'
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) err = 'صيغة الإيميل غير صحيحة'
    }

    if (name === 'linkedin_url' && value.trim()) {
      if (!value.includes('linkedin.com')) err = 'رابط لينكدإن غير صحيح'
    }

    if (name === 'specialization' && !value) err = 'اختر التخصص'
    if (name === 'experience_years' && !value) err = 'اختر مستوى الخبرة'

    return err
  }

  function handleChange(e) {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })

    const err = validateField(name, value)
    setFieldErrors({ ...fieldErrors, [name]: err })
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      setError('❌ حجم الملف كبير جداً (الحد الأقصى 5 ميجا)')
      return
    }

    if (file.size < 1024) {
      setError('❌ الملف صغير جداً، تأكد إنه يحتوي على محتوى')
      return
    }

    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    if (!allowedTypes.includes(file.type)) {
      setError('❌ نوع الملف غير مدعوم (PDF أو Word فقط)')
      return
    }

    setCvFile(file)
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    // التحقق من كل الخانات
    const errors = {}
    Object.keys(formData).forEach(key => {
      const err = validateField(key, formData[key])
      if (err) errors[key] = err
    })

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      setError('❌ من فضلك صحّح الأخطاء في النموذج')
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    if (!cvFile) {
      setError('❌ من فضلك ارفع السيرة الذاتية')
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    setLoading(true)

    try {
      const fileExt = cvFile.name.split('.').pop()
      const fileName = `cv-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('cvs')
        .upload(fileName, cvFile)

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage
        .from('cvs')
        .getPublicUrl(fileName)

      const cvUrl = urlData.publicUrl

      const { error: insertError } = await supabase
        .from('job_seekers')
        .insert([{ ...formData, cv_url: cvUrl }])

      if (insertError) throw insertError

      setSuccess(true)
      setFormData({
        full_name: '',
        specialization: '',
        experience_years: '',
        phone: '',
        email: '',
        linkedin_url: '',
      })
      setCvFile(null)
    } catch (err) {
      console.error('Error:', err)
      setError('❌ حدث خطأ: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <main dir="rtl" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0D3B5E 0%, #1A5C30 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'Arial,sans-serif' }}>
        <div style={{ background: '#fff', borderRadius: '20px', padding: '50px 40px', maxWidth: '500px', textAlign: 'center', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>✅</div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#0D3B5E', marginBottom: '16px' }}>تم التسجيل بنجاح!</h1>
          <p style={{ color: '#5A6475', fontSize: '15px', lineHeight: '1.8', marginBottom: '30px' }}>
            شكراً لتسجيلك في JAZ.<br />
            سنشارك سيرتك مع الشركات وشركاء التوظيف، وسنتواصل معك عند توفر فرصة مناسبة 🤝
          </p>
          <a href="/" style={{ display: 'inline-block', background: '#0D3B5E', color: '#fff', padding: '14px 32px', borderRadius: '10px', textDecoration: 'none', fontWeight: '700', fontSize: '15px' }}>
            الرجوع للرئيسية
          </a>
        </div>
      </main>
    )
  }

  return (
    <main dir="rtl" style={{ minHeight: '100vh', background: '#F7F8FA', fontFamily: 'Arial,sans-serif' }}>

      <div style={{ background: 'linear-gradient(135deg, #0D3B5E 0%, #1A5C30 100%)', padding: '50px 5%', color: '#fff', textAlign: 'center' }}>
        <a href="/" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', textDecoration: 'none', display: 'inline-block', marginBottom: '20px' }}>← الرجوع للرئيسية</a>
        <h1 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: '800', margin: '0 0 12px', lineHeight: '1.3' }}>
          👤 باحث عن عمل
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '16px', margin: 0, maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>
          انضم لقاعدة بيانات الباحثين عن عمل في جازان، وسنشاركك مع الشركات وشركاء التوظيف
        </p>
      </div>

      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '40px 5%' }}>
        <form onSubmit={handleSubmit} noValidate style={{ background: '#fff', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>

          {error && (
            <div style={{ background: '#FEF2F2', color: '#991B1B', padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', fontSize: '14px', border: '1px solid #FECACA' }}>
              {error}
            </div>
          )}

          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>الاسم الكامل *</label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              style={getInputStyle(fieldErrors.full_name)}
              placeholder="مثال: خالد محمد العتيبي"
            />
            {fieldErrors.full_name && <div style={errorStyle}>⚠️ {fieldErrors.full_name}</div>}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>التخصص *</label>
            <select name="specialization" value={formData.specialization} onChange={handleChange} style={getInputStyle(fieldErrors.specialization)}>
              <option value="">-- اختر التخصص --</option>
              {specializations.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            {fieldErrors.specialization && <div style={errorStyle}>⚠️ {fieldErrors.specialization}</div>}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>سنوات الخبرة *</label>
            <select name="experience_years" value={formData.experience_years} onChange={handleChange} style={getInputStyle(fieldErrors.experience_years)}>
              <option value="">-- اختر مستوى الخبرة --</option>
              {experienceLevels.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
            {fieldErrors.experience_years && <div style={errorStyle}>⚠️ {fieldErrors.experience_years}</div>}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>رقم الجوال *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              maxLength="10"
              style={getInputStyle(fieldErrors.phone)}
              placeholder="05xxxxxxxx"
            />
            {fieldErrors.phone && <div style={errorStyle}>⚠️ {fieldErrors.phone}</div>}
            <div style={hintStyle}>📌 يبدأ بـ 05 ويتكون من 10 أرقام</div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>البريد الإلكتروني *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={getInputStyle(fieldErrors.email)}
              placeholder="example@email.com"
            />
            {fieldErrors.email && <div style={errorStyle}>⚠️ {fieldErrors.email}</div>}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>رابط لينكدإن (اختياري)</label>
            <input
              type="url"
              name="linkedin_url"
              value={formData.linkedin_url}
              onChange={handleChange}
              style={getInputStyle(fieldErrors.linkedin_url)}
              placeholder="https://linkedin.com/in/your-name"
            />
            {fieldErrors.linkedin_url && <div style={errorStyle}>⚠️ {fieldErrors.linkedin_url}</div>}
            <div style={hintStyle}>📌 يحتوي على linkedin.com</div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={labelStyle}>السيرة الذاتية (PDF أو Word) *</label>
            <div style={{ border: '2px dashed #D1D5DB', borderRadius: '12px', padding: '24px', textAlign: 'center', background: '#F9FAFB' }}>
              <input type="file" id="cv-upload" accept=".pdf,.doc,.docx" onChange={handleFileChange} style={{ display: 'none' }} />
              <label htmlFor="cv-upload" style={{ cursor: 'pointer', display: 'block' }}>
                {cvFile ? (
                  <div>
                    <div style={{ fontSize: '40px', marginBottom: '8px' }}>📄</div>
                    <div style={{ color: '#0D3B5E', fontWeight: '700', fontSize: '14px', wordBreak: 'break-all' }}>{cvFile.name}</div>
                    <div style={{ color: '#888', fontSize: '12px', marginTop: '4px' }}>اضغط لتغيير الملف</div>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontSize: '40px', marginBottom: '8px' }}>📤</div>
                    <div style={{ color: '#0D3B5E', fontWeight: '700', fontSize: '15px' }}>اضغط لرفع السيرة الذاتية</div>
                    <div style={{ color: '#888', fontSize: '12px', marginTop: '4px' }}>PDF أو Word - الحد الأقصى 5 ميجا</div>
                  </div>
                )}
              </label>
            </div>
          </div>

          <button type="submit" disabled={loading} style={{ width: '100%', background: loading ? '#9CA3AF' : 'linear-gradient(135deg, #0D3B5E, #1A5C30)', color: '#fff', padding: '16px', borderRadius: '12px', border: 'none', fontSize: '16px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'Arial,sans-serif' }}>
            {loading ? '⏳ جاري الإرسال...' : '🚀 سجّل الآن'}
          </button>

          <p style={{ textAlign: 'center', color: '#888', fontSize: '12px', marginTop: '16px', lineHeight: '1.6' }}>
            🔐 معلوماتك آمنة ولن تُعرض علناً.<br />
            تُستخدم فقط لمشاركتها مع الشركات وشركاء التوظيف المهتمين بتخصصك.
          </p>

        </form>
      </div>
    </main>
  )
}

const labelStyle = {
  display: 'block',
  marginBottom: '8px',
  color: '#0D3B5E',
  fontSize: '14px',
  fontWeight: '700',
}

const baseInputStyle = {
  width: '100%',
  padding: '12px 16px',
  borderRadius: '10px',
  fontSize: '14px',
  outline: 'none',
  fontFamily: 'Arial,sans-serif',
  direction: 'rtl',
  background: '#fff',
}

function getInputStyle(hasError) {
  return {
    ...baseInputStyle,
    border: hasError ? '2px solid #DC2626' : '1px solid #E2E8F0',
  }
}

const errorStyle = {
  color: '#DC2626',
  fontSize: '12px',
  marginTop: '6px',
  fontWeight: '600',
}

const hintStyle = {
  color: '#888',
  fontSize: '11px',
  marginTop: '4px',
}