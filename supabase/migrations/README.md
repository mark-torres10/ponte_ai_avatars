# Supabase Migrations

This directory contains database migrations for the Ponte AI marketplace authentication system.

## Migration Naming Convention

All migration files must follow this naming pattern:

```
YYYYMMDDHHMMSS_descriptive_name.sql
```

### Format Requirements:
- **Timestamp**: `YYYYMMDDHHMMSS` (UTC time, no separators)
- **Separator**: Underscore `_` between timestamp and description
- **Description**: Lowercase with underscores, descriptive of the change
- **Extension**: `.sql`

### Examples:
```
20250805210445_create_users_table.sql
20250806143000_add_user_preferences.sql
20250807091530_update_role_constraints.sql
```

## Creating New Migrations

### 1. Generate Timestamp
Use this command to generate the correct UTC timestamp:

```bash
date -u +"%Y%m%d%H%M%S"
```

### 2. Create Migration File
Create a new file with the timestamp and descriptive name:

```bash
# Example
touch supabase/migrations/$(date -u +"%Y%m%d%H%M%S")_your_migration_name.sql
```

### 3. Write Migration SQL
Include:
- Clear comments explaining the purpose
- Proper SQL syntax
- Error handling with `IF NOT EXISTS` where appropriate
- Indexes for performance
- RLS policies for security
- Documentation comments

### 4. Apply Migration
```bash
supabase db push
```

## Migration Best Practices

### Do's:
- ✅ Use descriptive names that explain what the migration does
- ✅ Include comments explaining complex logic
- ✅ Use `IF NOT EXISTS` for idempotent operations
- ✅ Add appropriate indexes for performance
- ✅ Include RLS policies for security
- ✅ Test migrations on a development database first
- ✅ Keep migrations small and focused on one change

### Don'ts:
- ❌ Use generic names like "update_table.sql"
- ❌ Modify existing migration files after they've been applied
- ❌ Include data migrations in schema migrations
- ❌ Skip testing before applying to production
- ❌ Create migrations that can't be rolled back

## Migration Commands

### List Migrations
```bash
supabase migration list
```

### Apply Migrations
```bash
supabase db push
```

### Reset Database
```bash
supabase db reset
```

### Repair Migration History
```bash
supabase migration repair --status applied <migration_name>
supabase migration repair --status reverted <migration_name>
```

## Current Migrations

### 20250805210445_create_users_table.sql
- Creates the `users` table for authentication
- Defines user roles (admin, client, talent)
- Sets up RLS policies for security
- Adds performance indexes
- Includes auto-updating timestamps

## Troubleshooting

### Migration Conflicts
If you encounter migration conflicts:
1. Check the migration history: `supabase migration list`
2. Repair the migration status if needed
3. Ensure local and remote are in sync

### Rollback Issues
If you need to rollback:
1. Create a new migration that reverses the changes
2. Never modify existing migration files
3. Test rollback migrations thoroughly

## References
- [Supabase CLI Documentation](https://supabase.com/docs/guides/cli)
- [Database Migrations Guide](https://supabase.com/docs/guides/database/migrations)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security) 