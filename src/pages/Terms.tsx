import React from 'react';
import { ScrollText, Gavel, Scale, AlertCircle } from 'lucide-react';

export default function Terms() {
  const sections = [
    { title: "Acceptance of Terms", icon: ScrollText, content: "By accessing and using SkyWay Travel, you agree to be bound by these Terms and Conditions. If you do not agree, please refrain from using our services." },
    { title: "Booking Policies", icon: Gavel, content: "All bookings made through SkyWay are subject to the availability and terms of the respective airlines and hotels. SkyWay acts as an intermediary and is not responsible for provider-side cancellations." },
    { title: "Privacy & Data", icon: Scale, content: "Your data privacy is paramount. By using our platform, you consent to our data collection practices as outlined in our Privacy Policy, optimized for your travel experience." },
    { title: "Liability Limits", icon: AlertCircle, content: "SkyWay is not liable for indirect, incidental, or consequential damages arising from your use of the site or third-party travel providers." }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <section className="bg-muted/30 py-24">
        <div className="container mx-auto px-4 text-center">
          <span className="text-primary font-black uppercase tracking-[0.3em] text-xs mb-4 inline-block italic">Legal Transparency</span>
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter italic leading-none mb-6 italic">Terms of Service</h1>
          <p className="text-muted-foreground text-xl italic max-w-2xl mx-auto">Ensuring a fair and clear relationship between SkyWay and our travelers.</p>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="space-y-16">
            {sections.map((s, i) => (
              <div key={i} className="flex flex-col md:flex-row gap-8 items-start">
                <div className="w-16 h-16 rounded-3xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <s.icon size={32} />
                </div>
                <div>
                  <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-4 italic">{s.title}</h2>
                  <p className="text-muted-foreground text-lg italic leading-relaxed">{s.content}</p>
                </div>
              </div>
            ))}

            <div className="p-12 bg-muted/20 rounded-[40px] border border-border mt-16">
              <h3 className="text-xl font-black uppercase italic tracking-tighter mb-4">Detailed Agreement</h3>
              <p className="text-sm text-muted-foreground italic leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor. Ut in nulla enim. Phasellus molestie magna non est bibendum non venenatis nisl tempor. Suspendisse dictum feugiat nisl ut dapibus. Mauris iaculis porttitor posuere. Praesent id metus massa, ut blandit odio. Proin quis tortor orci. Etiam at risus et justo dignissim congue. Donec congue lacinia dui, a porttitor lectus condimentum laoreet. Nunc sed velit vitae risus euismod lobortis.
              </p>
              <p className="text-sm text-muted-foreground italic leading-relaxed mt-4">
                Last Updated: May 2026. For specific inquiries regarding these terms, please contact legal@skyway.travel.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
