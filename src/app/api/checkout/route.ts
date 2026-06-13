import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { getStripe } from "@/lib/stripe";
import { TIERS, EXPIRY_DAYS, validateSalaryForTier } from "@/lib/constants";
import { Tier } from "@/lib/types";

// POST /api/checkout — saves a paid listing as 'awaiting_payment', then returns
// a Stripe Checkout URL. The job is only published (→ 'pending' for admin review)
// after payment is confirmed (see /api/checkout/confirm).
export async function POST(req: NextRequest) {
  const body = await req.json();
  const tier = body.tier as Tier;

  if (tier !== "standard" && tier !== "premium") {
    return NextResponse.json({ error: "Paid checkout is only for standard or premium." }, { status: 400 });
  }

  const salaryError = validateSalaryForTier(tier, parseInt(body.salaryMin) || 0, parseInt(body.salaryMax) || 0);
  if (salaryError) {
    return NextResponse.json({ error: salaryError }, { status: 400 });
  }

  const now = new Date();
  const id = `job-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const approvalToken = crypto.randomUUID();
  const expiresAt = new Date(now.getTime() + EXPIRY_DAYS * 24 * 60 * 60 * 1000).toISOString();

  const row = {
    id,
    poster_name: body.posterName,
    poster_email: body.posterEmail,
    company_name: body.companyName,
    company_logo: body.companyLogo || "",
    company_website: body.companyWebsite || "",
    title: body.title,
    department: body.department,
    location: body.location,
    location_type: body.locationType,
    role_level: body.roleLevel,
    salary_min: parseInt(body.salaryMin) || 0,
    salary_max: parseInt(body.salaryMax) || 0,
    description: body.description,
    requirements: body.requirements || "",
    external_apply_url: body.externalApplyUrl || "",
    tier,
    status: "awaiting_payment",
    flagged_for_newsletter: tier === "premium",
    approval_token: approvalToken,
    created_at: now.toISOString(),
    expires_at: expiresAt,
  };

  const { error } = await getSupabase().from("jobs").insert(row);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const origin = new URL(req.url).origin;

  const session = await getStripe().checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `GOOD THINKING Jobs — ${TIERS[tier].name} listing`,
            description: `${body.title} at ${body.companyName}`,
          },
          unit_amount: TIERS[tier].price * 100,
        },
        quantity: 1,
      },
    ],
    customer_email: body.posterEmail,
    metadata: { jobId: id },
    success_url: `${origin}/post?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/post?canceled=1`,
  });

  return NextResponse.json({ url: session.url });
}
