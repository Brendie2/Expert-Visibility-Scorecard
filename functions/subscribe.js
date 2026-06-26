const https = require('https');

// ══════════════════════════════════════════════
// CONFIG
// ══════════════════════════════════════════════
const BREVO_API_KEY = process.env.BREVO_API_KEY;
const FROM_EMAIL    = 'unapologeticquenn@gmail.com';
const FROM_NAME     = 'Brenda Blanche';
const CLARITY_LINK  = 'https://calendly.com/unapologeticquenn/brand-clarity-call';
const SUBSTACK_URL  = 'https://brendablanche.substack.com';

// ══════════════════════════════════════════════
// ARCHETYPE DATA — full content for PDF email
// ══════════════════════════════════════════════
const ARCHETYPES = {
  PersonalBrandCelebrity: {
    name:       'Personal Brand Celebrity',
    combo:      'Identity Only · No Expertise · No Structure',
    headline:   'You\'re recognisable. You\'re not yet trusted.',
    verdict:    'Your Identity is working — people know you exist and feel your energy. The problem is that recognition without expertise and structure is celebrity, not authority. The market will follow you for free indefinitely. It needs a reason to pay.',
    cost:       'You get engagement without revenue. You feel busy without feeling paid. Your audience size doesn\'t match your income.',
    signs:      ['You get "This is so relatable" instead of "How do I hire you?"', 'Your audience grows but your client list doesn\'t move at the same pace.', 'You\'re afraid that if you go deeper, you\'ll lose the following you\'ve built.'],
    nextPhase:  'Phase 04 — Authority Conversion™',
    phaseBody:  'Before more content, build the proof. Name your process. Create one proprietary framework that shows what your thinking produces — not just how your thinking feels.',
    move:       'Turn your point of view into a process',
    steps:      ['Pick one transformation you help people make — even informally.', 'Write out the 3–4 steps you take to get them there. Name each step.', 'That is your methodology. Package it. Name the whole thing. Make it visible. Identity without expertise is a personality. Identity with expertise is an authority.']
  },
  HiddenExpert: {
    name:       'Hidden Expert',
    combo:      'Expertise Only · No Identity · No Structure',
    headline:   'You\'re capable. You\'re completely invisible.',
    verdict:    'Your expertise is real — possibly the strongest in the room. But expertise alone does not create market demand. The market cannot pay for what it cannot find, understand, or trust. You have everything you need to be the Obvious Choice™. The market simply cannot see it yet.',
    cost:       'You rely entirely on word of mouth. Growth is inconsistent, unpredictable, and exhausting. Less capable people with louder brands are winning clients you should have.',
    signs:      ['Less experienced competitors are getting the opportunities you deserve.', 'You\'ve been told you should charge more — but you can\'t seem to make it stick.', 'You keep waiting for the right person to discover you instead of making yourself discoverable.'],
    nextPhase:  'Phase 01 — Identity Signal™',
    phaseBody:  'Start with the lens. What do you see that others in your field miss? That singular perspective — made clear and repeatable — is the foundation of every other step.',
    move:       'Make one thing about you unmissable',
    steps:      ['Write one belief about your industry that most people won\'t say out loud.', 'In one sentence: "Most people think [X]. I believe [Y]. That\'s why I help [Z] do [A]."', 'Post that one sentence publicly today. Not a thread. Not an essay. One statement. See what moves.']
  },
  EfficientOperator: {
    name:       'Efficient Operator',
    combo:      'Structure Only · No Identity · No Expertise',
    headline:   'You\'re busy. You\'re not compounding.',
    verdict:    'Structure is your strength — and that is rare. But structure amplifies whatever is underneath it. Without a clear Identity and proven Expertise, your system is distributing noise consistently. The market can see you. It simply has no reason to choose you.',
    cost:       'You put in the work and get inconsistent returns. You\'ve optimised the how without clarifying the why and the who.',
    signs:      ['Your metrics are consistent but your revenue isn\'t growing proportionally.', 'You can describe your process but not your point of view.', 'Your content gets seen but rarely converts to real conversations.'],
    nextPhase:  'Phase 01 — Identity Signal™',
    phaseBody:  'Before your next post, answer this: what do you believe about your market that most people in your space refuse to say? That answer becomes your signal.',
    move:       'Add a point of view to the system you already have',
    steps:      ['Pull up your last 5 pieces of content. Ask: what position does each one take?', 'Find the one with the sharpest opinion. That\'s your benchmark.', 'Rewrite every future piece to match that benchmark — not just information, but a position. Systems without signal are invisible. Yours doesn\'t have to be.']
  },
  RecognizedExpert: {
    name:       'Recognized Expert',
    combo:      'Identity + Expertise · Missing Structure',
    headline:   'You\'re valued. You\'re not yet scalable.',
    verdict:    'Your Identity is clear and your Expertise is real. That combination earns deep trust from everyone who encounters you. The constraint is that the market can only encounter you by accident. Without Structure, demand depends on referrals, timing, and luck — none of which compound.',
    cost:       'Your growth has plateaued. You have case studies but no system to deploy them. You have a strong reputation in a small circle and no engine to expand it.',
    signs:      ['You get great referrals but can\'t predict when the next one arrives.', 'Your best clients found you through someone who happened to mention your name.', 'You know you should be doing more — you just don\'t know what to systematise first.'],
    nextPhase:  'Phase 03 — Content Distribution™',
    phaseBody:  'You have the Identity and the proof. Now build the engine that makes strangers encounter both — repeatedly, consistently, and without you having to be in the room every time.',
    move:       'Build one asset that works when you don\'t',
    steps:      ['Take your strongest case study — the one clients mention most.', 'Turn it into a piece of public content: a post, a breakdown, a before/after.', 'Add one clear, frictionless next step at the end. That\'s your Structure starting. One asset at a time.']
  },
  OperationalValueExpert: {
    name:       'Operational Value Expert',
    combo:      'Expertise + Structure · Missing Identity',
    headline:   'You deliver. The market commoditises you.',
    verdict:    'This is the most frustrating archetype — because the work is real and the results are real. But without a distinctive Identity, the market has no anchor to choose you over alternatives. It defaults to price. You are not a commodity. You are an expert without a signal. Fix the signal.',
    cost:       'You price-match competitors who do less. You win clients who leave the moment someone cheaper appears. You work harder than you should for the revenue you\'re generating.',
    signs:      ['Price is always the first objection in your sales conversations.', 'Clients appreciate your work but couldn\'t articulate what makes you uniquely irreplaceable.', 'You feel like you could charge more — and privately worry you\'d lose clients if you did.'],
    nextPhase:  'Phase 01 — Identity Signal™',
    phaseBody:  'Your expertise is not in question. Your signal is. One clear, repeatable point of view — communicated consistently — is the difference between a service provider and an authority.',
    move:       'Name the thing only you see',
    steps:      ['List three things you notice about client problems that others in your field consistently miss.', 'Pick the most uncomfortable one — the one you\'re slightly nervous to say publicly.', 'Build your next three pieces of content around that observation. Differentiation is not about being different. It\'s about being specifically right in a way others aren\'t.']
  },
  VisiblePersonality: {
    name:       'Visible Personality',
    combo:      'Identity + Structure · Missing Expertise',
    headline:   'You\'re visible. You\'re not yet proven.',
    verdict:    'Your Identity is clear and your Structure is working — two of the three IES forces. The conversion gap is a trust gap. The market is watching and enjoying you, but it hasn\'t seen enough evidence that you can deliver on what you promise.',
    cost:       'Engagement is high. Revenue is inconsistent. Something is missing between "they love my content" and "they pay me."',
    signs:      ['You get more "love this!" than "how do I work with you?"', 'When people do buy, they feel surprised by the depth — like they expected less.', 'You haven\'t made your proof as visible as your personality.'],
    nextPhase:  'Phase 04 — Authority Conversion™',
    phaseBody:  'The audience is ready. Now give them the evidence. Case studies, frameworks, before-and-afters — proof assets that make paying you feel like the obvious next step, not a leap of faith.',
    move:       'Make your proof as visible as your personality',
    steps:      ['Identify one client transformation you\'ve created. Write it as a before/after: where they started, what changed, where they are now.', 'Post it. Not as a brag. As evidence of what\'s possible.', 'Do this once a week. Your personality got them curious. Your proof earns the sale.']
  },
  ObviousChoice: {
    name:       'Obvious Choice™',
    combo:      'Identity + Expertise + Structure · All Three Aligned',
    headline:   'You\'re the category. Now scale it.',
    verdict:    'You have achieved what most experts never reach: full IES alignment. Your Identity signals clearly, your Expertise proves the promise, and your Structure delivers both consistently. The market does not have to be convinced to choose you. It simply has to encounter you.',
    cost:       'There is no translation gap to close here. The work now is to protect the alignment you\'ve built, deepen the authority, and expand without losing the clarity that got you here.',
    signs:      ['Inbound enquiries are consistent and increasing without proportional effort.', 'Discovery calls close at a higher rate with significantly less selling.', 'You\'ve been able to raise prices without losing the clients you actually want.'],
    nextPhase:  'Monetization™ — Optimise and Expand',
    phaseBody:  'With all three IES forces aligned, your next move is to deepen the offer architecture and build the systems that scale your demand without scaling your hours.',
    move:       'Protect the alignment. Expand the reach.',
    steps:      ['Audit your last 10 client wins: what brought each of them to you? Amplify that mechanism.', 'Identify the next adjacent audience that has the same problem — but doesn\'t know you exist yet.', 'Build one new authority asset designed to reach them. Your system is proven. Now extend it.']
  }
};

