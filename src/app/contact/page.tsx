import React from "react";
import { StorefrontHeader } from "@/components/navigation/storefront-header";
import { StorefrontFooter } from "@/components/navigation/storefront-footer";
import { Mail, Phone, MapPin, MessageSquare, Sparkles } from "lucide-react";
import { ContactForm } from "@/components/contact/contact-form";

export const metadata = {
  title: "Support & Atelier Contact | NESTORA",
  description: "Get in touch with NESTORA artisan curators, bespoke inquiries, and customer concierge.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-background text-foreground">
      <StorefrontHeader />

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="space-y-4 mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
            <MessageSquare className="w-3.5 h-3.5" />
            Concierge & Care
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
            Contact the Atelier
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl">
            Whether you have questions about materials, care instructions, or bespoke custom commissions, our studio team is here to assist.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Contact Details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-2xl border border-border bg-card/60 space-y-6">
              <h2 className="font-serif text-lg font-bold text-foreground">Atelier Inquiries</h2>
              
              <div className="space-y-4 text-xs sm:text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Email Concierge</p>
                    <p className="text-muted-foreground text-xs mt-0.5">concierge@nestora-atelier.com</p>
                    <p className="text-[11px] text-muted-foreground">Typical response within 4 business hours</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Telephone Support</p>
                    <p className="text-muted-foreground text-xs mt-0.5">+1 (415) 890-4281</p>
                    <p className="text-[11px] text-muted-foreground">Monday – Friday, 9:00 AM – 6:00 PM PST</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Physical Showroom & Studio</p>
                    <p className="text-muted-foreground text-xs mt-0.5">482 Jackson Street, Suite 300</p>
                    <p className="text-muted-foreground text-xs">San Francisco, CA 94111</p>
                  </div>
                </div>
              </div>

              {/* Demo note */}
              <div className="pt-4 border-t border-border flex items-center gap-2 text-[11px] text-muted-foreground">
                <Sparkles className="w-3.5 h-3.5 text-primary shrink-0" />
                <span>Simulated contact information for demonstration purposes.</span>
              </div>
            </div>
          </div>

          {/* Contact Message Form */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-2xl border border-border bg-card space-y-5 shadow-xs">
              <h2 className="font-serif text-lg font-bold text-foreground">Send a Direct Message</h2>
              <p className="text-xs text-muted-foreground">
                Leave your note and our curator team will reply promptly to your registered email.
              </p>

              <ContactForm />
            </div>
          </div>
        </div>
      </main>

      <StorefrontFooter />
    </div>
  );
}
