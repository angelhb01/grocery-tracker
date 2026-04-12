alter table "public"."groceries" enable row level security;


  create policy "Allow users to delete their own groceries"
  on "public"."groceries"
  as permissive
  for delete
  to authenticated
using ((auth.uid() = uuid));



  create policy "Allow users to insert their own groceries"
  on "public"."groceries"
  as permissive
  for insert
  to authenticated
with check ((auth.uid() = uuid));



  create policy "Allow users to see their own groceries"
  on "public"."groceries"
  as permissive
  for select
  to authenticated
using ((auth.uid() = uuid));



  create policy "Allow users to update their own groceries"
  on "public"."groceries"
  as permissive
  for update
  to authenticated
using ((auth.uid() = uuid))
with check ((auth.uid() = uuid));



