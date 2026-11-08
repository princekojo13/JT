alter table public.store_settings
  add column if not exists hero_eyebrow text,
  add column if not exists hero_title text,
  add column if not exists hero_copy text,
  add column if not exists hero_image_url text,
  add column if not exists promo_banner_text text,
  add column if not exists promo_banner_link text;

update public.store_settings set
  hero_eyebrow = coalesce(hero_eyebrow, 'Tech for the life you’re building'),
  hero_title = coalesce(hero_title, 'Technology meets your own story.'),
  hero_copy = coalesce(hero_copy, 'Your next device, your next idea, your next move. Discover standout electronics selected for the way you live, work and create.'),
  promo_banner_text = coalesce(promo_banner_text, ''),
  promo_banner_link = coalesce(promo_banner_link, '/special-offers')
where id = true;

grant select (hero_eyebrow, hero_title, hero_copy, hero_image_url, promo_banner_text, promo_banner_link)
  on public.store_settings to anon, authenticated;
