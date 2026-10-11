import { CONTACT } from "./content";

/**
 * The legal documents bundled with the app.
 *
 * Each one describes how the product actually behaves: supervisor-routed private
 * offers, a fixed doer payout, anonymity in both directions, and release of money
 * only after the approval gate. Change the product and the matching section here
 * has to change with it.
 *
 * Two copy rules bite hardest in this file, and check:copy enforces both: the money
 * held before release sits in a company account and is never described with the
 * regulated-holding word, and there are no em dashes.
 */

export type LegalKind = "terms" | "privacy" | "allowed-work" | "payouts" | "grievance";

export interface LegalDocument {
  kind: LegalKind;
  version: string;
  title: string;
  content: string;
  effectiveAt: string | null;
}

/** Order here is the order of the tabs on the legal page and the buttons in the footer. */
export const LEGAL_PAGES: { kind: LegalKind; label: string }[] = [
  { kind: "terms", label: "Terms and Conditions" },
  { kind: "privacy", label: "Privacy Policy" },
  { kind: "allowed-work", label: "Allowed Work" },
  { kind: "payouts", label: "Payouts and Tax" },
  { kind: "grievance", label: "Grievances" },
];

export function isLegalKind(value: string | undefined): value is LegalKind {
  return LEGAL_PAGES.some((page) => page.kind === value);
}

// "draft" stays in the version until counsel has signed the text off.
const VERSION = "draft-2026-10-11";
const EFFECTIVE_AT = "2026-10-11T00:00:00.000Z";
const OPERATOR = `${CONTACT.company}, ${CONTACT.jurisdiction}`;

