'use client'

export default function TermsPage() {
  return (
    <main dir="rtl" style={{minHeight:'100vh', background:'#F7F8FA', fontFamily:'Arial,sans-serif'}}>
      <div style={{background:'linear-gradient(135deg, #0D3B5E 0%, #1A5C30 100%)', padding:'50px 5%', color:'#fff'}}>
        <div style={{maxWidth:'800px', margin:'0 auto'}}>
          <a href="/" style={{color:'rgba(255,255,255,0.8)', fontSize:'14px', textDecoration:'none', display:'inline-block', marginBottom:'16px'}}>← الرجوع للرئيسية</a>
          <h1 style={{fontSize:'clamp(24px,4vw,34px)', fontWeight:'800', margin:0}}>شروط الاستخدام</h1>
        </div>
      </div>

      <div style={{maxWidth:'800px', margin:'0 auto', padding:'40px 5%'}}>
        <div style={{background:'#fff', borderRadius:'16px', padding:'32px', boxShadow:'0 2px 12px rgba(0,0,0,0.06)', lineHeight:'2', color:'#334155', fontSize:'15px'}}>

          <p style={{marginTop:0, color:'#5A6475', fontSize:'13px'}}>آخر تحديث: مايو 2026</p>

          <p>مرحباً بك في منصة JAZ (دليل جازان). باستخدامك لهذا الموقع، فإنك توافق على الالتزام بشروط الاستخدام التالية.</p>

          <h3 style={{color:'#0D3B5E', fontSize:'17px', marginTop:'26px'}}>1. طبيعة الخدمة</h3>
          <p>JAZ منصة رقمية تعرض دليلاً للشركات والوظائف في منطقة جازان. نحن وسيط معلوماتي ولسنا طرفاً في أي تعاقد أو توظيف يتم بين المستخدمين والشركات.</p>

          <h3 style={{color:'#0D3B5E', fontSize:'17px', marginTop:'26px'}}>2. دقة المعلومات</h3>
          <p>نسعى لتقديم معلومات دقيقة، لكننا لا نضمن خلوّها من الأخطاء. المعلومات عن الشركات والوظائف قد تتغيّر، وننصح بالتحقق منها مباشرة مع الجهة المعنية قبل اتخاذ أي قرار.</p>

          <h3 style={{color:'#0D3B5E', fontSize:'17px', marginTop:'26px'}}>3. مسؤولية المستخدم</h3>
          <p>عند إضافة شركة أو وظيفة، أنت مسؤول عن صحة المعلومات المقدّمة وامتلاكك الحق في نشرها. يُمنع نشر أي محتوى مضلل أو مخالف للأنظمة أو ينتهك حقوق الآخرين.</p>

          <h3 style={{color:'#0D3B5E', fontSize:'17px', marginTop:'26px'}}>4. المحتوى والملكية الفكرية</h3>
          <p>تحتفظ JAZ بحقوق التصميم والمحتوى الخاص بها. الشعارات والعلامات التجارية للشركات المعروضة تعود لأصحابها، وتُعرض لأغراض التعريف فقط. إذا كنت صاحب علامة وترغب في إزالتها، تواصل معنا.</p>

          <h3 style={{color:'#0D3B5E', fontSize:'17px', marginTop:'26px'}}>5. روابط الطرف الثالث</h3>
          <p>قد يحتوي الموقع على روابط لمواقع خارجية (مثل منصات التوظيف). لسنا مسؤولين عن محتوى أو سياسات هذه المواقع.</p>

          <h3 style={{color:'#0D3B5E', fontSize:'17px', marginTop:'26px'}}>6. إخلاء المسؤولية</h3>
          <p>تُقدّم الخدمة "كما هي" دون أي ضمانات. لا تتحمّل JAZ المسؤولية عن أي أضرار ناتجة عن استخدام الموقع أو الاعتماد على معلوماته.</p>

          <h3 style={{color:'#0D3B5E', fontSize:'17px', marginTop:'26px'}}>7. التعديلات</h3>
          <p>نحتفظ بحق تعديل هذه الشروط في أي وقت، ويُعدّ استمرارك في استخدام الموقع موافقة على التعديلات.</p>

          <div style={{marginTop:'28px', padding:'16px', background:'#F7F8FA', borderRadius:'10px'}}>
            <p style={{margin:0, fontSize:'14px'}}>لأي استفسار، تواصل معنا: <a href="mailto:jaz.ceeo99@gmail.com" style={{color:'#C8831A', fontWeight:'700'}}>jaz.ceeo99@gmail.com</a></p>
          </div>

        </div>
      </div>
    </main>
  )
}