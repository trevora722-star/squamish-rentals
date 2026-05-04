export const metadata = { title: "Privacy policy" };

export default function PrivacyPage() {
  return (
    <article className="space-y-6 text-fg leading-relaxed">
      <h1>Privacy policy</h1>
      <p className="text-sm text-muted-foreground">
        Last updated: 1 May 2026. This is a placeholder document drafted for
        development. Have it reviewed by counsel before launch — privacy law in
        Canada is governed by PIPEDA and provincial PIPA, and the wording
        should reflect your final data-handling practices.
      </p>

      <section>
        <h2>1. What we collect</h2>
        <p>
          We collect information you provide when you book a rental: your name,
          email, phone number, age, driver's license number and province,
          delivery address, and payment details. We also collect chat messages
          you send to our booking assistant. Standard server logs (IP address,
          user agent, timestamp) are retained for security purposes.
        </p>
      </section>

      <section>
        <h2>2. Why we collect it</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>To process your booking and deliver the equipment.</li>
          <li>To verify age and license eligibility at delivery.</li>
          <li>To process payment via Stripe.</li>
          <li>To contact you about your booking and follow up after.</li>
          <li>To improve the chat assistant and our service.</li>
        </ul>
      </section>

      <section>
        <h2>3. Who we share it with</h2>
        <p>
          We share the minimum necessary information with our payment processor
          (Stripe), email provider (Resend), AI provider (Anthropic, for the
          chat assistant), and database provider (Neon). We do not sell, rent,
          or trade your personal information. We disclose information when
          required by law.
        </p>
      </section>

      <section>
        <h2>4. How long we keep it</h2>
        <p>
          Booking records are retained for seven years for tax and insurance
          purposes. Chat transcripts are retained for two years for service
          improvement and dispute resolution. You may request earlier deletion
          by emailing us — see contact below.
        </p>
      </section>

      <section>
        <h2>5. Your rights</h2>
        <p>
          You may request access to, correction of, or deletion of your personal
          information at any time. We respond within thirty days. If we cannot
          comply with a request (for example, where retention is legally
          required), we will explain why.
        </p>
      </section>

      <section>
        <h2>6. Cookies and analytics</h2>
        <p>
          We store a session identifier in your browser's local storage so that
          your conversation with the booking assistant survives a refresh. We
          do not use third-party analytics or advertising cookies.
        </p>
      </section>

      <section>
        <h2>7. Contact</h2>
        <p>
          Privacy questions or requests:{" "}
          <a href="mailto:privacy@squamishadventurerentals.com" className="text-primary underline">
            privacy@squamishadventurerentals.com
          </a>.
        </p>
      </section>
    </article>
  );
}