// ══════════════════════════════════════════════
// ZONE NAME
// ══════════════════════════════════════════════
function getZoneName(mts) {
  if (mts <= 20)  return 'Invisible Expert™';
  if (mts <= 40)  return 'Emerging Expert™';
  if (mts <= 60)  return 'Recognized Expert™';
  if (mts <= 80)  return 'Visible Authority™';
  return 'Obvious Choice™';
}

// ══════════════════════════════════════════════
// SCORE BAR HTML — inline for email
// ══════════════════════════════════════════════
function scoreBar(label, score, isGap) {
  const pct   = score + '%';
  const color = isGap ? '#ff0013' : '#4a4a6a';
  return `
    <tr>
      <td style="font-family:'DM Sans',Arial,sans-serif;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:${isGap ? '#ffffff' : '#888888'};padding:10px 0 4px;font-weight:${isGap ? '600' : '400'};">${label}</td>
      <td style="text-align:right;font-family:'DM Sans',Arial,sans-serif;font-size:12px;color:${isGap ? '#ff0013' : '#555555'};font-weight:600;padding:10px 0 4px;">${score}</td>
    </tr>
    <tr>
      <td colspan="2" style="padding:0 0 14px;">
        <div style="background:#1e1e2e;height:4px;border-radius:2px;">
          <div style="background:${isGap ? 'linear-gradient(90deg,#ff0013,#c9a84c)' : color};height:4px;border-radius:2px;width:${pct};"></div>
        </div>
      </td>
    </tr>`;
}

