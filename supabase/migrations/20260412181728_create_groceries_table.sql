
create table if not exists groceries (
    "id" SERIAL PRIMARY KEY,
    "uuid" UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    "product_name" TEXT,
    "product_desc" TEXT,
    "quantity" INT DEFAULT 0
)