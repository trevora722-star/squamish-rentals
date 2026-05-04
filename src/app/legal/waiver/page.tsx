export const metadata = { title: "Rental waiver" };

export default function WaiverPage() {
  return (
    <article className="space-y-6 text-fg leading-relaxed">
      <h1>Rental waiver</h1>
      <p className="text-sm text-muted-foreground">
        Last updated: 1 May 2026. This is a placeholder waiver drafted for
        development. The final version must be reviewed by a lawyer licensed in
        British Columbia. Adventure-tourism waivers in BC are subject to
        specific drafting and presentation requirements; do not use this in
        production without legal review.
      </p>

      <section>
        <h2>Acknowledgement of risk</h2>
        <p>
          I acknowledge that operating an all-terrain vehicle is an inherently
          dangerous activity that can result in property damage, serious bodily
          injury, or death, including (but not limited to) injuries from
          collisions, rollovers, mechanical failure, animal encounters,
          adverse weather, and hazards of the natural terrain. I have been
          made aware of these risks and choose to participate voluntarily.
        </p>
      </section>

      <section>
        <h2>Fitness to ride</h2>
        <p>
          I confirm that I am at least nineteen (19) years of age, hold a
          valid driver's license, and am physically and mentally fit to
          operate the rented equipment. I confirm I am not under the influence
          of alcohol or any substance that would impair my ability to ride
          safely. I will refuse the rental at delivery if any of these change.
        </p>
      </section>

      <section>
        <h2>Use of safety equipment</h2>
        <p>
          I agree to wear, at all times while the vehicle is in motion, the
          DOT-rated helmet, eye protection, and gloves provided to me. I agree
          to wear closed-toe footwear that covers the ankle, long pants, and
          a long-sleeved upper layer.
        </p>
      </section>

      <section>
        <h2>Operating restrictions</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>I will not operate the vehicle on a public highway.</li>
          <li>I will not operate the vehicle in a provincial park where ATV use is prohibited.</li>
          <li>I will not enter private property without the landowner's permission.</li>
          <li>I will not allow a person under 19 years of age to operate the vehicle.</li>
          <li>I will not modify, disable, or tamper with any safety system on the vehicle.</li>
        </ul>
      </section>

      <section>
        <h2>Release and indemnity</h2>
        <p>
          To the fullest extent permitted by law, I release Squamish Adventure
          Rentals, its owners, employees, and contractors from all claims of
          loss, damage, or injury arising out of my use of the rented equipment,
          except those arising from gross negligence or wilful misconduct. I
          agree to indemnify Squamish Adventure Rentals against any claim
          brought by a third party arising from my use of the equipment.
        </p>
      </section>

      <section>
        <h2>Damage</h2>
        <p>
          I am responsible for damage to the rented equipment beyond ordinary
          wear and tear, up to the value of the damage deposit. Damage in
          excess of the deposit may be billed to me at cost.
        </p>
      </section>

      <section>
        <h2>Signature</h2>
        <p>
          By signing the digital waiver presented at delivery, or by physically
          signing a paper copy, I confirm that I have read and understood this
          waiver and agree to be bound by its terms.
        </p>
      </section>
    </article>
  );
}