// ══════════════════════════════════════════════
// BUILD HTML EMAIL
// ══════════════════════════════════════════════
function buildEmailHTML(name, archetype, mts, iScore, eScore, sScore) {
  const r       = ARCHETYPES[archetype] || ARCHETYPES['HiddenExpert'];
  const zone    = getZoneName(mts);
  const minScore = Math.min(iScore, eScore, sScore);
  const iGap    = (iScore === minScore) && archetype !== 'ObviousChoice';
  const eGap    = (eScore === minScore) && !iGap && archetype !== 'ObviousChoice';
  const sGap    = (sScore === minScore) && !iGap && !eGap && archetype !== 'ObviousChoice';

  const steps = r.steps.map((s, i) =>
    `<tr><td style="padding:0 0 12px;"><table width="100%" cellpadding="0" cellspacing="0"><tr>
      <td width="28" valign="top" style="font-family:'DM Sans',Arial,sans-serif;font-size:11px;color:#c9a84c;font-weight:700;padding-top:2px;">0${i+1}</td>
      <td style="font-family:'DM Sans',Arial,sans-serif;font-size:14px;color:#cccccc;line-height:1.65;">${s}</td>
    </tr></table></td></tr>`).join('');

  const signs = r.signs.map(s =>
    `<tr><td style="padding:0 0 10px;"><table width="100%" cellpadding="0" cellspacing="0"><tr>
      <td width="20" valign="top" style="font-family:Arial,sans-serif;font-size:12px;color:#ff0013;padding-top:1px;">→</td>
      <td style="font-family:'DM Sans',Arial,sans-serif;font-size:14px;color:#aaaaaa;line-height:1.6;">${s}</td>
    </tr></table></td></tr>`).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Your Market Translation Report™ — Brenda Blanche</title>
</head>
<body style="margin:0;padding:0;background:#010313;font-family:'DM Sans',Arial,sans-serif;">

<!-- WRAPPER -->
<table width="100%" cellpadding="0" cellspacing="0" style="background:#010313;">
<tr><td align="center" style="padding:40px 20px;">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

  <!-- HEADER -->
  <tr><td style="background:#010313;border-bottom:3px solid #ff0013;padding:32px 40px 24px;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="font-family:'DM Sans',Arial,sans-serif;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:#c9a84c;">Brenda Blanche™ · The Unapologetics</td>
        <td align="right" style="font-family:'DM Sans',Arial,sans-serif;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#444455;">Market Translation Report™</td>
      </tr>
    </table>
  </td></tr>

  <!-- HERO -->
  <tr><td style="background:#0a0a1a;padding:48px 40px 40px;">
    <p style="font-family:'DM Sans',Arial,sans-serif;font-size:12px;letter-spacing:0.2em;text-transform:uppercase;color:#555566;margin:0 0 12px;">Your personalised diagnosis</p>
    <h1 style="font-family:Georgia,serif;font-size:36px;font-weight:700;color:#f5f0eb;line-height:1.1;letter-spacing:-0.02em;margin:0 0 8px;">Hi ${name}.</h1>
    <h2 style="font-family:Georgia,serif;font-size:28px;font-weight:400;font-style:italic;color:#ff0013;line-height:1.2;margin:0 0 24px;">${r.headline.replace(/<em>/g,'').replace(/<\/em>/g,'')}</h2>
    <p style="font-family:'DM Sans',Arial,sans-serif;font-size:15px;line-height:1.75;color:#888899;margin:0;">${r.verdict}</p>
  </td></tr>

  <!-- SCORES -->
  <tr><td style="background:#05051a;padding:32px 40px;border-top:1px solid #1a1a2e;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="font-family:'DM Sans',Arial,sans-serif;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#555566;padding-bottom:20px;">Your IES scores</td>
        <td align="right" style="padding-bottom:20px;">
          <span style="font-family:Georgia,serif;font-size:42px;font-weight:700;color:#f5f0eb;letter-spacing:-0.03em;">${mts}</span>
          <span style="font-family:'DM Sans',Arial,sans-serif;font-size:13px;color:#555566;margin-left:4px;">/ 100</span>
        </td>
      </tr>
      <tr><td colspan="2">
        <p style="font-family:'DM Sans',Arial,sans-serif;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#c9a84c;margin:0 0 12px;">Market Translation Score™ · ${zone}</p>
      </td></tr>
      ${scoreBar('Identity', iScore, iGap)}
      ${scoreBar('Expertise', eScore, eGap)}
      ${scoreBar('Structure', sScore, sGap)}
    </table>
  </td></tr>

  <!-- ARCHETYPE -->
  <tr><td style="background:#0d0d20;padding:32px 40px;border-top:1px solid #1a1a2e;">
    <p style="font-family:'DM Sans',Arial,sans-serif;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#555566;margin:0 0 8px;">Your expert archetype</p>
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="background:#ff0013;padding:10px 20px;display:inline-block;">
          <span style="font-family:'DM Sans',Arial,sans-serif;font-size:12px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:#f5f0eb;">${r.name.toUpperCase()}</span>
        </td>
      </tr>
    </table>
    <p style="font-family:'DM Sans',Arial,sans-serif;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#ff0013;margin:14px 0 10px;">${r.combo}</p>
    <p style="font-family:Georgia,serif;font-size:16px;font-style:italic;color:#888899;border-left:2px solid rgba(255,0,19,0.3);padding-left:16px;margin:0 0 16px;line-height:1.6;">${r.combo.includes('Only') || r.combo.includes('Missing') ? '"' + (r.signs[0] || '') + '"' : r.signs[0]}</p>
    <p style="font-family:'DM Sans',Arial,sans-serif;font-size:14px;line-height:1.75;color:#aaaaaa;margin:0;">${r.phaseBody}</p>
  </td></tr>

  <!-- COST -->
  <tr><td style="background:#0a0014;padding:32px 40px;border-top:1px solid rgba(255,0,19,0.15);border-left:3px solid #ff0013;">
    <p style="font-family:'DM Sans',Arial,sans-serif;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(255,0,19,0.7);margin:0 0 12px;">What this gap is costing you right now</p>
    <p style="font-family:'DM Sans',Arial,sans-serif;font-size:14px;line-height:1.8;color:#aaaaaa;margin:0 0 20px;">${r.cost}</p>
    <table width="100%" cellpadding="0" cellspacing="0">
      ${signs}
    </table>
  </td></tr>

  <!-- NEXT PHASE -->
  <tr><td style="background:#05051a;padding:32px 40px;border-top:1px solid #1a1a2e;">
    <p style="font-family:'DM Sans',Arial,sans-serif;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#c9a84c;margin:0 0 6px;">Your next phase</p>
    <p style="font-family:Georgia,serif;font-size:20px;font-weight:700;color:#f5f0eb;margin:0 0 12px;">${r.nextPhase}</p>
    <p style="font-family:'DM Sans',Arial,sans-serif;font-size:14px;line-height:1.75;color:#aaaaaa;margin:0;">${r.phaseBody}</p>
  </td></tr>

  <!-- IMMEDIATE MOVE -->
  <tr><td style="background:#0a0a1a;padding:32px 40px;border-top:1px solid #1a1a2e;">
    <p style="font-family:'DM Sans',Arial,sans-serif;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#c9a84c;margin:0 0 6px;">Your immediate move</p>
    <p style="font-family:Georgia,serif;font-size:18px;font-weight:700;color:#f5f0eb;margin:0 0 20px;">${r.move}</p>
    <table width="100%" cellpadding="0" cellspacing="0">
      ${steps}
    </table>
  </td></tr>

  <!-- CTA — CLARITY CALL -->
  <tr><td style="background:#0d0520;padding:40px;border-top:1px solid #1a1a2e;">
    <p style="font-family:'DM Sans',Arial,sans-serif;font-size:13px;line-height:1.8;color:#888899;margin:0 0 24px;text-align:center;">
      This report shows you what your gap is.<br>
      A Clarity Call shows you exactly how to close it — for your specific situation, your specific market, your specific expertise.
    </p>
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr><td align="center">
        <a href="${CLARITY_LINK}" style="display:inline-block;background:#ff0013;color:#f5f0eb;font-family:'DM Sans',Arial,sans-serif;font-size:12px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;padding:18px 40px;text-decoration:none;position:relative;">
          Book Your Free Clarity Call →
        </a>
      </td></tr>
      <tr><td align="center" style="padding-top:12px;">
        <p style="font-family:'DM Sans',Arial,sans-serif;font-size:12px;color:#444455;margin:0;">30 minutes. Free. For the people whose gap is painful enough that they don't want to figure it out alone.</p>
      </td></tr>
    </table>
  </td></tr>

  <!-- SUBSTACK -->
  <tr><td style="background:#050510;padding:28px 40px;border-top:1px solid #1a1a2e;">
    <p style="font-family:'DM Sans',Arial,sans-serif;font-size:12px;line-height:1.75;color:#555566;margin:0 0 12px;text-align:center;">
      Every week on Substack: the frameworks, the theory, and the case studies behind the Market Translation Gap™.
    </p>
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr><td align="center">
        <a href="${SUBSTACK_URL}" style="display:inline-block;border:1px solid #333344;color:#888899;font-family:'DM Sans',Arial,sans-serif;font-size:11px;font-weight:500;letter-spacing:0.15em;text-transform:uppercase;padding:12px 28px;text-decoration:none;">
          Read on Substack →
        </a>
      </td></tr>
    </table>
  </td></tr>

  <!-- FOOTER -->
  <tr><td style="background:#010313;padding:28px 40px;border-top:1px solid #0a0a1a;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="font-family:'DM Sans',Arial,sans-serif;font-size:11px;color:#333344;letter-spacing:0.12em;text-transform:uppercase;">
          Brenda Blanche™ · Market Translation Strategist · 2026
        </td>
        <td align="right" style="font-family:'DM Sans',Arial,sans-serif;font-size:11px;color:#333344;letter-spacing:0.1em;text-transform:uppercase;">
          #UnapologeticallyYou
        </td>
      </tr>
    </table>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}