const TERMS = `# In short

- Dolancer sends you project offers through a supervisor. You do not bid, and you do not deal with the client.
- Every offer shows the work, the deadline and your payout before you accept. You are free to leave any offer.
- Once you accept, you do the work yourself, on time and inside the agreed scope.
- You are paid after the work clears review and approval. Any tax the law requires is deducted and shown to you.
- You work as an independent professional, not as an employee.

The sections below are the full terms.

# 1. Who we are and what these terms cover

Dolancer is a managed work service operated by ${OPERATOR} ("Dolancer", "we", "us"). These terms apply to anyone who creates a Dolancer account to take on project work (a "doer", "you").

By creating an account you agree to these terms and to the Privacy Policy, the Allowed Work rules, the Payouts and Tax policy and the Grievances process, which form part of them.

# 2. How Dolancer works

Clients bring projects to us. A supervisor on our team confirms the scope, sets the deadline and the doer payout, and sends the project as a private offer to doers whose verified skills fit it. Dolancer is not an open marketplace. There is no bidding, no proposal writing and no public list of clients.

You work with your supervisor only. The client does not receive your name, contact details or verification documents through the normal workflow. In the same way, you do not receive the client's identity or the price the client pays.

# 3. Who can join

- You must be at least 18 years old and legally able to enter a contract where you live.
- You may hold one account, in your own name, with accurate and current information.
- You choose your country when you set up your account. It sets your currency, tax handling and time zone, and you cannot change it yourself afterwards. Contact support if it was set wrongly.

We may refuse, suspend or close an account where that is needed for safety, fraud prevention, legal compliance or quality, or because these terms were broken.

# 4. Signing in and keeping your account safe

You sign in with a one-time code or link sent to your email address. There is no password to remember, so the security of your email account is the security of your Dolancer account. You are responsible for activity on your account. Tell us at once if you think someone else has access to it.

# 5. Verification before you earn

You can explore your account before you are verified. You cannot accept an offer or receive a payout until the readiness steps shown in your dashboard are complete, such as identity verification, payout details and your skill selection.

Verification needs a government photo identity document, a photo of you and the UPI ID or bank account where you want to be paid. Everything you submit must belong to you and be genuine, current and readable. Being verified does not guarantee that offers will be sent to you.

# 6. Offers

- An offer is private to you. It shows the category, the brief, the deadline and your payout before tax.
- You can accept an offer or leave it. Accepting is your decision every time.
- Until you accept, an offer can be withdrawn, can expire or can be given to another doer.
- The number of projects you can hold at once is limited. The current limit is shown in your dashboard. When your slots are full you cannot accept a new offer until one finishes.
- You can turn your availability off at any time to stop receiving offers.
- You must not pass an offer to another person, share it or subcontract it without our written permission.

# 7. Doing the work

When you accept an offer you agree to deliver the stated scope by the stated deadline.

- Do the work yourself.
- Work in the company workspace your supervisor shares, such as a document, design file or repository, and not in a personal account. Work starts once that link appears on the project.
- Keep project conversation in the project chat with your supervisor. A file sent in chat is not a submission. Submit from the project page.
- Raise anything unclear early. Work outside the accepted scope needs your supervisor's written agreement before you start it.
- Use only material, software and assets you have the right to use for the project.

# 8. Review, changes and approval

Your supervisor reviews what you submit for completeness, quality, originality and fit with the brief. If changes are needed inside the accepted scope, you revise and resubmit within a reasonable time.

Once your supervisor clears the work it is delivered to the client. The project is approved when the client approves it or when the approval period ends without a response. Supervisor clearance on its own does not release a payout.

If a project is cancelled after you delivered work that met the brief, you are still paid for that work. If it is cancelled before you finish, your supervisor will tell you what happens next and what is due for the work already done.

# 9. Payout and tax

Your payout for a project is the amount shown in the offer you accepted, less any tax the law requires us to withhold. It is released after approval to the payout account you registered. The Payouts and Tax policy sets out the timing, holds, tax and corrections in full.

# 10. Quality ratings and levels

Supervisors rate delivered work. Your ratings feed your level, and your level can affect which offers reach you and how early. Levels can move up or down as your record changes. You must not try to influence a rating by any means other than the quality of your work.

# 11. Referrals

If someone joins with your invite code and has their first project approved, you earn the referral bonus shown on your referral page at that time. The bonus is credited to your balance, paid with your next payout and treated as earnings for tax.

A bonus gained through fake accounts, self-referral or any misuse will be cancelled. We may change or end the referral programme. A bonus already earned stays payable.

# 12. Your relationship with Dolancer

You are an independent professional. Nothing in these terms makes you an employee, agent or partner of Dolancer. You decide which offers to accept, and where, when and with what tools you work. You are responsible for your own taxes, registrations, equipment and insurance. Dolancer does not promise any minimum amount of work or income.

# 13. Confidentiality and identity protection

Keep every brief, file, working link and message confidential, during the project and after it. Do not try to identify or contact a client or another doer. Do not put your own contact details in project chat or in a deliverable. If a brief or a file reveals who the client is, tell your supervisor and do not use that information.

Project messages may be checked, including by automated means, for contact details and identity information. Do not place identity documents, payment secrets or unnecessary personal data in project chat. No online service can promise absolute security.

# 14. Ownership of the work

You keep ownership of your existing materials, methods and tools. When the payout for a project is released, you transfer the rights in the final deliverables that the accepted offer states. You must not include third-party material unless you have the right to use and transfer it for that purpose.

You must not show project work in a portfolio or in public unless your supervisor confirms in writing that you may.

# 15. Things you must not do

- Take on work that the Allowed Work rules prohibit.
- Go around your supervisor, or deal with a client outside Dolancer.
- Submit work that is not your own, or misstate how it was produced.
- Hold more than one account, or let another person use yours.
- Manipulate ratings, progress, referral or payout records.
- Probe, scrape, overload or interfere with the platform or its security.
- Harass, threaten or discriminate against anyone you deal with through Dolancer.

# 16. Suspension and closing your account

We may pause offers, hold a payout while we look into a concern, suspend an account or close it where these terms are broken, where fraud is suspected, where deadlines or quality fail repeatedly, or where the law requires it. Where we can, we will tell you the reason.

You can ask support to close your account. Projects you have accepted must be finished or handed back first. Work that was completed and approved before closure stays payable, subject to the usual verification, review and tax checks. The sections on confidentiality, ownership, payment and disputes continue after an account closes.

# 17. Changes to the service

Dolancer may change, pause or become unavailable for maintenance, safety, legal or operational reasons. We do not promise uninterrupted access or any number of offers.

# 18. Responsibility and limits

You are responsible for loss caused by your breach of these terms, including a claim that work you delivered was copied or used material you had no right to use.

To the extent the law allows, Dolancer is not liable for indirect loss, lost profit or lost opportunity. Our total liability to you in connection with a project is limited to the unpaid payout for that project. Nothing in these terms limits a liability that the law does not allow to be limited.

# 19. Changes to these terms

We may update these terms. Each version is published with its version label and effective date. We will tell you in the app or by email before a change that materially affects you takes effect. Using Dolancer after that date means you accept the new version.

# 20. Law and disputes

Contact support first. If the matter is not resolved, use the Grievances process. These terms are governed by the laws of India. Subject to that process, the courts with jurisdiction in ${CONTACT.jurisdiction} will hear any dispute.

# 21. Contact

Dolancer is operated by ${OPERATOR}. Support: ${CONTACT.email}, open ${CONTACT.hours}. Grievances: ${CONTACT.grievanceEmail}.`;

