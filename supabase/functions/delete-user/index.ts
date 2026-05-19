// Setup type definitions for built-in Supabase Runtime APIs
import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";

export default {
  fetch: withSupabase({ auth: ["user"] }, async (req, ctx) => {
    // Parses into Json format and grabs the userId from the body
    const body = await req.json();
    const userId = body.userId;

    if (!userId) {
      return Response.json({ error: "User ID is required" }, { status: 400 });
    }

    const {
      data: { user },
      error: userError,
    } = await ctx.supabase.auth.getUser();

    if (userError || !user) {
      return Response.json(
        { error: "Unauthorized: No session found" },
        { status: 401 }
      );
    }

    if (user.id !== userId) {
      return Response.json(
        { error: "Forbidden: You can only delete your own account" },
        { status: 403 }
      );
    }

    const { data, error } = await ctx.supabaseAdmin.auth.admin.deleteUser(userId);

    if (error) {
      return Response.json({ error: error.message }, { status: 400 });
    }

    return Response.json({
      message: `User ${userId} successfully deleted`,
      data
    })
  }),
};
