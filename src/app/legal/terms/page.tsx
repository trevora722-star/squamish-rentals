export const metadata = { title: "Terms of service" };

export default function TermsPage() {
  return (
    <article className="space-y-6 text-fg leading-relaxed">
      <h1>Terms of service</h1>
      <p className="text-sm text-muted-foreground">
        Last updated: 1 May 2026. This is a placeholder document drafted for
        development. The final version should be reviewed by a lawyer licensed
        in British Columbia before launch.
      </p>

      <section>
        <h2>1. Who we are</h2>
        <p>
          Squamish Adventure Rentals ("we," "us," "our") is a sole-proprietorship
          based in Squamish, British Columbia. By using this website or booking
          a rental, you ("the customer," "you") agree to these terms.
        </p>
      </section>

      <section>
        <h2>2. Eligibility</h2>
        <p>
          You must be at least 19 years of age and hold a valid driver's license
          to rent or operate any vehicle in our fleet. The same age and license
          requirements apply to passengers on two-up machines. We verify ID at
          delivery; if you cannot produce valid ID, the rental will not proceed
          and the booking is non-refundable.
        </p>
      </section>

      <section>
        <h2>3. Bookings, holds, and payment</h2>
        <p>
          A booking is created when you confirm a quote. The booking goes into a
          15-minute hold while you complete payment via the secure Stripe
          Checkout link we provide. If the payment is not completed within the
          hold window, the hold is released and the booking is cancelled
          automatically.
        </p>
        <p>
          A refundable damage deposit is pre-authorized on your card before
          delivery. Pre-authorization amounts are disclosed in the quote. The
          deposit is released back to your card after the equipment is
          inspected and confirmed undamaged on return.
        </p>
      </section>

      <section>
        <h2>4. Modifications and cancellations</h2>
        <p>
          Free changes are allowed up to 48 hours before your trip start. Inside
          48 hours, modifications are subject to availability and a $50 change
          fee. Cancellations within 48 hours are 50% refundable; within 24
          hours, non-refundable. We reserve the right to cancel or reschedule
          for safety reasons (severe weather, road closures, mechanical issues)
          with a full refund or no-cost reschedule at your option.
        </p>
      </section>

      <section>
        <h2>5. Use of equipment</h2>
        <p>
          You agree to operate rented equipment in a safe and responsible
          manner, on public lands or private property where you have explicit
          permission to ride. Operation under the influence of alcohol or drugs
          is strictly prohibited and will result in immediate termination of
          the rental and forfeiture of payment and deposit.
        </p>
      </section>

      <section>
        <h2>6. Liability</h2>
        <p>
          Off-road riding carries inherent risk. Each customer signs a separate
          rental waiver before delivery; please review the
          {" "}
          <a href="/legal/waiver" className="text-primary underline">rental waiver</a>{" "}
          for the full liability terms.
        </p>
      </section>

      <section>
        <h2>7. Damage and recovery</h2>
        <p>
          The customer is responsible for any damage to rented equipment beyond
          ordinary wear and tear, up to the value of the damage deposit. Damage
          beyond the deposit amount may be billed to the customer at cost. If
          recovery from a remote location is required, recovery costs are billed
          to the customer at our cost.
        </p>
      </section>

      <section>
        <h2>8. Governing law</h2>
        <p>
          These terms are governed by the laws of the Province of British
          Columbia and the federal laws of Canada applicable therein.
        </p>
      </section>

      <section>
        <h2>9. Contact</h2>
        <p>
          Questions about these terms? Email{" "}
          <a href="mailto:hello@squamishadventurerentals.com" className="text-primary underline">
            hello@squamishadventurerentals.com
          </a>.
        </p>
      </section>
    </article>
  );
}
