# JTPO_S Store

JTPO_S is a Ghana-focused electronics storefront built on React, Vite, and Supabase. It includes JT Originals and Curated Tech collections, inventory management, Moolre-only checkout, order tracking, reviews, product enquiries, and staff administration.

## Supabase setup

1. Apply `supabase/migrations/20261101000000_jt_initial.sql` to the JT Supabase project.
2. In Supabase Authentication, create the owner account. Copy that user's UUID, then run this in the SQL Editor:

   ```sql
   insert into public.admin_users (user_id, role)
   values ('OWNER_AUTH_USER_UUID', 'admin');
   ```

3. Add the Moolre credentials as Edge Function secrets: `MOOLRE_API_USER`, `MOOLRE_API_PUBKEY`, `MOOLRE_ACCOUNT_NUMBER`, and `MOOLRE_WEBHOOK_SECRET`. Set `ALLOWED_SITE_ORIGINS` to the deployed store URL. Never put these credentials in browser environment variables.
4. Deploy the Supabase functions in `supabase/functions`. Configure the Moolre webhook URL to point to the deployed `moolre-webhook` function.
5. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in the hosting provider's frontend environment.
6. Add real product images, prices, quantities, owner social handles, and the confirmed dispatch location in the admin system before opening the shop.

The supplied desktop product-and-prices document did not contain electronics, so no products have been seeded. Moolre credentials, owner account, and final website URL were not provided and must be entered in the secure setup locations above.
