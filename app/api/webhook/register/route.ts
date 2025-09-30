import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { Webhook } from "svix";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEB_SIGN_SECRET!;

  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_signature || !svix_timestamp) {
    return new Response("Error occured - No svix headers");
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  //   try {
  //     evt = wh.verify(body, {
  //       "svix-id": svix_id,
  //       "svix-timestamp": svix_timestamp,
  //       "svix-signature": svix_signature,
  //     }) as WebhookEvent;
  //   } catch (error) {
  //     console.log("error verifying Webhook", error);
  //     return new Response("Error occured", { status: 400 });
  //   }

  if (process.env.NODE_ENV === "development") {
    evt = JSON.parse(body);
  } else {
    try {
      evt = wh.verify(body, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      }) as WebhookEvent;
    } catch (error) {
      console.log("error verifying Webhook", error);
      return new Response("Error Verifying Webhook", { status: 400 });
    }
  }

  const { id } = evt.data;
  const eventType = evt.type;

  console.log("Handler reached, eventType:", eventType);

  if (eventType === "user.created") {
    console.log("user.created branch entered");
    try {
      const { email_addresses, primary_email_address_id } = evt.data;
      console.log(email_addresses, primary_email_address_id);

      const primaryEmail = email_addresses.find(
        (email) => email.id === primary_email_address_id
      );

      console.log("Primary email:", primaryEmail); // log the whole object

      if (!primaryEmail) {
        console.log("No primary email found");
        throw new Response("No primary email found", { status: 400 });
      }

      console.log(
        "Ready to create user:",
        evt.data.id,
        primaryEmail.email_address
      );

      const newUser = await prisma.user.create({
        data: {
          id: evt.data.id,
          email: primaryEmail.email_address,
          isSubscribed: false,
        },
      });

      console.log("New user created", newUser);
    } catch (error) {
      return new Response("Error creating user", { status: 500 });
    }
  }

  return new Response("Webhook received successfully", { status: 200 });
}
