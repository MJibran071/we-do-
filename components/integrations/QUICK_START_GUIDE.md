# Quick Start Guide - New Integrations

## Getting Started with Your New Integrations

This guide will help you quickly set up and start using the 5 new integrations added to your property management platform.

---

## 🏠 VRBO Integration

### Why Use It?
Expand your reach to 100M+ travelers and avoid double bookings with automatic calendar sync.

### Quick Setup (5 minutes):
1. Go to [VRBO Partner Central](https://www.vrbo.com/partnercentral)
2. Navigate to **Settings → API Access**
3. Click **"Generate API Credentials"**
4. Copy your **Partner ID** and **API Key**
5. In your app: **Integrations → VRBO → Connect**
6. Paste credentials and select properties to sync

### First Steps After Connection:
- ✅ Verify calendar sync is working (check for existing bookings)
- ✅ Test guest messaging (send a test message)
- ✅ Review rate synchronization settings
- ✅ Enable automatic updates (recommended: every 5 minutes)

---

## 📈 PriceLabs Integration

### Why Use It?
Increase revenue by up to 40% with AI-powered dynamic pricing that adjusts automatically based on market conditions.

### Quick Setup (10 minutes):
1. Sign up at [PriceLabs](https://app.pricelabs.co)
2. Navigate to **Settings → Integrations**
3. Click **"Generate API Key"**
4. Copy your **API Key** and **Account ID**
5. In PriceLabs, configure your pricing strategy:
   - Set minimum and maximum prices
   - Enable "Last Minute Pricing"
   - Configure "Orphan Day Pricing"
6. In your app: **Integrations → PriceLabs → Connect**
7. Paste credentials

### First Steps After Connection:
- ✅ Set your base price range (min/max)
- ✅ Configure seasonal rules for holidays
- ✅ Enable automatic price updates
- ✅ Monitor the pricing dashboard for 7-14 days (calibration period)
- ✅ Review and adjust strategy based on results

### Pro Tips:
- Start conservative with your min/max range
- Use the "Pricing Dashboard" to see competitor rates
- Enable notifications for significant price changes

---

## 📱 Twilio Integration

### Why Use It?
Automate guest communication via SMS and reduce manual work by 80%.

### Quick Setup (15 minutes):
1. Sign up at [Twilio Console](https://www.twilio.com/console)
2. Navigate to **Account → API Keys & Tokens**
3. Copy your **Account SID** and **Auth Token**
4. Go to **Phone Numbers → Manage → Buy a Number**
5. Purchase a phone number (costs ~$1-2/month)
6. Copy your **Twilio Phone Number**
7. In your app: **Integrations → Twilio → Connect**
8. Paste all three credentials

### First Steps After Connection:
- ✅ Send a test SMS to your own phone
- ✅ Set up automated messages:
  - Pre-arrival (24 hours before check-in)
  - Check-in instructions (with door code)
  - Check-out reminder (morning of checkout)
  - Post-stay thank you
- ✅ Configure two-way messaging for guest questions
- ✅ Set up emergency notification templates

### Common Use Cases:
```
Pre-Arrival (24h before):
"Hi {guest_name}! Excited for your stay at {property_name} tomorrow. 
Check-in is at {check_in_time}. Your access code will be sent 1 hour before arrival."

Check-In (1h before):
"Welcome! Your door code is {door_code}. WiFi: {wifi_name}, Password: {wifi_password}. 
Need anything? Reply to this message!"

Check-Out (morning of):
"Good morning! Check-out is at {check_out_time}. Please lock the door and leave 
the key in the lockbox. Thanks for staying with us!"
```

### Cost Estimate:
- Phone number: $1-2/month
- SMS: $0.0075 per message (US)
- Example: 50 bookings/month × 4 messages = 200 messages = ~$1.50/month
- **Total: ~$3-4/month**

---

## 🔐 RemoteLock Integration

### Why Use It?
Eliminate key exchanges and provide 24/7 keyless check-in for guests.

### Quick Setup (30 minutes + hardware):
1. **Hardware Setup** (one-time):
   - Purchase compatible smart locks (Yale, Schlage, August, etc.)
   - Install locks at your properties
   - Connect locks to WiFi/Z-Wave hub

2. **Software Setup**:
   - Sign up at [RemoteLock](https://remotelock.com/login)
   - Add your locks to the RemoteLock platform
   - Navigate to **Settings → Integrations → API Access**
   - Click **"Create API Key"**
   - Copy your **API Key** and **Organization ID**
   - In your app: **Integrations → RemoteLock → Connect**
   - Paste credentials

### First Steps After Connection:
- ✅ Test lock/unlock remotely
- ✅ Generate a test access code
- ✅ Verify code activation/expiration times
- ✅ Set up automated code generation for bookings
- ✅ Configure cleaning crew codes
- ✅ Set up low battery alerts

### Automation Workflow:
1. **Booking Confirmed** → Access code generated automatically
2. **24 hours before check-in** → Code sent to guest via SMS/email
3. **1 hour before check-in** → Code activates
4. **Check-out time** → Code expires
5. **Cleaning scheduled** → Temporary cleaning code generated

### Compatible Locks:
- ✅ Yale Assure Lock (~$150-250)
- ✅ Schlage Encode (~$200-300)
- ✅ August Smart Lock (~$150-280)
- ✅ Kwikset Halo (~$180-250)
- ✅ Igloohome (~$200-300)
- ✅ Salto KS (~$250-400)

### Cost Estimate:
- Smart locks: $150-400 per door (one-time)
- RemoteLock subscription: $5/lock/month
- **Example: 3 properties = $15/month**

---

## 📧 Mailchimp Integration

### Why Use It?
Turn one-time guests into repeat customers with automated email campaigns.

### Quick Setup (10 minutes):
1. Sign up at [Mailchimp](https://mailchimp.com)
2. Navigate to **Account → Extras → API Keys**
3. Click **"Create A Key"**
4. Copy your **API Key**
5. Go to **Audience → Settings → Audience name and defaults**
6. Copy your **Audience ID**
7. In your app: **Integrations → Mailchimp → Connect**
8. Paste credentials

### First Steps After Connection:
- ✅ Import existing guest list
- ✅ Create guest segments:
  - VIP Guests (3+ bookings)
  - First-time guests
  - Business travelers
  - Families
  - Long-stay guests
- ✅ Set up automated campaigns:
  - Welcome email (after first booking)
  - Post-stay thank you (3 days after checkout)
  - Re-engagement (6 months after last stay)
  - Birthday special offers
- ✅ Design email templates

### Recommended Campaign Schedule:

**Welcome Series** (New Guest):
- Day 0: Booking confirmation + property highlights
- Day -7: Pre-arrival guide (what to pack, local tips)
- Day -1: Final details (check-in time, parking, WiFi)

**Post-Stay Series**:
- Day +3: Thank you + review request
- Day +30: "We miss you" + special offer for next booking
- Day +180: Re-engagement with seasonal promotion

**Regular Newsletters** (Monthly):
- Property updates and improvements
- Local events and attractions
- Seasonal promotions
- Guest stories and testimonials

### Segmentation Strategy:
```
VIP Guests (3+ bookings):
→ Exclusive early access to new properties
→ Loyalty discounts (10-15% off)
→ Birthday/anniversary perks

Business Travelers:
→ Weekday availability highlights
→ WiFi speed updates
→ Workspace amenities

Families:
→ Kid-friendly activities
→ Family packages
→ School holiday promotions

Couples:
→ Romantic packages
→ Local date ideas
→ Anniversary specials
```

### Cost Estimate:
- Free plan: Up to 500 contacts, 1,000 emails/month
- Essentials plan: $13/month for 500 contacts
- **Most hosts start with free plan**

---

## 🎯 Integration Workflow Examples

### Scenario 1: New Booking Received
1. **VRBO** → Booking synced to your calendar
2. **PriceLabs** → Adjusts prices for remaining dates
3. **RemoteLock** → Generates access code
4. **Twilio** → Sends booking confirmation SMS
5. **Mailchimp** → Adds guest to email list

### Scenario 2: Guest Check-In (Automated)
1. **24 hours before**: Twilio sends pre-arrival message
2. **1 hour before**: Twilio sends door code via SMS
3. **At check-in**: RemoteLock activates access code
4. **Day 1**: Mailchimp sends welcome email with local tips

### Scenario 3: Guest Check-Out (Automated)
1. **Morning of**: Twilio sends check-out reminder
2. **At check-out**: RemoteLock deactivates access code
3. **Day +3**: Mailchimp sends thank you + review request
4. **Day +3**: Twilio sends SMS review request
5. **Day +30**: Mailchimp sends "We miss you" email

---

## 📊 Success Metrics to Track

### VRBO:
- Booking conversion rate
- Average nightly rate vs. Airbnb
- Guest messaging response time

### PriceLabs:
- Revenue increase % (compare month-over-month)
- Occupancy rate
- Average daily rate (ADR)

### Twilio:
- Message delivery rate (should be >95%)
- Guest response rate
- Time saved on manual communication

### RemoteLock:
- Access code success rate (should be >99%)
- Guest check-in satisfaction
- Time saved on key exchanges

### Mailchimp:
- Email open rate (target: 20-30%)
- Click-through rate (target: 2-5%)
- Repeat booking rate
- Revenue from email campaigns

---

## 🆘 Troubleshooting

### VRBO Not Syncing?
- Check API credentials are correct
- Verify VRBO subscription is active
- Ensure properties are selected for sync
- Wait 15-30 minutes for initial sync

### PriceLabs Prices Not Updating?
- Verify API connection is active
- Check minimum/maximum price settings
- Ensure properties are linked correctly
- Review pricing rules for conflicts

### Twilio SMS Not Sending?
- Verify phone number is correct format (+1...)
- Check Twilio account balance
- Ensure Auth Token is current
- Test with your own number first

### RemoteLock Codes Not Working?
- Check lock has WiFi/Z-Wave connection
- Verify code activation time is correct
- Ensure lock batteries are charged (>20%)
- Test with manual code generation first

### Mailchimp Emails Going to Spam?
- Verify sender domain authentication
- Avoid spam trigger words (FREE, URGENT, etc.)
- Include physical address in footer
- Ask guests to add you to contacts

---

## 🚀 Next Steps

1. **Week 1**: Set up all 5 integrations
2. **Week 2**: Test automated workflows with upcoming bookings
3. **Week 3**: Monitor metrics and adjust settings
4. **Week 4**: Optimize based on performance data

### Advanced Features to Explore:
- [ ] Multi-property management across all platforms
- [ ] Custom pricing rules in PriceLabs
- [ ] SMS templates with dynamic variables in Twilio
- [ ] Master codes and cleaning schedules in RemoteLock
- [ ] A/B testing email campaigns in Mailchimp

---

## 💡 Pro Tips

1. **Start Small**: Connect one property first, test thoroughly, then scale
2. **Automate Gradually**: Begin with 2-3 automated messages, add more as you're comfortable
3. **Monitor Daily**: Check integration health for the first week
4. **Guest Feedback**: Ask guests about their experience with keyless entry and communication
5. **Iterate**: Review metrics monthly and adjust strategies

---

## 📞 Support Resources

- **VRBO**: [Partner Support](https://help.vrbo.com/partners)
- **PriceLabs**: [Help Center](https://pricelabs.co/resources/help-center)
- **Twilio**: [Documentation](https://www.twilio.com/docs)
- **RemoteLock**: [Support](https://remotelock.com/support)
- **Mailchimp**: [Knowledge Base](https://mailchimp.com/help/)

---

**Happy Automating! 🎉**

Your property management just got a whole lot easier.