const PRIVACY = `# In short

- We collect what we need to run your account, verify you, send you work and pay you.
- A client never receives your name, contact details or identity documents through the normal workflow.
- Identity documents are stored encrypted and deleted once your identity is confirmed.
- We do not sell your data, and this site runs no advertising or analytics trackers.
- You can ask to see, correct or delete your data by writing to ${CONTACT.email}.

The sections below are the full policy.

# 1. Who is responsible

Dolancer is operated by ${OPERATOR}, which decides how the personal data described here is used. Privacy questions: ${CONTACT.email}. Grievances: ${CONTACT.grievanceEmail}.

# 2. What we collect

- Account: your email address, sign-in records and security events.
- Profile: your full name, country, confirmation that you are 18 or older, the skills you select, your availability, ratings and level.
- Verification: a government photo identity document (PAN card, passport, driving licence or Aadhaar), a photo of you, tax details such as your PAN where the law needs them, and your payout details (a UPI ID, or a bank account number and IFSC code).
- Work: the offers sent to you, the projects you accept, working links, progress, submissions, files, review outcomes and your project chat with your supervisor, including attachments.
- Money: payouts, tax withheld, referral bonuses and the ledger behind your earnings page.
- Referrals: your invite code and which accounts joined with it.
- Support: tickets and emails you send us.
- Technical: device and browser details, IP address, and logs of errors and security events.

# 3. Why we use it

We use this information to create and secure your account, confirm your age and identity, match offers to your skills, run projects, review work, pay you, withhold and report tax as the law requires, prevent fraud and abuse, answer support requests, keep the service reliable and meet our legal duties.

We do not use identity documents to build a public profile, and we do not use your data for advertising.

# 4. What supervisors and clients see

Supervisors and authorised Dolancer staff see what they need to route, review and support your work. Access is limited by role, and you can read only your own records.

A client receives the finished work and a discipline label. A client does not receive your name, contact details or verification documents through the normal workflow.

Project chat is between you and your supervisor. Messages may be checked, including by automated means, for contact details and identity information, because the service depends on neither side being identified to the other.

# 5. Identity documents and payout details

Identity documents are stored encrypted under a random reference, never under your name. They are deleted once your identity is confirmed. Only an irreversible hash is kept afterwards, solely to stop a removed account from signing up again. The original document cannot be rebuilt from it.

Your full bank account number is not stored by Dolancer. It is exchanged for a token with our payments provider, and we keep only a masked version so you can recognise the account.

# 6. Who we share it with

We share personal data only with providers that help us run the service, and only as far as each task needs:

- Supabase, for the database, sign-in and file storage.
- Vercel, for hosting this website.
- Cloudflare Turnstile, where enabled, to tell people from bots at sign-in and on support forms.
- Google Fonts, which delivers the typeface and so receives your IP address.
- Unsplash, which serves some photos on the home page and so receives your IP address.
- Our payments provider, to verify payout accounts and send payouts.
- Our email provider, to send sign-in codes and service messages.

We may also disclose information to an authority, court or professional adviser where the law requires it, to protect someone's safety or rights, or as part of a business transfer. We never sell personal data.

# 7. Cookies and browser storage

This site does not use advertising or analytics cookies. It stores a small amount of data in your browser to keep you signed in and to remember interface preferences such as the sidebar state. The bot check may set its own storage to do its job. Blocking browser storage will stop sign-in from working.

If we add analytics later, we will update this policy first and ask for consent where the law requires it.

# 8. How long we keep it

- Identity documents: until your identity is confirmed, then deleted as described in section 5.
- Account and profile: for as long as your account is open.
- Projects, submissions and project chat: while your account is open, and afterwards for as long as they are needed to handle disputes, quality questions and legal claims.
- Payout, tax and ledger records: for the period that tax and accounting law requires.
- Support tickets: for as long as they are needed to resolve the matter and keep a record of it.

When a period ends we delete the data or make it anonymous.

# 9. Security

We use role-based access, least-privilege service credentials, encrypted connections, restricted storage and audit logs. No service is completely secure. If an incident affects your personal data we will assess it and give the notices the law requires.

# 10. Your choices and rights

Depending on the law that applies to you, you can ask us to show you the personal data we hold, correct it, delete it or stop using it, and you can withdraw a consent you gave. You can also close your account.

Write to ${CONTACT.email} from your account email and say what you are asking for. We may need to confirm your identity first. We may keep information that the law, security, accounting or an open dispute requires us to keep. If you are unhappy with our answer, use the Grievances process. You may also complain to the data protection authority that covers you.

# 11. Children

Dolancer is for adults. We do not knowingly open an account for anyone under 18. If you believe a minor has given us information, contact us so we can remove it.

# 12. Processing outside your country

Some of our providers process data outside the country you live in. Where that happens we rely on the safeguards the law requires for that transfer.

# 13. Changes and contact

We will update this policy when our use of data changes or when the law requires it, and publish the new version with its effective date. Dolancer is operated by ${OPERATOR}. Privacy questions: ${CONTACT.email}. Grievances: ${CONTACT.grievanceEmail}.`;

