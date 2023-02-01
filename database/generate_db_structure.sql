-- public.domains definition

-- Drop table

-- DROP TABLE public.domains;

CREATE TABLE public.domains (
	id int4 NOT NULL GENERATED ALWAYS AS IDENTITY,
	"name" varchar NOT NULL,
	repo_url varchar NULL,
	tool_annotations_file_name varchar NULL,
	ontology_file_name varchar NULL,
	docker_image_url varchar NULL,
	CONSTRAINT domains_pk PRIMARY KEY (id)
);


-- public.research_topics definition

-- Drop table

-- DROP TABLE public.research_topics;

CREATE TABLE public.research_topics (
	id int4 NOT NULL GENERATED ALWAYS AS IDENTITY,
	"name" varchar NOT NULL,
	description varchar NULL,
	CONSTRAINT research_topics_pk PRIMARY KEY (id)
);


-- public.roles definition

-- Drop table

-- DROP TABLE public.roles;

CREATE TABLE public.roles (
	id int4 NOT NULL GENERATED ALWAYS AS IDENTITY,
	"name" varchar NOT NULL,
	description varchar NULL,
	CONSTRAINT roles_pk PRIMARY KEY (id)
);


-- public.users definition

-- Drop table

-- DROP TABLE public.users;

CREATE TABLE public.users (
	id int4 NOT NULL GENERATED ALWAYS AS IDENTITY,
	first_name varchar NULL,
	last_name varchar NULL,
	affiliation_name varchar NULL,
	"position" varchar NULL,
	orchid_id varchar NOT NULL,
	CONSTRAINT users_pk PRIMARY KEY (id)
);


-- public.doman_topics definition

-- Drop table

-- DROP TABLE public.doman_topics;

CREATE TABLE public.doman_topics (
	domain_id int4 NOT NULL,
	topic_id int4 NOT NULL,
	CONSTRAINT doman_topics_pk PRIMARY KEY (domain_id, topic_id),
	CONSTRAINT doman_topics_fk FOREIGN KEY (domain_id) REFERENCES public.domains(id),
	CONSTRAINT doman_topics_fk_1 FOREIGN KEY (topic_id) REFERENCES public.research_topics(id)
);


-- public.user_roles definition

-- Drop table

-- DROP TABLE public.user_roles;

CREATE TABLE public.user_roles (
	id int4 NOT NULL GENERATED ALWAYS AS IDENTITY,
	user_id int4 NOT NULL,
	role_id int4 NOT NULL,
	CONSTRAINT user_roles_pk PRIMARY KEY (id),
	CONSTRAINT user_roles_fk FOREIGN KEY (role_id) REFERENCES public.roles(id),
	CONSTRAINT user_roles_fk_1 FOREIGN KEY (user_id) REFERENCES public.users(id)
);