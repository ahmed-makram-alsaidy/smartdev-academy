import { NextResponse } from 'next/server';

// هذا الملف يعمل كسيرفر مصغر لإرسال الإيميلات
export async function POST(request) {
  try {
    const { name, email, message } = await request.json();

    // استدعاء API الخاص بـ Resend
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer re_QJBa7AZT_5peDNad3XuVcgirJk5W1xocS`, // المفتاح الخاص بك
      },
      body: JSON.stringify({
        from: 'onboarding@resend.dev', // استخدم هذا للإرسال المجاني
        to: 'delivered@resend.dev', // في الوضع المجاني، يرسل فقط لنفس الإيميل المسجل. غيره لإيميلك الحقيقي بعد توثيق الدومين
        subject: `رسالة جديدة من: ${name}`,
        html: `
          <div style="font-family: sans-serif; dir: rtl; text-align: right;">
            <h2>📬 رسالة تواصل جديدة من منصة SmartDev</h2>
            <p><strong>الاسم:</strong> ${name}</p>
            <p><strong>البريد:</strong> ${email}</p>
            <hr />
            <p><strong>الرسالة:</strong></p>
            <p style="background: #f4f4f4; padding: 15px; border-radius: 8px;">${message}</p>
          </div>
        `,
      }),
    });

    if (res.ok) {
      return NextResponse.json({ success: true });
    } else {
      const errorData = await res.json();
      return NextResponse.json({ success: false, error: errorData }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