const ALLOWED_WORK = `# In short

- Dolancer is for honest professional work that the person paying for it is entitled to commission.
- We do not take academic work that will be graded in someone else's name.
- We do not take work meant to deceive people, break the law or cause harm.
- If a brief looks wrong, stop and tell your supervisor before you do anything else.

The sections below are the full rules.

# 1. What Dolancer is for

Offers on Dolancer cover writing and content, design, creative and media work, IT and software, AI agents and automations, marketing, and research and business work. Every project has a brief, a deadline and a fixed doer payout, and a supervisor reviews the result before it is delivered.

# 2. Work we do not accept

Academic work and impersonation:

- Coursework, essays, dissertations, theses, exams, graded assignments or anything else submitted for academic credit in another person's name.
- Sitting a test, interview or certification as someone else.

Dishonest work:

- Plagiarism, or passing off existing work as new.
- Fabricated or falsified research, data, results or citations.
- Fake reviews, testimonials, ratings, followers or engagement.
- Forged documents, or content built to mislead the people who will read it.

Unlawful or harmful work:

- Accessing a system, account or data without the owner's written authorisation, including unauthorised security testing.
- Malware, or tools made to get around security, licensing or access controls.
- Pirated or unlicensed material, or copies of protected work.
- Fraud, money laundering or any other unlawful financial activity.
- Harassment, hate, threats or discrimination.
- Any sexual content involving a minor.
- Anything illegal where the client is or where you are.

Regulated advice:

- Legal, medical, financial or tax advice that needs a licence, unless the work is properly authorised and the brief says so.

# 3. How the work must be done

- Do it yourself. Do not subcontract or share it.
- Deliver original work, and use only material you have the right to use.
- If the brief restricts the use of AI tools, follow it. Never misstate how a piece of work was produced.
- Stay inside the brief. Agree extra work with your supervisor in writing before you start it.
- Keep everything in the project chat and the project page. Do not contact a client, and do not arrange work or payment outside Dolancer.

# 4. If a brief looks wrong

Do not start, or stop if you have started. Tell your supervisor in the project chat, or write to ${CONTACT.email}. We will look at the brief and withdraw it if it breaks these rules. Reporting a doubtful brief in good faith never counts against you.

# 5. If these rules are broken

We may remove the work, cancel the project, withhold the payout for that work, and suspend or close the account involved. Where the law requires it, we report the matter to the authorities.`;

