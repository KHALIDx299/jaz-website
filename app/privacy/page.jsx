'use client'

export default function PrivacyPage() {
  return (
    <main dir="rtl" style={{minHeight:'100vh', background:'#F7F8FA', fontFamily:'Arial,sans-serif'}}>
      <div style={{background:'linear-gradient(135deg, #0D3B5E 0%, #1A5C30 100%)', padding:'50px 5%', color:'#fff'}}>
        <div style={{maxWidth:'800px', margin:'0 auto'}}>
          <a href="/" style={{color:'rgba(255,255,255,0.8)', fontSize:'14px', textDecoration:'none', display:'inline-block', marginBottom:'16px'}}>← الرجوع للرئيسية</a>
          <h1 style={{fontSize:'clamp(24px,4vw,34px)', fontWeight:'800', margin:0}}>سياسة الخصوصية</h1>
        </div>
      </div>

      <div style={{maxWidth:'800px', margin:'0 auto', padding:'40px 5%'}}>
        <div style={{background:'#fff', borderRadius:'16px', padding:'32px', boxShadow:'0 2px 12px rgba(0,0,0,0.06)', lineHeight:'2', color:'#334155', fontSize:'15px'}}>

          <p style={{marginTop:0, color:'#5A6475', fontSize:'13px'}}>آخر تحديث: مايو 2026</p>

          <p>توضّح سياسة الخصوصية هذه كيفية تعامل منصة JAZ (دليل جازان) مع معلومات زوّارها ومستخدميها. باستخدامك للموقع، فإنك توافق على الممارسات الموضّحة أدناه.</p>

          <h3 style={{color:'#0D3B5E', fontSize:'17px', marginTop:'26px'}}>1. المعلومات التي نجمعها</h3>
          <p>قد نجمع معلومات تقدّمها طوعاً عند تسجيل شركتك أو إضافة وظيفة، مثل: اسم الشركة، البريد الإلكتروني، رقم الهاتف، ووصف النشاط. كما نجمع بيانات تقنية تلقائية مثل نوع المتصفح وصفحات الزيارة لتحسين تجربة الاستخدام.</p>

          <h3 style={{color:'#0D3B5E', fontSize:'17px', marginTop:'26px'}}>2. كيف نستخدم المعلومات</h3>
          <p>نستخدم المعلومات لعرض الشركات والوظائف على المنصة، وتحسين خدماتنا، والتواصل معك عند الحاجة. لا نبيع معلوماتك الشخصية لأي طرف ثالث.</p>

          <h3 style={{color:'#0D3B5E', fontSize:'17px', marginTop:'26px'}}>3. ملفات الارتباط (Cookies)</h3>
          <p>قد يستخدم الموقع ملفات ارتباط لتحسين الأداء وتذكّر تفضيلاتك. يمكنك تعطيلها من إعدادات متصفحك، لكن قد يؤثر ذلك على بعض وظائف الموقع.</p>

          <h3 style={{color:'#0D3B5E', fontSize:'17px', marginTop:'26px'}}>4. خدمات الطرف الثالث</h3>
          <p>قد نستخدم خدمات تحليلية أو إعلانية من أطراف ثالثة (مثل Google) التي قد تستخدم ملفات ارتباط خاصة بها وفقاً لسياسات الخصوصية الخاصة بها.</p>

          <h3 style={{color:'#0D3B5E', fontSize:'17px', marginTop:'26px'}}>5. أمان البيانات</h3>
          <p>نتّخذ إجراءات معقولة لحماية معلوماتك، لكن لا يمكن ضمان الأمان الكامل لأي بيانات تُنقل عبر الإنترنت.</p>

          <h3 style={{color:'#0D3B5E', fontSize:'17px', marginTop:'26px'}}>6. حقوقك</h3>
          <p>يمكنك طلب الاطلاع على معلوماتك أو تعديلها أو حذفها بالتواصل معنا عبر البريد الإلكتروني الموضّح في صفحة "تواصل معنا".</p>

          <h3 style={{color:'#0D3B5E', fontSize:'17px', marginTop:'26px'}}>7. التعديلات</h3>
          <p>قد نحدّث هذه السياسة من وقت لآخر، وسيتم نشر أي تغييرات على هذه الصفحة.</p>

          <div style={{marginTop:'28px', padding:'16px', background:'#F7F8FA', borderRadius:'10px'}}>
            <p style={{margin:0, fontSize:'14px'}}>لأي استفسار حول الخصوصية، تواصل معنا: <a href="mailto:jaz.ceeo99@gmail.com" style={{color:'#C8831A', fontWeight:'700'}}>jaz.ceeo99@gmail.com</a></p>
          </div>

        </div>
      </div>
    </main>
  )
}