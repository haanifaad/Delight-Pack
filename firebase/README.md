# Delight Pack — Custom Orders (Firebase)

Cloud Functions, Firestore rules, and Storage rules for the **Request Custom Packaging** form.

## Architecture

```
React form → Storage (design uploads) → submitCustomOrder (callable)
                                              ↓
                                    Firestore: custom_orders
                                              ↓
                                    Nodemailer confirmation email
```

## Deploy

1. Install Firebase CLI: `npm install -g firebase-tools`
2. Log in: `firebase login`
3. From this folder (`firebase/`):

```bash
cd functions && npm install && npm run build && cd ..
firebase deploy --only functions,firestore,storage
```

## SMTP (confirmation emails)

Set secrets for production (Firebase Functions v2):

```bash
firebase functions:secrets:set SMTP_HOST
firebase functions:secrets:set SMTP_USER
firebase functions:secrets:set SMTP_PASS
firebase functions:secrets:set EMAIL_FROM
```

Or use `.env` with the [Firebase functions config](https://firebase.google.com/docs/functions/config-env) for local emulators. Copy `functions/.env.example`.

## Local emulators

```bash
cd functions && npm install && npm run build
cd .. && firebase emulators:start
```

In the React app (`.env.local`):

```
VITE_USE_FIREBASE_EMULATORS=true
```

## Alternative: Firebase Extension “Trigger Email”

Instead of Nodemailer in `submitCustomOrder`, you can install [Trigger Email from Firestore](https://extensions.dev/extensions/firebase/firestore-send-email):

1. Install the extension in the Firebase console.
2. Configure a collection (e.g. `mail`) with `to`, `message` fields.
3. In `submitCustomOrder`, after saving `custom_orders`, write a document to `mail` instead of calling `sendConfirmationEmail`.

The current implementation uses **Nodemailer** in the callable for immediate delivery without an extra collection.

## `custom_orders` document shape

| Field | Type | Description |
|-------|------|-------------|
| `orderId` | string | UUID from client |
| `status` | string | `pending_review` |
| `contact` | object | name, email, phone, company |
| `dimensions` | object | length, width, height, unit |
| `quantity` | number | units requested |
| `materialType` | string | `food_grade` \| `industrial` \| `eco_friendly` |
| `deliveryUrgency` | string | `standard` \| `express` \| `rush` |
| `designFiles` | array | Storage paths + metadata |
| `confirmationEmailSent` | boolean | set after email attempt |
