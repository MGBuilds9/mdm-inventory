import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { db } from '@/server/db'
import { users, organizations, memberships } from '@/server/db/schema'

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env')
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400
    })
  }

  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occured', {
      status: 400
    })
  }

  // Handle the webhook
  const eventType = evt.type;
  
  if (eventType === 'user.created') {
    const { id, email_addresses, ...attributes } = evt.data;
    
    if (!email_addresses || email_addresses.length === 0) {
      return new Response('No email address found', { status: 400 });
    }

    const email = email_addresses[0].email_address;
    
    try {
      // Check if any organizations exist
      const existingOrgs = await db.select().from(organizations).limit(1);
      
      let orgId: string;
      
      if (existingOrgs.length === 0) {
        // Create default organization
        const [newOrg] = await db.insert(organizations).values({
          name: 'MDM Group Inc.',
        }).returning({ id: organizations.id });
        
        orgId = newOrg.id;
      } else {
        orgId = existingOrgs[0].id;
      }

      // Create user
      const [newUser] = await db.insert(users).values({
        clerk_user_id: id,
        email,
        display_name: attributes.first_name && attributes.last_name 
          ? `${attributes.first_name} ${attributes.last_name}` 
          : undefined,
      }).returning({ id: users.id });

      // Create membership with admin role
      await db.insert(memberships).values({
        org_id: orgId,
        user_id: newUser.id,
        role_key: 'admin',
      });

      console.log(`User ${email} created and assigned admin role in organization ${orgId}`);
      
    } catch (error) {
      console.error('Error creating user:', error);
      return new Response('Error creating user', { status: 500 });
    }
  }

  return new Response('', { status: 200 })
}