// ══════════════════════════════════════════════
// BREVO API CALL
// ══════════════════════════════════════════════
function brevoRequest(path, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const options = {
      hostname: 'api.brevo.com',
      path,
      method:  'POST',
      headers: {
        'accept':       'application/json',
        'content-type': 'application/json',
        'api-key':      BREVO_API_KEY
      }
    };
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body }));
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

// ══════════════════════════════════════════════
// ADD CONTACT TO BREVO LIST
// ══════════════════════════════════════════════
async function addContactToBrevo(name, email, archetype, mts) {
  try {
    await brevoRequest('/v3/contacts', {
      email,
      attributes: {
        FIRSTNAME:  name,
        ARCHETYPE:  archetype,
        MTS_SCORE:  mts
      },
      listIds:     [12],
      updateEnabled: true
    });
  } catch(e) {
    console.error('Brevo contact error:', e.message);
  }
}

// ══════════════════════════════════════════════
// SEND EMAIL VIA BREVO
// ══════════════════════════════════════════════
async function sendReportEmail(name, email, archetype, mts, iScore, eScore, sScore) {
  const html = buildEmailHTML(name, archetype, mts, iScore, eScore, sScore);
  const r    = ARCHETYPES[archetype] || ARCHETYPES['HiddenExpert'];

  const result = await brevoRequest('/v3/smtp/email', {
    sender:  { name: FROM_NAME, email: FROM_EMAIL },
    to:      [{ email, name }],
    subject: `${name}, your Market Translation Report™ is here`,
    htmlContent: html,
    replyTo: { email: FROM_EMAIL, name: FROM_NAME },
    headers: {
      'X-Mailin-custom': `archetype:${archetype};mts:${mts}`
    }
  });

  return result;
}

// ══════════════════════════════════════════════
// MAIN HANDLER
// ══════════════════════════════════════════════
exports.handler = async (event) => {
  // CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin':  '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  let payload;
  try {
    payload = JSON.parse(event.body);
  } catch(e) {
    return { statusCode: 400, body: 'Invalid JSON' };
  }

  const {
    name           = 'there',
    email          = '',
    archetype      = 'HiddenExpert',
    mts            = 0,
    identityScore  = 0,
    expertiseScore = 0,
    structureScore = 0
  } = payload;

  if (!email || !email.includes('@')) {
    return { statusCode: 400, body: 'Invalid email' };
  }

  // Run both in parallel — don't let one failure block the other
  const [emailResult] = await Promise.allSettled([
    sendReportEmail(name, email, archetype, mts, identityScore, expertiseScore, structureScore),
    addContactToBrevo(name, email, archetype, mts)
  ]);

  const emailOk = emailResult.status === 'fulfilled' && emailResult.value.status < 300;

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      success:    true,
      emailSent:  emailOk,
      archetype,
      mts
    })
  };
};
