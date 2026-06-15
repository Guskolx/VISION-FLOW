import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-204c9f61/health", (c) => {
  return c.json({ status: "ok" });
});

// Sign up endpoint
app.post("/make-server-204c9f61/auth/signup", async (c) => {
  try {
    const { email, password, name } = await c.req.json();

    if (!email || !password) {
      return c.json({ error: "Email and password are required" }, 400);
    }

    // Create user with Supabase Auth
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      // Automatically confirm the user's email since an email server hasn't been configured
      email_confirm: true,
    });

    if (error) {
      console.error("Sign up error:", error);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ 
      user: data.user,
      message: "User created successfully" 
    });
  } catch (error) {
    console.error("Sign up error:", error);
    return c.json({ error: "Failed to create user" }, 500);
  }
});

// Get user goals
app.get("/make-server-204c9f61/goals", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: "Unauthorized - No token provided" }, 401);
    }

    // Verify user
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(accessToken);
    
    if (error || !user) {
      console.error("Auth error while getting goals:", error);
      return c.json({ error: "Unauthorized - Invalid token" }, 401);
    }

    // Get user's goals from KV store
    const goalsKey = `user:${user.id}:goals`;
    const goals = await kv.get(goalsKey) || [];

    return c.json({ goals });
  } catch (error) {
    console.error("Error fetching goals:", error);
    return c.json({ error: "Failed to fetch goals" }, 500);
  }
});

// Save user goals
app.post("/make-server-204c9f61/goals", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: "Unauthorized - No token provided" }, 401);
    }

    // Verify user
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(accessToken);
    
    if (error || !user) {
      console.error("Auth error while saving goals:", error);
      return c.json({ error: "Unauthorized - Invalid token" }, 401);
    }

    const { goals } = await c.req.json();

    // Save user's goals to KV store
    const goalsKey = `user:${user.id}:goals`;
    await kv.set(goalsKey, goals);

    return c.json({ message: "Goals saved successfully" });
  } catch (error) {
    console.error("Error saving goals:", error);
    return c.json({ error: "Failed to save goals" }, 500);
  }
});

// Get user theme settings
app.get("/make-server-204c9f61/theme", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: "Unauthorized - No token provided" }, 401);
    }

    // Verify user
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(accessToken);
    
    if (error || !user) {
      console.error("Auth error while getting theme:", error);
      return c.json({ error: "Unauthorized - Invalid token" }, 401);
    }

    // Get user's theme from KV store
    const themeKey = `user:${user.id}:theme`;
    const theme = await kv.get(themeKey) || null;

    return c.json({ theme });
  } catch (error) {
    console.error("Error fetching theme:", error);
    return c.json({ error: "Failed to fetch theme" }, 500);
  }
});

// Save user theme settings
app.post("/make-server-204c9f61/theme", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: "Unauthorized - No token provided" }, 401);
    }

    // Verify user
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(accessToken);
    
    if (error || !user) {
      console.error("Auth error while saving theme:", error);
      return c.json({ error: "Unauthorized - Invalid token" }, 401);
    }

    const { theme } = await c.req.json();

    // Save user's theme to KV store
    const themeKey = `user:${user.id}:theme`;
    await kv.set(themeKey, theme);

    return c.json({ message: "Theme saved successfully" });
  } catch (error) {
    console.error("Error saving theme:", error);
    return c.json({ error: "Failed to save theme" }, 500);
  }
});

Deno.serve(app.fetch);