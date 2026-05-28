'use client'

export default function AboutPage() {
  return (
    <main dir="rtl" style={{minHeight:'100vh', background:'#F7F8FA', fontFamily:'Arial,sans-serif'}}>
      <div style={{background:'linear-gradient(135deg, #0D3B5E 0%, #1A5C30 100%)', padding:'50px 5%', color:'#fff'}}>
        <div style={{maxWidth:'800px', margin:'0 auto'}}>
          <a href="/" style={{color:'rgba(255,255,255,0.8)', fontSize:'14px', textDecoration:'none', display:'inline-block', marginBottom:'16px'}}>← الرجوع للرئيسية</a>
          <h1 style={{fontSize:'clamp(26px,4vw,38px)', fontWeight:'800', margin:0}}>من نحن</h1>
        </div>
      </div>

      <div style={{maxWidth:'800px', margin:'0 auto', padding:'40px 5%'}}>
        <div style={{background:'#fff', borderRadius:'16px', padding:'32px', boxShadow:'0 2px 12px rgba(0,0,0,0.06)', lineHeight:'2', color:'#334155', fontSize:'16px'}}>

          <h2 style={{color:'#0D3B5E', fontSize:'22px', marginTop:0}}>منصة JAZ - دليل جازان</h2>
          <p>
            JAZ هي المنصة الرقمية الأولى المتخصصة في ربط الشركات والباحثين عن العمل في منطقة جازان. نهدف إلى أن نكون الدليل الشامل والموثوق للأعمال والفرص الوظيفية في المنطقة.
          </p>

          <h3 style={{color:'#0D3B5E', fontSize:'18px', marginTop:'28px'}}>🎯 رؤيتنا</h3>
          <p>
            أن نكون البوابة الرقمية الرائدة التي تعزّز النمو الاقتصادي في منطقة جازان، من خلال تسهيل التواصل بين الشركات والكفاءات الوطنية.
          </p>

          <h3 style={{color:'#0D3B5E', fontSize:'18px', marginTop:'28px'}}>💡 رسالتنا</h3>
          <p>
            توفير منصة سهلة الاستخدام تجمع الشركات والوظائف في مكان واحد، ودعم رواد الأعمال والباحثين عن عمل في جازان للوصول إلى الفرص المناسبة.
          </p>

          <h3 style={{color:'#0D3B5E', fontSize:'18px', marginTop:'28px'}}>✨ ماذا نقدّم؟</h3>
          <p>
            دليل شامل لأكثر من 60 شركة في مختلف القطاعات (الطاقة، تقنية المعلومات، الزراعة، السياحة، الملاحة، الإنشاء)، بالإضافة إلى أحدث الوظائف الشاغرة من مصادر موثوقة، وكل ذلك بشكل مجاني تماماً.
          </p>

          <h3 style={{color:'#0D3B5E', fontSize:'18px', marginTop:'28px'}}>🌍 لماذا جازان؟</h3>
          <p>
            جازان منطقة استراتيجية واعدة، تضم مدينة جازان للصناعات الأساسية والتحويلية، ومشاريع طاقة عملاقة، وثروات زراعية وسياحية مميزة. نؤمن أنها تستحق منصة رقمية تليق بإمكانياتها.
          </p>

          <div style={{marginTop:'32px', padding:'20px', background:'#F7F8FA', borderRadius:'12px', textAlign:'center'}}>
            <p style={{margin:'0 0 16px', fontWeight:'700', color:'#0D3B5E'}}>انضم إلينا اليوم</p>
            <a href="/add-company" style={{background:'#C8831A', color:'#fff', textDecoration:'none', padding:'12px 28px', borderRadius:'10px', fontWeight:'700', display:'inline-block'}}>سجّل شركتك مجاناً</a>
          </div>

        </div>
      </div>
    </main>
  )
}