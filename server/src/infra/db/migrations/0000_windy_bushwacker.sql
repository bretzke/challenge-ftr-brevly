CREATE TABLE "links" (
	"id" uuid PRIMARY KEY NOT NULL,
	"original_link" varchar(2048) NOT NULL,
	"short_link" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "links_short_link_unique" UNIQUE("short_link")
);
--> statement-breakpoint
CREATE TABLE "visits" (
	"id" uuid PRIMARY KEY NOT NULL,
	"link_id" uuid NOT NULL,
	"acessed_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
ALTER TABLE "visits" ADD CONSTRAINT "visits_link_id_links_id_fk" FOREIGN KEY ("link_id") REFERENCES "public"."links"("id") ON DELETE cascade ON UPDATE no action;