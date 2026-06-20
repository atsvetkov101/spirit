
CREATE TABLE public.products (
	id uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	price_amount numeric(12, 2) NOT NULL,
	price_currency varchar(3) DEFAULT 'RUB'::character varying NOT NULL,
	sku varchar(255) NULL,
	description text NULL,
	created_at timestamptz NOT NULL,
	updated_at timestamptz NOT NULL,
	CONSTRAINT products_pkey PRIMARY KEY (id)
);

CREATE TABLE public.order_lines (
	id uuid NOT NULL,
	order_id uuid NOT NULL,
	product_id uuid NOT NULL,
	quantity int4 NOT NULL,
	price_amount numeric(12, 2) NOT NULL,
	price_currency varchar(3) DEFAULT 'RUB'::character varying NOT NULL,
	created_at timestamptz NOT NULL,
	updated_at timestamptz NOT NULL,
	CONSTRAINT order_lines_pkey PRIMARY KEY (id)
);


CREATE TABLE public.orders (
	id uuid NOT NULL,
	status varchar(255) DEFAULT 'CREATED'::character varying NOT NULL,
	created_at timestamptz NOT NULL,
	updated_at timestamptz NOT NULL,
	CONSTRAINT orders_pkey PRIMARY KEY (id)
);