const PAYOUTS = `# In short

- Your payout is fixed and shown in the offer before you accept it.
- It is released after your supervisor clears the work and the client approval step is complete.
- It goes to the UPI ID or bank account you registered.
- Tax the law requires is deducted, and you always see gross, tax withheld and net as separate figures.

The sections below are the full policy.

# 1. Your payout amount

Each offer shows your payout before tax. That is the amount you are working for. It does not change after you accept unless the scope changes and your supervisor confirms a new amount in writing. You do not see the price the client pays.

# 2. When a payout is released

A payout moves through these steps:

- You submit the work from the project page.
- Your supervisor reviews it. If changes are needed, you revise and resubmit.
- Your supervisor clears it and it is delivered to the client.
- The client approves it, or the approval period ends without a response.
- The payout is released to you.

Nothing is released for work that is still in review or awaiting approval. Because the time each step takes depends on the review, the client and the banking system, Dolancer does not promise a fixed number of days unless your offer states one.

# 3. How the money reaches you

Payouts are sent by UPI or bank transfer to the payout account you registered and verified. The account must be in your own name. The methods open to you may depend on your country, which also sets your currency.

If a payout fails, for example because the account details are wrong or your bank rejects it, we will tell you. Correct the details and we will send it again.

# 4. Tax

Where the law requires it, we deduct tax at source before paying you and report it to the tax authority. The rate depends on the law and on the tax details you gave us. If your PAN is missing or invalid, the law may require a higher rate.

Your earnings page shows gross payout, tax withheld and net payout as separate figures, with an itemised receipt for every payout, so you can check each one against your own records.

You are responsible for your own tax returns and for any registration your earnings require. Dolancer does not give tax advice.

# 5. When a payout is held

We may hold a payout while any of these is unresolved:

- Your identity or payout account is not yet verified.
- A fraud, security or legal check is open.
- The work is disputed, or we are checking it against the Allowed Work rules.
- The law requires a hold.

We will tell you the reason unless the law stops us, and release the payout once the matter is resolved.

# 6. Where the money sits before release

Until a payout is released, the money for a project is held by Dolancer in its own company account. Dolancer is not a bank or a trustee, and a balance shown in your account does not earn interest.

# 7. Referral bonuses

A referral bonus is credited to your balance when the person you invited has their first project approved. It is paid with your next payout and is treated as earnings for tax, the same as project work.

# 8. Corrections

If a payout is made by mistake or in the wrong amount, we may correct it, including by adjusting a later payout. A payout obtained through fraud or a serious breach of the Allowed Work rules may be recovered.

# 9. Questions about a payout

Start with your earnings page, where every payout is itemised. If something does not match, raise a support ticket from your account or write to ${CONTACT.email} with the project and the amount. If that does not settle it, use the Grievances process.`;

const GRIEVANCE = `# In short

- Start with support. Most things are solved there, and it is open ${CONTACT.hours}.
- If support has not solved it, write to our grievance officer at ${CONTACT.grievanceEmail}.
- We acknowledge a grievance within 24 hours and aim to resolve it within 15 days.

The sections below are the full process.

# 1. Step one: support

Raise a ticket from your account, or write to ${CONTACT.email}. Give your account email, the project it concerns if there is one, and what happened. Support is open ${CONTACT.hours}.

# 2. Step two: the grievance officer

If support has not resolved the matter, or it is serious enough that it should not wait, write to ${CONTACT.grievanceEmail}. Include:

- Your account email.
- The project or payout it concerns, if any.
- What happened, and when.
- What you have already tried with support.
- The outcome you are asking for.

Attach anything that helps, such as screenshots or receipts. Do not send identity documents by email.

# 3. What happens next

We acknowledge a grievance within 24 hours. A person who was not involved in the original decision looks at it. We aim to give you a final answer, with our reasons, within 15 days. If we need longer, we will tell you why and when to expect the answer.

# 4. What you can raise

- A payout that is late, held, wrong or failed.
- A verification decision.
- A review outcome or a quality rating you believe is unfair.
- A suspension or the closure of your account.
- The conduct of a supervisor or of support.
- A brief you believe breaks the Allowed Work rules.
- How your personal data has been used.

# 5. Complaints about personal data

Use the same address. You can ask what data we hold, ask us to correct or delete it, or tell us you object to how it is used. The Privacy Policy explains your rights. You may also complain to the data protection authority that covers you.

# 6. Raising a grievance is safe

A grievance raised in good faith does not affect the offers you receive, your level or your payouts.

# 7. If you are still not satisfied

You keep every remedy the law gives you. The Terms and Conditions set out the governing law and the courts that hear disputes.`;

export const LOCAL_DOCUMENTS: Record<LegalKind, LegalDocument> = {
  terms: { kind: "terms", version: VERSION, title: "Terms and Conditions", effectiveAt: EFFECTIVE_AT, content: TERMS },
  privacy: { kind: "privacy", version: VERSION, title: "Privacy Policy", effectiveAt: EFFECTIVE_AT, content: PRIVACY },
  "allowed-work": { kind: "allowed-work", version: VERSION, title: "Allowed Work", effectiveAt: EFFECTIVE_AT, content: ALLOWED_WORK },
  payouts: { kind: "payouts", version: VERSION, title: "Payouts and Tax", effectiveAt: EFFECTIVE_AT, content: PAYOUTS },
  grievance: { kind: "grievance", version: VERSION, title: "Grievances", effectiveAt: EFFECTIVE_AT, content: GRIEVANCE },
};
